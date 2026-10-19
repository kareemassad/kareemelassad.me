export function createReplication({ lag = 3, mode = 'async' } = {}) {
  return { time: 0, lag, mode, version: 0, leader: 0, followers: [0, 0], pending: [], partitioned: false, acknowledged: 0, events: [] };
}

function log(state, text, kind = 'info') { state.events.push({ time: state.time, text, kind }); }

function deliver(state) {
  if (state.partitioned) return;
  const remaining = [];
  for (const message of state.pending) {
    if (message.at <= state.time) {
      state.followers[message.node] = Math.max(state.followers[message.node], message.version);
      log(state, `Follower ${message.node === 0 ? 'A' : 'B'} applies v${message.version}.`, 'delivery');
      if (message.node === 0 && state.mode === 'sync' && message.version > state.acknowledged) {
        state.acknowledged = message.version;
        log(state, `v${message.version} is acknowledged after follower A responds.`, 'ack');
      }
    } else remaining.push(message);
  }
  state.pending = remaining;
}

export function replicationWrite(state) {
  state.version += 1; state.leader = state.version;
  log(state, `Leader stores v${state.version}.`, 'write');
  state.pending.push({ at: state.time + state.lag, node: 0, version: state.version }, { at: state.time + state.lag + 2, node: 1, version: state.version });
  if (state.mode === 'async') {
    state.acknowledged = state.version;
    log(state, `v${state.version} is acknowledged before the followers respond.`, 'ack');
  }
  deliver(state);
  return state;
}

export function replicationStep(state, seconds = 1) {
  state.time += seconds; deliver(state); return state;
}

export function replicationPartition(state, partitioned) {
  state.partitioned = partitioned;
  log(state, partitioned ? 'Network partition: messages to both followers stop.' : 'Network restored: overdue messages can arrive.');
  deliver(state); return state;
}

export function replicationRead(state, node = 1) {
  const version = state.followers[node];
  const stale = version < state.leader;
  log(state, `Read follower ${node === 0 ? 'A' : 'B'}: v${version}${stale ? ` (leader has v${state.leader})` : ' (current)'}.`, stale ? 'stale' : 'read');
  return { version, stale, acknowledged: state.acknowledged };
}

export function quorum({ n = 5, w = 3, r = 3, failed = [], write = true } = {}) {
  const healthy = Array.from({ length: n }, (_, i) => i).filter(i => !failed.includes(i));
  const writeAvailable = healthy.length >= w;
  const readAvailable = healthy.length >= r;
  const written = write && writeAvailable ? healthy.slice(0, w) : [];
  const read = readAvailable ? healthy.slice(-r) : [];
  const overlap = read.filter(i => written.includes(i));
  return { healthy, written, read, overlap, writeAvailable, readAvailable, guaranteed: w + r > n, latest: overlap.length > 0 };
}

export function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d); h ^= h >>> 15; h = Math.imul(h, 0x846ca68b); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

export function makeRing(nodes, virtual = 8) {
  const tokens = [];
  for (let i = 0; i < nodes; i++) for (let v = 0; v < virtual; v++) tokens.push({ position: hash(`node:${i}:token:${v}`), node: i });
  return tokens.sort((a, b) => a.position - b.position);
}

export function assignKeys(nodes, method = 'ring', virtual = 8, count = 120) {
  const ring = makeRing(nodes, virtual);
  return Array.from({ length: count }, (_, i) => {
    const position = hash(`account:${i}`);
    const node = method === 'modulo' ? Math.floor(position * 4294967296) % nodes : (ring.find(t => t.position >= position) || ring[0]).node;
    return { key: `account:${i}`, position, node };
  });
}

export function partitionExperiment(nodes = 3, method = 'ring', virtual = 8, count = 120) {
  const before = assignKeys(nodes, method, virtual, count);
  const after = assignKeys(nodes + 1, method, virtual, count);
  const moved = after.filter((key, i) => key.node !== before[i].node);
  const loads = Array.from({ length: nodes + 1 }, (_, i) => after.filter(k => k.node === i).length);
  return { before, after, moved, loads, percent: moved.length / count * 100 };
}

export function createTransaction(mode = 'snapshot') {
  return { mode, step: 0, doctors: [true, true], snapshots: [null, null], decisions: [false, false], statuses: ['Not started', 'Not started'], history: [], finished: false };
}

export function transactionStep(state) {
  if (state.finished) return state;
  const s = state.step;
  if (s < 2) {
    state.snapshots[s] = [...state.doctors];
    state.decisions[s] = state.doctors.filter(Boolean).length >= 2;
    state.statuses[s] = 'Read: 2 on call';
    state.history.push(`T${s + 1} reads both doctors on call. It plans to remove doctor ${s === 0 ? 'A' : 'B'}.`);
  } else if (s === 2) {
    state.doctors[0] = false; state.statuses[0] = 'Committed';
    state.history.push('T1 commits. Doctor A goes off call.');
  } else if (s === 3) {
    if (state.mode === 'serializable') {
      state.statuses[1] = 'Aborted: retry required';
      state.history.push('The conflicting history cannot be serial. T2 aborts. Its write does not commit.');
    } else {
      state.doctors[1] = false; state.statuses[1] = 'Committed';
      state.history.push('T2 commits a different row using its earlier snapshot. No doctor remains on call.');
    }
  } else {
    if (state.mode === 'serializable') {
      state.snapshots[1] = [...state.doctors]; state.decisions[1] = false; state.statuses[1] = 'Retried: stays on call';
      state.history.push('T2 retries with a fresh snapshot. Only B is on call, so B stays on call.');
    } else state.history.push('Write skew: both row updates succeed, but the shared rule fails.');
    state.finished = true;
  }
  state.step += 1; return state;
}

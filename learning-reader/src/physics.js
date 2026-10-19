// Original analytic teaching models. SI units throughout; coordinates are metres.
export const K = 8.9875517923e9;
export const EPS0 = 1 / (4 * Math.PI * K);
export const NC = 1e-9;
export const norm = v => Math.hypot(...v);
export const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
export const unit = v => { const n = norm(v); return n > 0 ? v.map(x => x / n) : v.map(() => 0); };
export function field(charges, p) {
  const sum = [0, 0, 0];
  for (const c of charges) {
    if (c.q === 0) continue;
    const r = p.map((v, i) => v - (c.p[i] || 0));
    const distance = norm(r);
    if (distance < 1e-10) return [NaN, NaN, NaN];
    for (let i = 0; i < 3; i++) sum[i] += K * c.q * r[i] / distance ** 3;
  }
  return sum;
}
export function potential(charges, p) {
  let total = 0;
  for (const c of charges) {
    if (c.q === 0) continue;
    const r = norm(p.map((v, i) => v - (c.p[i] || 0)));
    if (r < 1e-10) return NaN;
    total += K * c.q / r;
  }
  return total;
}
export function pairForce(q1, q2, p1, p2) {
  return field([{q: q2, p: p2}], p1).map(e => q1 * e);
}
export function externalWork(charges, a, b, testCharge = 1) {
  return testCharge * (potential(charges, b) - potential(charges, a));
}
export function integrateWork(charges, points, testCharge = 1) {
  let w = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    const midpoint = a.map((v, j) => (v + b[j]) / 2);
    w -= testCharge * dot(field(charges, midpoint), b.map((v, j) => v - a[j]));
  }
  return w;
}
export function enclosedFlux(charges, radius, center = [0, 0, 0]) {
  let q = 0;
  for (const c of charges) {
    if (c.q === 0) continue;
    const r = norm(c.p.map((v, i) => v - center[i]));
    if (Math.abs(r - radius) < 1e-8) return NaN; // Surface-charge boundary case is outside this model.
    if (r < radius) q += c.q;
  }
  return q / EPS0;
}
export function numericSphereFlux(charges, radius, count = 20000) {
  // Fibonacci quadrature of the true 3D surface, independent of the enclosure rule.
  let sum = 0;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const z = 1 - 2 * (i + .5) / count, r = Math.sqrt(1 - z * z), a = i * golden;
    const n = [r * Math.cos(a), r * Math.sin(a), z];
    sum += dot(field(charges, n.map(x => radius * x)), n);
  }
  return sum * 4 * Math.PI * radius ** 2 / count;
}
export function coneFlux(q, inner, outer, angle) {
  const omega = 2 * Math.PI * (1 - Math.cos(angle));
  const ea = K * q / inner ** 2, eb = K * q / outer ** 2;
  const aa = omega * inner ** 2, ab = omega * outer ** 2;
  return {omega, ea, eb, aa, ab, inner: -ea * aa, outer: eb * ab, sides: 0};
}
export function sphereOutside(density, radius, distance) {
  if (distance < radius) throw new RangeError('This prepared passage derives the exterior field only.');
  const q = density * 4 * Math.PI * radius ** 3 / 3;
  return {q, e: K * q / distance ** 2};
}
export function dipole(q, separation) {
  return [{q: -q, p: [-separation / 2, 0, 0]}, {q, p: [separation / 2, 0, 0]}];
}
export function traceLine(charges, start, direction = 1, limit = 1100) {
  // RK4 on d(position)/ds = ± E/|E|. Adaptive step near point charges.
  const points = [start]; let p = [...start];
  const f = at => unit(field(charges, at)).map(v => v * direction);
  const add = (a, b, s) => a.map((v, i) => v + b[i] * s);
  for (let i = 0; i < limit; i++) {
    const nearest = Math.min(...charges.map(c => norm(p.map((v, j) => v - c.p[j]))));
    if (nearest < .065 || Math.abs(p[0]) > 3.7 || Math.abs(p[1]) > 2.6) break;
    const h = Math.min(.035, nearest * .12);
    const a = f(p), b = f(add(p, a, h / 2)), c = f(add(p, b, h / 2)), d = f(add(p, c, h));
    p = p.map((v, j) => v + h * (a[j] + 2 * b[j] + 2 * c[j] + d[j]) / 6);
    if (!p.every(Number.isFinite)) break;
    points.push(p);
  }
  return points;
}
const contourGrids = new Map();
export function contourSegments(charges, level, columns = 288, rows = 200) {
  const x0 = -3.6, y0 = -2.5, dx = 7.2 / columns, dy = 5 / rows;
  // Reuse the analytic samples for all levels in one scene. Keep memory bounded.
  const key=JSON.stringify([charges,columns,rows]);let grid=contourGrids.get(key);
  if(!grid){
    const values=[],valid=[];
    for(let j=0;j<=rows;j++){values[j]=[];valid[j]=[];for(let i=0;i<=columns;i++){
      const p=[x0+i*dx,y0+j*dy,0];values[j][i]=potential(charges,p);
      valid[j][i]=charges.every(c=>norm(p.map((v,k)=>v-c.p[k]))>=.13);
    }}
    grid={values,valid};if(contourGrids.size>=4)contourGrids.delete(contourGrids.keys().next().value);contourGrids.set(key,grid);
  }
  const {values,valid}=grid;
  const segments = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < columns; i++) {
    if(!valid[j][i]||!valid[j][i+1]||!valid[j+1][i+1]||!valid[j+1][i])continue;
    const v = [values[j][i], values[j][i + 1], values[j + 1][i + 1], values[j + 1][i]];
    if(level<Math.min(...v)||level>Math.max(...v))continue;
    const p = [[x0 + i * dx, y0 + j * dy, 0], [x0 + (i + 1) * dx, y0 + j * dy, 0], [x0 + (i + 1) * dx, y0 + (j + 1) * dy, 0], [x0 + i * dx, y0 + (j + 1) * dy, 0]];
    const crossings = [];
    for (let a = 0; a < 4; a++) { const b = (a + 1) % 4;
      if (!Number.isFinite(v[a]) || !Number.isFinite(v[b])) continue;
      if ((v[a] < level) !== (v[b] < level)) {
        const t = (level - v[a]) / (v[b] - v[a]);
        crossings.push(p[a].map((x, k) => x + (p[b][k] - x) * t));
      }
    }
    if (crossings.length === 2) segments.push(crossings);
    if (crossings.length === 4) {
      // Asymptotic decider for the bilinear interpolant: resolve a saddle consistently.
      const z = v.map(x => x - level), determinant = z[0] * z[2] - z[1] * z[3];
      if (determinant >= 0) segments.push([crossings[0], crossings[1]], [crossings[2], crossings[3]]);
      else segments.push([crossings[0], crossings[3]], [crossings[1], crossings[2]]);
    }
  }
  return segments;
}
export function joinContourSegments(segments) {
  // Stitch shared grid-edge intersections so dashed contours remain continuous.
  const key=p=>p.slice(0,2).map(v=>v.toFixed(7)).join(',');
  const links=new Map(),visited=new Set(),paths=[];
  segments.forEach((segment,i)=>segment.forEach((p,end)=>{
    const k=key(p);if(!links.has(k))links.set(k,[]);links.get(k).push({i,end});
  }));
  const ends=i=>segments[i].some(p=>links.get(key(p)).length===1);
  const order=segments.map((_,i)=>i).sort((a,b)=>Number(ends(b))-Number(ends(a)));
  for(const i of order){
    if(visited.has(i))continue;
    const seg=segments[i],start=links.get(key(seg[1])).length===1?seg[1]:seg[0];
    const path=[start];let at=start;
    while(true){
      const next=links.get(key(at))?.find(link=>!visited.has(link.i));
      if(!next)break;visited.add(next.i);at=segments[next.i][1-next.end];path.push(at);
    }
    paths.push(path);
  }
  return paths;
}

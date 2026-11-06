// Source-bound stages. Generated from tools/ddia-story-passages.mjs.
export const storyCues=[
  {
    "chapter": 1,
    "title": "Start with cheap writes",
    "at": {
      "page": 30,
      "y": 0.621757581254724
    },
    "demo": "ddia-tradeoff-feed",
    "params": {
      "push": "0"
    },
    "note": "Store the post once. Watch each reader assemble a timeline. The work appears when readers arrive."
  },
  {
    "chapter": 1,
    "title": "Move the work to posting",
    "at": {
      "page": 31,
      "y": 0.7195373847316704
    },
    "demo": "ddia-tradeoff-feed",
    "params": {
      "push": "1"
    },
    "note": "Keep the same followers. Prepare their timelines when the post arrives, then compare later reads."
  },
  {
    "chapter": 2,
    "title": "Give the shared fact one home",
    "at": {
      "page": 53,
      "y": 0.25407410430839006
    },
    "demo": "ddia-shape-references",
    "params": {
      "normalized": "1"
    },
    "note": "The same six people now reference one organization. A rename changes one fact instead of six copies."
  },
  {
    "chapter": 2,
    "title": "Change the plan, preserve the answer",
    "at": {
      "page": 64,
      "y": 0.21901247165532878
    },
    "demo": "ddia-shape-query",
    "params": {
      "indexed": "1"
    },
    "note": "Use the index to find the same matching rows. The requested result stays fixed while the route to it changes."
  },
  {
    "chapter": 4,
    "title": "Reverse the version boundary",
    "at": {
      "page": 138,
      "y": 0.18002042328042323
    },
    "demo": "ddia-encoding-tagged",
    "params": {
      "writer": "0",
      "reader": "1",
      "change": "0"
    },
    "note": "Now the new reader opens an old record. The absent optional city must not invalidate the old data."
  },
  {
    "chapter": 4,
    "title": "Break the field identity",
    "at": {
      "page": 138,
      "y": 0.3614161602418745
    },
    "demo": "ddia-encoding-tagged",
    "params": {
      "writer": "1",
      "reader": "0",
      "change": "2"
    },
    "note": "Reuse the old name tag for city. The old reader can parse the bytes yet assign the wrong meaning."
  },
  {
    "chapter": 4,
    "title": "Keep what the old writer does not understand",
    "at": {
      "page": 146,
      "y": 0.8696790476190475
    },
    "demo": "ddia-encoding-roundtrip",
    "params": {
      "preserve": "1"
    },
    "note": "Repeat the same name edit while carrying the opaque city field through the old application. Compare the saved record."
  },
  {
    "chapter": 5,
    "title": "Reply before every copy catches up",
    "at": {
      "page": 170,
      "y": 0.09475963718820857
    },
    "demo": "ddia-ack",
    "params": {
      "sync": "0",
      "failure": "0",
      "run": true
    },
    "note": "Follow the acknowledgment and the delayed copies separately. A success reply does not mean every follower is current."
  },
  {
    "chapter": 6,
    "title": "Split the hot key",
    "at": {
      "page": 218,
      "y": 0.3224240816326529
    },
    "demo": "ddia-partition-placement",
    "params": {
      "method": "1",
      "workload": "2",
      "salts": 4,
      "query": "0"
    },
    "note": "Keep the hot logical key, but add suffixes to spread its writes. Reading the logical key now requires gathering those pieces."
  },
  {
    "chapter": 7,
    "title": "Read one version of the world",
    "at": {
      "page": 251,
      "y": 0.2752585034013605
    },
    "demo": "ddia-transaction-snapshot",
    "params": {
      "snapshot": "1"
    },
    "note": "Repeat the two reads around the same transfer. A snapshot keeps both reads in one committed version."
  },
  {
    "chapter": 7,
    "title": "Move the increment into the database",
    "at": {
      "page": 255,
      "y": 0.5271973998488284
    },
    "demo": "ddia-transaction-counter",
    "params": {
      "mode": "1"
    },
    "note": "Keep both clients. Replace stale read-then-write with an atomic increment and count the surviving updates."
  },
  {
    "chapter": 7,
    "title": "Reject the stale decision",
    "at": {
      "page": 257,
      "y": 0.44304317460317455
    },
    "demo": "ddia-transaction-counter",
    "params": {
      "mode": "2",
      "retry": "0"
    },
    "note": "The second client cannot overwrite the first increment. Rejection prevents loss, but that increment is still incomplete."
  },
  {
    "chapter": 7,
    "title": "Retry from the new value",
    "at": {
      "page": 257,
      "y": 0.7336370370370371
    },
    "demo": "ddia-transaction-counter",
    "params": {
      "mode": "2",
      "retry": "1"
    },
    "note": "Read the current counter after rejection, then try again. Both intended increments can now complete."
  },
  {
    "chapter": 7,
    "title": "Let the second decision see the first",
    "at": {
      "page": 259,
      "y": 0.8601962962962963
    },
    "demo": "ddia-transaction-skew",
    "params": {
      "mode": "1"
    },
    "note": "Repeat the doctors’ decisions in serial order. The second doctor sees only one remaining doctor and stays."
  },
  {
    "chapter": 8,
    "title": "Reveal a different hidden history",
    "at": {
      "page": 291,
      "y": 0.4007309448223735
    },
    "demo": "ddia-fault-uncertainty",
    "params": {
      "world": "1",
      "reveal": "1"
    },
    "note": "The client still receives no reply, but this time the server performed the work. Silence alone cannot tell these histories apart."
  },
  {
    "chapter": 8,
    "title": "Wait long enough for the slow reply",
    "at": {
      "page": 294,
      "y": 0.4633296598639455
    },
    "demo": "ddia-fault-uncertainty",
    "params": {
      "world": "2",
      "delay": 120,
      "timeout": 180,
      "reveal": "1"
    },
    "note": "The server was slow, not dead. A longer timeout changes the client observation; it does not make failure detection certain."
  },
  {
    "chapter": 8,
    "title": "Let an expired owner resume",
    "at": {
      "page": 315,
      "y": 0.5342425245653817
    },
    "demo": "ddia-fault-fencing",
    "params": {
      "check": "0",
      "pause": "1"
    },
    "note": "A resumes after B has written with a newer lease. Without a storage check, the stale owner can overwrite newer work."
  },
  {
    "chapter": 8,
    "title": "Enforce the boundary at storage",
    "at": {
      "page": 316,
      "y": 0.24802722600151172
    },
    "demo": "ddia-fault-fencing",
    "params": {
      "check": "1",
      "pause": "1"
    },
    "note": "Replay the same delayed write. The resource rejects the older token, so the newer work survives."
  },
  {
    "chapter": 9,
    "title": "Carry the observed order",
    "at": {
      "page": 358,
      "y": 0.3886372789115645
    },
    "demo": "ddia-consensus-logical",
    "params": {
      "carry": "1",
      "start": 9
    },
    "note": "The receive event takes the maximum observed counter before incrementing. The message now transfers causal knowledge."
  },
  {
    "chapter": 9,
    "title": "Stop after the promises",
    "at": {
      "page": 369,
      "y": 0.7977947543461829
    },
    "demo": "ddia-consensus-commit",
    "params": {
      "vote": "1",
      "crash": "1",
      "recover": "0"
    },
    "note": "Both participants prepared. Stop the coordinator before its durable decision and inspect what the participants still cannot know."
  },
  {
    "chapter": 9,
    "title": "Recover the durable decision",
    "at": {
      "page": 370,
      "y": 0.7640416024187453
    },
    "demo": "ddia-consensus-commit",
    "params": {
      "vote": "1",
      "crash": "2",
      "recover": "1"
    },
    "note": "This time a commit decision was recorded before the crash. Recovery delivers that same decision to the waiting participant."
  },
  {
    "chapter": 10,
    "title": "Share the hot key’s work",
    "at": {
      "page": 417,
      "y": 0.09475963718820857
    },
    "demo": "ddia-batch-join",
    "params": {
      "strategy": "2",
      "hot": 12
    },
    "note": "Split the same hot user’s events across workers and copy its profile. Compare the busiest worker with partitioning by key."
  },
  {
    "chapter": 10,
    "title": "Recover by repeating deterministic work",
    "at": {
      "page": 431,
      "y": 0.44350048374905515
    },
    "demo": "ddia-batch-recovery",
    "params": {
      "checkpoint": "0",
      "failure": "1"
    },
    "note": "Lose the intermediate values. Trace the same durable inputs through the operators again to restore the result."
  },
  {
    "chapter": 11,
    "title": "Give a new reader its own position",
    "at": {
      "page": 457,
      "y": 0.4177491609977323
    },
    "demo": "ddia-stream-log",
    "params": {
      "start": 0,
      "earliest": 0
    },
    "note": "Rewind consumer B. Consumer A keeps its position and the input records remain in the log."
  },
  {
    "chapter": 11,
    "title": "Keep the last complete value",
    "at": {
      "page": 464,
      "y": 0.29944594104308386
    },
    "demo": "ddia-stream-projection",
    "params": {
      "mode": "0",
      "compact": "1"
    },
    "note": "A complete replacement record contains the current quantity. Keeping the last record still reconstructs that value."
  },
  {
    "chapter": 11,
    "title": "Try the same shortcut on changes",
    "at": {
      "page": 464,
      "y": 0.43882622826908535
    },
    "demo": "ddia-stream-projection",
    "params": {
      "mode": "1",
      "compact": "1"
    },
    "note": "Now each event is a delta. Keeping only the last event loses the earlier changes and gives the wrong quantity."
  },
  {
    "chapter": 11,
    "title": "Close a window before every event arrives",
    "at": {
      "page": 475,
      "y": 0.5152362358276644
    },
    "demo": "ddia-stream-windows",
    "params": {
      "clock": "0",
      "delay": 18,
      "policy": "0"
    },
    "note": "The event happened inside the window but arrived late. Dropping it leaves an incomplete result."
  },
  {
    "chapter": 11,
    "title": "Correct the result when evidence arrives",
    "at": {
      "page": 476,
      "y": 0.18304385487528352
    },
    "demo": "ddia-stream-windows",
    "params": {
      "clock": "0",
      "delay": 18,
      "policy": "1"
    },
    "note": "Keep the event’s original time. A correction changes the earlier window rather than assigning the event to its arrival window."
  },
  {
    "chapter": 11,
    "title": "Replay the effect after a crash",
    "at": {
      "page": 482,
      "y": 0.6307900831443688
    },
    "demo": "ddia-stream-effects",
    "params": {
      "dedupe": "0"
    },
    "note": "The output changed before the input position was saved. Replaying that record increments the output a second time."
  },
  {
    "chapter": 11,
    "title": "Remember the effect with its offset",
    "at": {
      "page": 483,
      "y": 0.09475963718820857
    },
    "demo": "ddia-stream-effects",
    "params": {
      "dedupe": "1"
    },
    "note": "Store the applied offset with the counter in one atomic update. Replaying the same offset now leaves the counter unchanged."
  }
];

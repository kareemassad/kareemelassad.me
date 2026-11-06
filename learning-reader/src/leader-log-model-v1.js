// One leader assigns log positions. Followers expose only contiguous prefixes.
export function leaderLogModel({first='A',delay=2,reorder='0',time=8}={}) {
 if(!['A','B'].includes(first)||!Number.isInteger(delay)||delay<1||delay>4||!['0','1'].includes(reorder)||!Number.isFinite(time))throw Error('Invalid leader-log input');
 const writes=[{client:'A',value:1},{client:'B',value:2}];
 if(first==='B')writes.reverse();
 const log=writes.map((w,i)=>({...w,position:i+1,accepted:1+i}));
 const arrivals=log.map((w,i)=>({...w,at:reorder==='1'?(i===0?2+delay:2.4):w.accepted+delay}));
 const received=arrivals.filter(w=>w.at<=time);
 let applied=0;while(received.some(w=>w.position===applied+1))applied++;
 const leader=log.filter(w=>w.accepted<=time);
 return {log,arrivals,leader,received,applied,buffered:received.filter(w=>w.position>applied),leaderValue:leader.at(-1)?.value??0,followerValue:applied?log[applied-1].value:0};
}

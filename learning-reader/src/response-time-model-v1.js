// Chapter 1, PDF pages 34–36. Synthetic FIFO queue; no network or CPU model.
export function responseTimeModel({interval=12,service=10,slowAt=4,slowService=80,workers=1}={}){
 for(const [key,value] of Object.entries({interval,service,slowAt,slowService,workers}))if(!Number.isInteger(value))throw Error('Expected integer: '+key);
 if(interval<1||service<1||slowService<service||slowAt<0||slowAt>=24||workers<1||workers>4)throw Error('Invalid queue inputs');
 const available=Array(workers).fill(0);
 const requests=Array.from({length:24},(_,id)=>{const arrival=id*interval,worker=available.indexOf(Math.min(...available)),start=Math.max(arrival,available[worker]),duration=id===slowAt?slowService:service,end=start+duration;available[worker]=end;return {id,arrival,worker,start,end,service:duration,waiting:start-arrival,response:end-arrival};});
 const sorted=requests.map(r=>r.response).sort((a,b)=>a-b);
 return {requests,mean:sorted.reduce((a,b)=>a+b,0)/sorted.length,median:(sorted[11]+sorted[12])/2,p95:sorted[Math.ceil(.95*sorted.length)-1],max:sorted.at(-1)};
}

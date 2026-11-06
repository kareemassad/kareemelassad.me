const bounded=(v,min,max)=>{if(!Number.isInteger(v)||v<min||v>max)throw Error('Invalid fault input');};
export function uncertainRequestModel({world=0,delay=120,timeout=80}={}){
 bounded(world,0,2);bounded(delay,40,180);bounded(timeout,30,200);
 const executedAt=world===0?null:world===1?40:delay,replyAt=world===2?delay+20:null;
 return {world,executedAt,replyAt,timeout,timedOut:replyAt===null||replyAt>timeout,observation:replyAt!==null&&replyAt<=timeout?'Success reply received':'No reply before timeout'};
}
export function clockOrderModel({skew=15}={}){bounded(skew,0,30);const stamps=[100+skew,110],winner=stamps[0]===stamps[1]?null:stamps[0]>stamps[1]?0:1;return {realTimes:[100,110],stamps,winner,lost:winner===0};}
export function fencingModel({check=1,pause=1}={}){
 bounded(check,0,1);bounded(pause,0,1);const requests=[{client:'A',token:33,time:pause?90:20,value:'A old work'},{client:'B',token:34,time:60,value:'B new work'}].sort((a,b)=>a.time-b.time);let highest=0,value=null;
 const events=requests.map(r=>{const accepted=!check||r.token>=highest;if(accepted){highest=Math.max(highest,r.token);value=r.value;}return {...r,accepted,highest,value};});
 return {events,value,staleOverwrite:pause&&!check};
}

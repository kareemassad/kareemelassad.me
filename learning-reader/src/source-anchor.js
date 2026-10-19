// Bounding box in the displayed page coordinate system, including page rotation.
export function anchorPosition(item,viewport){
 const t=item.transform,a=Math.hypot(t[0],t[1])||1,b=Math.hypot(t[2],t[3])||1;
 const along=[t[0]/a,t[1]/a],up=[t[2]/b,t[3]/b],width=item.width||0,height=(item.height||b)*.8;
 const points=[[0,0],[width,0],[0,height],[width,height]].map(([w,h])=>viewport.convertToViewportPoint(t[4]+along[0]*w+up[0]*h,t[5]+along[1]*w+up[1]*h));
 return {x:Math.max(0,Math.min(1,Math.min(...points.map(p=>p[0]))/viewport.width)),y:Math.max(0,Math.min(1,Math.min(...points.map(p=>p[1]))/viewport.height))};
}

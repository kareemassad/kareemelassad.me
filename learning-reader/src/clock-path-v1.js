// Weak, uniform gravity; low speeds. All trial paths have the same endpoints
// and duration. Numbers are an original scaled example, not source-book data.
export const CLOCK_PATH = Object.freeze({g:9.81,c:299792458,duration:4,distance:20,maxRatio:2.5});
export function clockPath(heightRatio){
 if(!Number.isFinite(heightRatio)||heightRatio<0||heightRatio>CLOCK_PATH.maxRatio)throw Error('Outside the checked clock-path domain.');
 const {g,c,duration:T,distance:L}=CLOCK_PATH,height=g*T*T/8*heightRatio;
 const gravityGain=2*g*T*height/(3*c*c),verticalCost=8*height*height/(3*T*c*c),horizontalCost=L*L/(2*T*c*c);
 return {heightRatio,height,gravityGain,verticalCost,horizontalCost,arrivalDifference:gravityGain-verticalCost,relativeToStationary:gravityGain-verticalCost-horizontalCost,acceleration:-8*height/(T*T),additionalAcceleration:g-8*height/(T*T),freefall:Math.abs(heightRatio-1)<1e-10};
}
export function clockPosition(path,fraction){
 const u=Math.max(0,Math.min(1,Number.isFinite(fraction)?fraction:0));
 return {x:CLOCK_PATH.distance*u,y:4*path.height*u*(1-u),t:CLOCK_PATH.duration*u,vx:CLOCK_PATH.distance/CLOCK_PATH.duration,vy:4*path.height/CLOCK_PATH.duration*(1-2*u)};
}

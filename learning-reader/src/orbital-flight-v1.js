// Newtonian two-body flight in dimensionless units: radius and launch radius are
// explicit, GM = 1. No atmosphere, rotation, thrust, or relativistic correction.
// Kept independent of a book, renderer, and animation clock.
export const FLIGHT_LIMITS = Object.freeze({minSpeed: 0, maxSpeed: 1.65, surface: 1, launchRadius: 1.05});

export function orbitalInvariants(speed, launchRadius = FLIGHT_LIMITS.launchRadius) {
 if (!Number.isFinite(speed) || speed < 0 || speed > FLIGHT_LIMITS.maxSpeed || !Number.isFinite(launchRadius) || launchRadius <= 1 || launchRadius > 2) throw Error('Outside the checked flight domain.');
 const velocity = speed / Math.sqrt(launchRadius), energy = velocity * velocity / 2 - 1 / launchRadius;
 const angularMomentum = launchRadius * velocity, eccentricity = Math.abs(speed * speed - 1);
 const semiMajor = Math.abs(energy) < 1e-12 ? Infinity : -1 / (2 * energy);
 const periapsis = speed === 0 ? 0 : angularMomentum * angularMomentum / (1 + eccentricity);
 const apoapsis = energy < -1e-12 ? semiMajor * (1 + eccentricity) : Infinity;
 const kind = periapsis < 1 - 1e-10 ? 'impact' : Math.abs(speed - 1) < 1e-10 ? 'circular' : Math.abs(energy) < 1e-12 ? 'parabolic' : energy < 0 ? 'elliptical' : 'escape';
 return {speed, launchRadius, velocity, energy, angularMomentum, eccentricity, semiMajor, periapsis, apoapsis, kind,
  period: energy < 0 ? 2 * Math.PI * Math.pow(semiMajor, 1.5) : Infinity};
}

const gravity = (x, y) => {const cube = Math.pow(x*x + y*y, 1.5); return [-x / cube, -y / cube];};
const clampUnit=value=>Math.max(-1,Math.min(1,value));
function surfaceEvent(invariants){
 if(invariants.kind!=='impact')return null;
 // The launch is at apoapsis. Kepler's equation gives the inward surface
 // crossing even when a grazing penetration is smaller than Verlet error.
 const {semiMajor:a,eccentricity:e,angularMomentum:h,energy}=invariants;
 const eccentric=2*Math.PI-Math.acos(clampUnit((1-1/a)/e));
 const angle=Math.PI-Math.acos(clampUnit((h*h-1)/e));
 const x=Math.sin(angle),y=Math.cos(angle),radial=-Math.sqrt(Math.max(0,2*(energy+1)-h*h));
 return {x,y,vx:radial*x+h*y,vy:radial*y-h*x,t:(eccentric-e*Math.sin(eccentric)-Math.PI)*Math.pow(a,1.5)};
}

// Velocity Verlet conserves angular momentum and has bounded energy error. The
// analytic invariants above classify the path; a finite trace never proves escape.
export function orbitalFlight(speed, {dt = .002, maxTime = 60, maxRadius = 8, sampleEvery = 8} = {}) {
 if (!Number.isFinite(dt) || dt <= 0 || dt > .01 || !Number.isFinite(maxTime) || maxTime <= 0 || maxTime > 100 || !Number.isFinite(maxRadius) || maxRadius <= FLIGHT_LIMITS.launchRadius || maxRadius > 20 || !Number.isInteger(sampleEvery) || sampleEvery < 1 || sampleEvery > 100) throw Error('Invalid flight sampling.');
 const invariants = orbitalInvariants(speed), radius = invariants.launchRadius;
 let x = 0, y = radius, vx = invariants.velocity, vy = 0, t = 0, [ax, ay] = gravity(x, y), maxEnergyError = 0, maxMomentumError = 0;
 const impact=surfaceEvent(invariants),points = [{x, y, vx, vy, t}], stopTime = Math.min(maxTime,impact?.t??(Number.isFinite(invariants.period)?invariants.period:maxTime));
 let stop = 'time-limit', index = 0;
 while (t < stopTime - 1e-12) {
  const h = Math.min(dt, stopTime - t), old = {x, y, vx, vy, t};
  x += vx*h + ax*h*h/2; y += vy*h + ay*h*h/2;
  const [nx, ny] = gravity(x, y); vx += (ax + nx)*h/2; vy += (ay + ny)*h/2; ax = nx; ay = ny; t += h; index++;
  const r = Math.hypot(x, y), energy = (vx*vx + vy*vy)/2 - 1/r;
  maxEnergyError = Math.max(maxEnergyError, Math.abs(energy - invariants.energy));
  maxMomentumError = Math.max(maxMomentumError, Math.abs(x*vy-y*vx + invariants.angularMomentum));
  if(impact&&t>=impact.t-1e-10){points.push(impact);stop='impact';break;}
  if (r <= 1 && !impact) {
   // Intersect the final straight substep with the surface, then stop there.
   const dx=x-old.x, dy=y-old.y, a=dx*dx+dy*dy, b=2*(old.x*dx+old.y*dy), c=old.x*old.x+old.y*old.y-1;
   const fraction=a ? Math.max(0,Math.min(1,(-b-Math.sqrt(Math.max(0,b*b-4*a*c)))/(2*a))) : 0;
   points.push({x:old.x+dx*fraction,y:old.y+dy*fraction,vx:old.vx+(vx-old.vx)*fraction,vy:old.vy+(vy-old.vy)*fraction,t:old.t+h*fraction});stop='impact';break;
  }
  if (index % sampleEvery === 0 || t >= stopTime - 1e-12 || r >= maxRadius) points.push({x,y,vx,vy,t});
  if (r >= maxRadius) {stop='view-limit';break;}
 }
 if (stop === 'time-limit' && Math.abs(t - invariants.period) < 1e-8) stop='one-orbit';
 return {invariants, points, stop, duration:points.at(-1).t, maxEnergyError, maxMomentumError};
}

export function flightPosition(flight, fraction) {
 const time = Math.max(0,Math.min(1,Number.isFinite(fraction) ? fraction : 0))*flight.duration;
 let lo=0,hi=flight.points.length-1;
 while(hi-lo>1){const mid=(lo+hi)>>1;if(flight.points[mid].t<=time)lo=mid;else hi=mid;}
 const a=flight.points[lo],b=flight.points[hi],q=b.t===a.t?0:(time-a.t)/(b.t-a.t);
 return {x:a.x+(b.x-a.x)*q,y:a.y+(b.y-a.y)*q,t:time};
}

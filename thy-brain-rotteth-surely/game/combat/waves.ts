import type { Behavior } from './config.js';
// Four increasingly dense waves per round. Rounds >5 are optional endless progression.
export const ROUND_DIFFICULTY = [2.15,3.4,4.5,5.8,7.2];
export const WAVE_COUNTS = [4,6,8,10];
export const COMPOSITION:Behavior[] = ['aggressive','opportunistic','evasive','relentless','relentless','evasive'];
export function wavesForRound(round:number) {
 const difficulty=ROUND_DIFFICULTY[round-1] ?? ROUND_DIFFICULTY[4] * 1.18 ** (round-5);
 return WAVE_COUNTS.map((count,wave)=>({
  enemies:Array.from({length:count+Math.min(round-1,8)},(_,i)=>COMPOSITION[(i+wave)%COMPOSITION.length]),
  interval:Math.max(0.55,1.8-wave*0.22-(round-1)*0.09),
  healthScale:difficulty*(1+wave*0.22), damageScale:difficulty*(1+wave*0.12),
  speedScale:Math.min(1.5,1+(round-1)*0.05+wave*0.035),
 }));
}





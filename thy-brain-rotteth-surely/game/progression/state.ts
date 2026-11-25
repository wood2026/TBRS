import { UPGRADES, upgradeCost, type Upgrade, type UpgradeId } from './upgrades.js';
import { STORY_IDS, type StoryId } from '../dialogue/rounds.js';
export type Profile = { version:1; insight:number; levels:Record<UpgradeId,number>; round:number; waves:number; victories:number; attempts:number; storyComplete:boolean; openingComplete:boolean; active:boolean; lastResult:string; storySeen: StoryId[] };
const blank = ():Profile => ({version:1,insight:0,levels:Object.fromEntries(UPGRADES.map(u=>[u.id,0])),round:1,waves:0,victories:0,attempts:0,storyComplete:false,openingComplete:false,active:false,lastResult:'A new beginning',storySeen:[]});
export const profile:Profile = blank();
let persist = (_value:Profile):void => {};
export function saveProgress():void { persist(JSON.parse(JSON.stringify(profile)) as Profile); }
export function loadProgress(value:unknown, write:(value:Profile)=>void):void {
 persist=write; Object.assign(profile,blank());
 if(value && typeof value==='object' && (value as Profile).version===1) {
  const p=value as Profile; const integer=(v:unknown,fallback=0):number => typeof v==='number' && Number.isFinite(v) ? Math.max(0,Math.floor(v)) : fallback;
  profile.insight=integer(p.insight); profile.round=Math.max(1,integer(p.round,1));
  profile.waves=integer(p.waves); profile.victories=integer(p.victories); profile.attempts=integer(p.attempts);
  profile.storyComplete=p.storyComplete===true; profile.lastResult=typeof p.lastResult==='string'?p.lastResult:'Resume';
  for(const u of UPGRADES) profile.levels[u.id]=Math.min(u.max ?? 100,integer(p.levels?.[u.id]));
  if (Array.isArray(p.storySeen)) profile.storySeen = STORY_IDS.filter(id => p.storySeen.includes(id));
  profile.openingComplete = p.openingComplete === true;
  if(p.active) profile.lastResult='Attempt interrupted. Earned Insight was kept; retry this round.';
 }
 saveProgress();
}
export function markStorySeen(id: StoryId): boolean {
 if (profile.storySeen.includes(id)) return false;
 profile.storySeen.push(id);
 saveProgress();
 return true;
}
export function resetProgress():void { Object.assign(profile,blank()); saveProgress(); }
export function addInsight(amount:number):void { profile.insight+=amount; saveProgress(); }
export function visible(u:Upgrade):boolean { return !u.parent || profile.levels[u.parent]>0; }
export function unlocked(u:Upgrade):boolean { return (!u.parent || profile.levels[u.parent]>=u.required) && profile.waves>=u.waves; }
export function purchaseUpgrade(id:UpgradeId):boolean {
 const u=UPGRADES.find(u=>u.id===id)!;
 if(!u || profile.active || !visible(u) || !unlocked(u) || profile.levels[id]>=(u.max ?? Infinity)) return false;
 const cost=upgradeCost(u,profile.levels[id]); if(profile.insight<cost) return false;
 profile.insight-=cost; profile.levels[id]++; saveProgress(); return true;
}
export function beginAttempt():void { profile.active=true; profile.attempts++; saveProgress(); }
export function finishAttempt(won:boolean, earned:number):void {
 if(!profile.active) return;
 profile.active=false;
 profile.lastResult=`${won?'Victory':'Defeat'} in round ${profile.round}. +${earned} Insight earned.`;
 if(won) { profile.victories++; if(profile.round===5) profile.storyComplete=true; profile.round++; }
 saveProgress();
}



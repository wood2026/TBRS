import { DEFENDERS, type DefenderKind } from './combat/defenders.js';
import { createUnit, act, separate, support, type Unit } from './combat/units.js';
import { ECONOMY, BATTLE } from './combat/config.js';
import { wavesForRound } from './combat/waves.js';
import { profile, beginAttempt, finishAttempt, addInsight, saveProgress } from './progression/state.js';
import { CURRENCY, startingFocus, focusReward, resourceDebug } from './progression/currency.js';
export const COST=CURRENCY.recruit;
export const run={round:1,wave:0,hp:100,maxHp:100,focus:80,phase:'combat' as 'combat'|'victory'|'defeat',roundTime:0,
 defenders:[] as Unit[],enemies:[] as Unit[],selected:null as number|null,spawned:0,spawnTimer:0,kills:0,leaks:0,losses:0,nextId:1,message:'',insightEarned:0,progressTimer:0};
export function resetRun():void {
 const maxHp=BATTLE.brainHealth+profile.levels.brain*25;
 Object.assign(run,{round:profile.round,wave:0,hp:maxHp,maxHp,focus:startingFocus(profile.levels.resources),phase:'combat',roundTime:0,
 defenders:[],enemies:[],selected:null,spawned:0,spawnTimer:BATTLE.firstSpawnDelay,kills:0,leaks:0,losses:0,nextId:1,message:'The distractions are advancing.',insightEarned:0,progressTimer:0});
 beginAttempt();
}
function earn(amount:number):void { run.insightEarned+=amount; addInsight(amount); }
export function endAttempt(won:boolean):void {
 if(run.phase!=='combat') return;
 if(won) earn(CURRENCY.insightPerVictory+run.round*2);
 run.phase=won?'victory':'defeat'; finishAttempt(won,run.insightEarned);
}
export function buyDefender(kind:DefenderKind='reading'):void {
 if(run.phase!=='combat') return;
 if(kind!=='reading' && !profile.levels['unlock_'+kind]) {run.message='Unlock this defender in the tree first.';return;}
 const cost=DEFENDERS[kind].cost;
 if(!resourceDebug.infinite && run.focus<cost) {run.message=`Recruiting costs ${cost} Focus.`;return;}
 if(run.defenders.length>=ECONOMY.capacity) {run.message='Team full.';return;}
 if(!resourceDebug.infinite) run.focus-=cost;
 const index=run.defenders.length;
 const unit=createUnit(run.nextId++,kind,260+Math.floor(index/4)*42,200+(index%4)*72);
 unit.roleLevel=profile.levels[kind+'_mastery'] ?? 0;
 unit.damage*=1+unit.roleLevel*0.15;unit.maxHp*=1+unit.roleLevel*0.15;unit.hp=unit.maxHp;
 unit.damage*=1+profile.levels.damage*0.25; unit.attackSpeed*=1+profile.levels.attack*0.15;
 unit.speed*=1+profile.levels.movement*0.1;
 run.defenders.push(unit);run.selected=unit.id;run.message=DEFENDERS[kind].name+' recruited.';
}
export function stepBattle(dt:number):void {
 if(run.phase!=='combat') return;
 run.roundTime+=dt;run.spawnTimer-=dt;run.progressTimer+=dt;
 while(run.progressTimer>=CURRENCY.progressSeconds) {run.progressTimer-=CURRENCY.progressSeconds;earn(CURRENCY.insightPerProgress);}
 const waves=wavesForRound(run.round),wave=waves[run.wave];
 if(run.spawned<wave.enemies.length && run.spawnTimer<=0) {
  const y=155+((run.spawned*137+run.wave*61)%310);
  const enemy=createUnit(run.nextId++,'distraction',1190,y,wave.enemies[run.spawned]);
  enemy.hp*=wave.healthScale;enemy.maxHp=enemy.hp;enemy.damage*=wave.damageScale;enemy.speed*=wave.speedScale;
  run.enemies.push(enemy);run.spawned++;run.spawnTimer+=wave.interval;
 }
 support(run.defenders,dt);
 for(const u of run.defenders) if(u.hp>0) act(u,run.enemies,dt);
 for(const u of run.enemies) if(u.hp>0) act(u,run.defenders,dt);
 separate([...run.defenders,...run.enemies].filter(u=>u.hp>0),dt);
 for(const enemy of run.enemies) {
  if(enemy.hp<=0) {const reward=focusReward(profile.levels.income);run.focus+=reward;run.kills++;earn(CURRENCY.insightPerKill);run.message=`+${reward} Focus / +${CURRENCY.insightPerKill} Insight`;}
  else if(enemy.attackingBrain) {
   if(!enemy.reachedBrain){enemy.reachedBrain=true;run.leaks++;}
   if(enemy.cooldown<=0){run.hp=Math.max(0,run.hp-enemy.damage);enemy.cooldown=1/enemy.attackSpeed;run.message='The brain is under sustained attack!';}
  }
 }
 run.losses+=run.defenders.filter(u=>u.hp<=0).length;run.defenders=run.defenders.filter(u=>u.hp>0);run.enemies=run.enemies.filter(u=>u.hp>0);
 if(!run.defenders.some(u=>u.id===run.selected)) run.selected=run.defenders[0]?.id??null;
 if(run.hp<=0) {endAttempt(false);return;}
 if(run.spawned===wave.enemies.length && !run.enemies.length) {
  earn(CURRENCY.insightPerWave);profile.waves++;saveProgress();
  if(run.wave===3) endAttempt(true);
  else {
   run.wave++;run.spawned=0;run.spawnTimer=BATTLE.roundDelay;
   run.hp=Math.min(run.maxHp,run.hp+profile.levels.recovery*8);
   for(const d of run.defenders) d.hp=Math.min(d.maxHp,d.hp+d.maxHp*profile.levels.recovery*0.1);
   run.message=`Wave ${run.wave+1}/4 is approaching.`;
  }
 }
}


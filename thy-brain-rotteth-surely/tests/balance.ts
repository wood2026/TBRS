import { run, resetRun, buyDefender, stepBattle } from '../game/battle.ts';
import { profile, resetProgress } from '../game/progression/state.ts';
for(const level of [0,3,6,10]) for(let round=1;round<=5;round++) {
 resetProgress();profile.round=round;
 for(const id of Object.keys(profile.levels)) profile.levels[id]=level;
 resetRun();
 for(let frame=0;frame<240*60 && run.phase==='combat';frame++) {
  if(frame%30===0 && run.focus>=40) buyDefender();stepBattle(1/60);
 }
 console.log({level,round,result:run.phase,wave:run.wave+1,hp:run.hp,kills:run.kills,leaks:run.leaks,insight:run.insightEarned});
}

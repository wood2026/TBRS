import { run, resetRun, buyDefender, stepBattle } from '../game/battle.ts';
import { profile, resetProgress, purchaseUpgrade, visible, unlocked } from '../game/progression/state.ts';
import { UPGRADES,upgradeCost } from '../game/progression/upgrades.ts';
resetProgress();
for(let attempt=0;attempt<60 && !profile.storyComplete;attempt++) {
 resetRun();for(let frame=0;frame<240*60&&run.phase==='combat';frame++){if(frame%30===0&&run.focus>=40)buyDefender();stepBattle(1/60);}
 console.log(attempt+1,run.round,run.phase,run.wave+1,profile.insight,profile.levels);
 for(let i=0;i<100;i++){const choices=UPGRADES.filter(u=>visible(u)&&unlocked(u)&&upgradeCost(u,profile.levels[u.id])<=profile.insight).sort((a,b)=>upgradeCost(a,profile.levels[a.id])-upgradeCost(b,profile.levels[b.id]));if(!choices.length)break;purchaseUpgrade(choices[0].id);}
}


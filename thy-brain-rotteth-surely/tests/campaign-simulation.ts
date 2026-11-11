import { run,resetRun,buyDefender,stepBattle } from '../game/battle.ts';
import { profile,resetProgress,purchaseUpgrade,visible,unlocked } from '../game/progression/state.ts';
import { UPGRADES,upgradeCost } from '../game/progression/upgrades.ts';
import { DEFENDERS,type DefenderKind } from '../game/combat/defenders.ts';
export function campaign(strategy:string,maxAttempts=40){
 resetProgress();const history:any[]=[];
 for(let attempt=0;attempt<maxAttempts&&!profile.storyComplete;attempt++){
  resetRun();
  for(let frame=0;frame<240*60&&run.phase==='combat';frame++){
   if(frame%60===0){
    let kind:DefenderKind='reading';
    if((strategy==='mixed'||strategy==='roles') && run.defenders.filter(d=>d.kind==='reading'||d.kind==='exercise').length>=3){
     const choices:DefenderKind[]=['sleep','social','exercise','mindfulness','reading'];
     kind=choices.find(k=>(k==='reading'||profile.levels['unlock_'+k])&&run.defenders.filter(d=>d.kind===k).length<(k==='sleep'||k==='social'?1:k==='exercise'||k==='mindfulness'?2:12))??'reading';
    }
    if(run.focus>=DEFENDERS[kind].cost)buyDefender(kind);
   }
   stepBattle(1/60);
  }
  history.push({round:run.round,result:run.phase,wave:run.wave+1,earned:run.insightEarned,health:Math.ceil(run.hp)});
  for(let n=0;n<100;n++){
   const candidates=UPGRADES.filter(u=>visible(u)&&unlocked(u)&&profile.levels[u.id]<(u.max??Infinity)&&upgradeCost(u,profile.levels[u.id])<=profile.insight);
   const weight=(id:string)=>strategy==='roles'?(id.startsWith('unlock_')?2.5:({damage:1.8,attack:1.8,movement:1.4,brain:1.4,recovery:1.3,income:1.8,resources:1.8}[id]??0.6)):strategy==='offense'?({damage:2.2,attack:2,income:1.6,resources:1.6,reading_mastery:1.5,brain:0.8,movement:0.9,recovery:0.6}[id]??0):strategy==='defense'?({brain:2,recovery:1.6,resources:1.6,income:1.5,damage:1.3,attack:1.3,movement:1,reading_mastery:1.4}[id]??0):({damage:1.8,attack:1.8,income:1.6,resources:1.6,brain:1.2,movement:1.1}[id]??1);
   const options=candidates.filter(u=>weight(u.id)>0).sort((a,b)=>upgradeCost(a,profile.levels[a.id])/weight(a.id)-upgradeCost(b,profile.levels[b.id])/weight(b.id));
   if(!options.length)break;purchaseUpgrade(options[0].id);
  }
 }
 return {strategy,complete:profile.storyComplete,attempts:history.length,levels:{...profile.levels},insight:profile.insight,history};
}


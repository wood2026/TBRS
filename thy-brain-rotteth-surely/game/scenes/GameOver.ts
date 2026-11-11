import type { UpgradeId } from '../progression/upgrades.js';
const currentEffect=(id:UpgradeId,l:number):string=>({damage:'+'+l*25+'%',attack:'+'+l*15+'%',movement:'+'+l*10+'%',brain:'+'+l*25+' HP',recovery:l*8+' HP / '+l*10+'%',income:'+'+l*20+'%',resources:'+'+l*20+' Focus'})[id];
import { game } from '../engine.js';
import { profile, visible, unlocked, purchaseUpgrade, resetProgress } from '../progression/state.js';
import { UPGRADES, upgradeCost } from '../progression/upgrades.js';
let page=0;
export const GameOver={name:'gameover',enter():void {
 game.background.color('#10162a');
 game.text(profile.storyComplete?'The main story is complete':'A moment of reflection',640,45,{size:36,color:'#a8e6cf'});
 game.text(profile.lastResult,640,88,{size:22});
 game.text(`Insight: ${profile.insight}   |   Cleared waves: ${profile.waves}   |   Next attempt: Round ${profile.round}`,640,125,{size:22,color:'#ffd88a'});
 if(profile.storyComplete) game.text('The mind has found quiet. Continue beyond the story, or return to the title.',640,159,{size:18});
 const list=UPGRADES.filter(visible);page=Math.min(page,Math.max(0,Math.ceil(list.length/4)-1));
 list.slice(page*4,page*4+4).forEach((u,index)=>{
  const y=210+index*94,level=profile.levels[u.id],cost=upgradeCost(u,level);
  game.text(`${u.name} | Level ${level} | ${cost} Insight`,70,y,{align:'left',size:23,color:unlocked(u)?'#a8e6cf':'#b0a9ba'});
  game.text(u.effect + ' (current: ' + currentEffect(u.id, level) + ')',70,y+28,{align:'left',size:18});
  const parent=UPGRADES.find(p=>p.id===u.parent);
  game.text(`Requires: ${parent?`${parent.name} ${u.required}`:'none'}${u.waves?`; ${u.waves} cleared waves`:''}`,70,y+53,{align:'left',size:16,color:'#aebbd0'});
  game.ui.button({anchor:'center',x:440,y:y-335,h:48,text:!unlocked(u)?'Locked':profile.insight<cost?'Need Insight':'Purchase',onClick:()=>{if(purchaseUpgrade(u.id)) game.scenes.go('gameover');}});
 });
 if(list.length>4) game.ui.button({anchor:'center',x:-420,y:255,h:42,text:page===0?'More upgrades':'Previous',onClick:()=>{page=page===0?1:0;game.scenes.go('gameover');}});
 game.ui.button({anchor:'center',x:100,y:280,h:50,text:profile.storyComplete?'Continue beyond story':`Attempt round ${profile.round}`,style:'good',onClick:()=>game.scenes.go('play')});
 game.ui.button({anchor:'center',x:440,y:280,h:44,text:'Title',onClick:()=>game.scenes.go('title')});
 let confirm=false;
 const resetText=game.text('Reset progress (testing)',190,685,{size:16,color:'#de9eac'});
 game.ui.button({anchor:'center',x:-450,y:290,h:32,text:'Reset save',onClick:()=>{
  if(!confirm){confirm=true;resetText.text='Click Reset save again to erase progress';return;}
  resetProgress();page=0;game.scenes.go('gameover');
 }});
 if(!game.save.persistent) game.text('Storage unavailable: progress lasts for this session only.',640,700,{size:15,color:'#ffb36b'});
}};


import { game } from '../engine.js';
import { musicButton } from '../music.js';
import { showExchange } from '../dialogue/references.js';
import type { StoryId } from '../dialogue/rounds.js';
import { markStorySeen, profile,visible,unlocked,purchaseUpgrade,resetProgress } from '../progression/state.js';
import { UPGRADES,upgradeCost, type UpgradeId } from '../progression/upgrades.js';
let scroll=0,selected: UpgradeId='damage';
const UPGRADE_ART: Record<string, string> = {
 damage: 'reading', attack: 'focus', movement: 'movement', brain: 'resilience',
 income: 'insight', unlock_exercise: 'exercise', recovery: 'health', resources: 'focus',
 exercise_mastery: 'exercise', unlock_sleep: 'sleep', unlock_social: 'social',
 unlock_mindfulness: 'mindfulness', sleep_mastery: 'sleep', social_mastery: 'social',
 mindfulness_mastery: 'mindfulness', reading_mastery: 'reading',
};
const PURCHASE_STORY: Partial<Record<UpgradeId, StoryId>> = {
 movement: 'exercise', unlock_exercise: 'exercise',
 recovery: 'sleep', unlock_sleep: 'sleep',
 unlock_social: 'social', unlock_mindfulness: 'mindfulness',
};

function tellStory(id: StoryId) {
 if (markStorySeen(id)) showExchange(id);
}
export const GameOver={name:'gameover',enter():void {
 game.background.picture('upgrade-background', 'cover');
 musicButton();
 const outcome = profile.storyComplete ? 'complete'
  : profile.lastResult.startsWith('Victory') ? 'victory'
  : profile.lastResult.startsWith('Defeat') ? 'defeat' : null;
 if (outcome) {
  game.spawn({ texture: 'outcome-' + outcome, x: 176, y: 75, width: 162, layer: 'world' });
 }
 if (outcome === 'defeat') {
  game.spawn({ texture: 'brain-defeated', x: 292, y: 75, width: 65, layer: 'world' });
 }
 const nodeIcons = new Map(UPGRADES.map(node => [node.id, game.spawn({
  id: 'node-icon-' + node.id, texture: 'icon-' + UPGRADE_ART[node.id], width: 36, height: 36,
  x: node.x + 30, layer: 'world', visible: false,
 })]));
 game.text(profile.storyComplete?'The mind has found quiet':'Permanent growth',640,36,{size:32,color:'#a8e6cf'});
 game.text(profile.lastResult,640,76,{size:20});
 const bank=game.text('',640,112,{size:22,color:'#ffd88a'});
 game.text('Wheel / Up / Down or drag to scroll. Click a node to inspect.',460,142,{size:17,color:'#b3c7d9'});
 const graph=game.graphics({layer:'back'});
 const title=game.text('',1088,177,{size:21,color:'#a8e6cf'});
 const detail=Array.from({length:10},(_,i)=>game.text('',933,234+i*24,{align:'left',size:16}));
 let dragging=false,moved=0,lastY=0,confirm=false;
 const refresh=():void=>{
  bank.text=`Insight ${profile.insight} | Waves cleared ${profile.waves} | Next: Round ${profile.round}`;
  const nodes=UPGRADES.filter(visible),u=UPGRADES.find(n=>n.id===selected)!;
  scroll=Math.max(0,Math.min(scroll,Math.max(0,...nodes.map(n=>n.y))-300));
  const level=profile.levels[u.id],cost=upgradeCost(u,level),maxed=level>=(u.max??Infinity);
  title.text=u.name.length>24?u.name.replace('Unlock ',''):u.name;
  const parent=UPGRADES.find(p=>p.id===u.parent);
  const words=u.effect.split(' '),lines:string[]=[];let line='';
  for(const word of words){if((line+' '+word).length>32){lines.push(line);line=word;}else line+=(line?' ':'')+word;}lines.push(line);
  const text=[`Level ${level}${u.max?' / '+u.max:''}`,maxed?'Permanently unlocked':`Next cost: ${cost} Insight`,...lines,'Requires:',parent?`${parent.name} Lv ${u.required}`:'None',u.waves?`${u.waves} completed waves`:'',!unlocked(u)?'LOCKED':maxed?'PURCHASED':profile.insight>=cost?'AFFORDABLE':'AVAILABLE - earn more Insight'];
  detail.forEach((t,i)=>t.text=text[i]??'');
  for (const node of UPGRADES) {
   const icon = nodeIcons.get(node.id)!;
   icon.y = node.y + 169 - scroll;
   icon.visible = visible(node) && icon.y >= 183 && icon.y <= 572;
   icon.tint = unlocked(node) ? '#ffffff' : '#9094aa';
  }
  graph.clear();graph.draw(ctx=>{
   ctx.save();ctx.beginPath();ctx.rect(20,165,880,425);ctx.clip();ctx.fillStyle='#17112662';ctx.fillRect(20,165,880,425);
   for(const n of nodes){const parent=nodes.find(p=>p.id===n.parent);if(!parent)continue;ctx.strokeStyle=profile.levels[n.id]>0?'#70cba3':'#53647d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(parent.x+30,parent.y+190-scroll);ctx.lineTo(n.x+30,n.y+190-scroll);ctx.stroke();}
   for(const n of nodes){const x=n.x+30,y=n.y+190-scroll,l=profile.levels[n.id],c=upgradeCost(n,l),locked=!unlocked(n),bought=l>0,affordable=!locked&&profile.insight>=c&&l<(n.max??Infinity);
    ctx.fillStyle=locked?'#394152':affordable?'#275b50':bought?'#304b6c':'#28374d';ctx.strokeStyle=n.id===selected?'#ffe18c':locked?'#616878':affordable?'#79e3b5':bought?'#86baff':'#91a1b8';ctx.lineWidth=n.id===selected?4:2;
    ctx.beginPath();ctx.roundRect(x-91,y-47,182,96,12);ctx.fill();ctx.stroke();
    ctx.fillStyle='#dfeafa';ctx.textAlign='center';
    ctx.font='13px sans-serif';ctx.fillText(n.name.replace('Unlock ','').replace('Connection','Connect.'),x,y+6);ctx.fillText(`Lv ${l} | ${l>=(n.max??Infinity)?'Unlocked':c+' Insight'}`,x,y+25);
    ctx.font='10px sans-serif';ctx.fillText(locked?'LOCKED':affordable?'AFFORDABLE':bought?'PURCHASED':'AVAILABLE',x,y+41);
   }
   ctx.restore();
   const max=Math.max(1,Math.max(...nodes.map(n=>n.y))-300);ctx.fillStyle='#33455e';ctx.fillRect(890,175,6,400);ctx.fillStyle='#a8e6cf';ctx.fillRect(890,175+scroll/max*340,6,60);
  });
 };
 game.ui.button({anchor:'center',x:430,y:200,h:46,text:'Purchase selected',onClick:()=>{
  if (!purchaseUpgrade(selected)) return;
  refresh();
  const story = PURCHASE_STORY[selected];
  if (story) tellStory(story);
 }});
 game.ui.button({anchor:'center',x:170,y:280,h:50,text:profile.storyComplete?'Continue beyond story':`Attempt round ${profile.round}`,style:'good',onClick:()=>game.scenes.go('play')});
 game.ui.button({anchor:'center',x:470,y:280,h:44,text:'Title',onClick:()=>game.scenes.go('title')});
 const resetLabel=game.text('Reset progress (testing)',210,696,{size:15,color:'#de9eac'});
 game.ui.button({anchor:'center',x:-430,y:280,h:40,text:'Reset save',onClick:()=>{if(!confirm){confirm=true;resetLabel.text='Click Reset save again to erase';return;}resetProgress();scroll=0;selected='damage';game.scenes.go('gameover');}});
 game.text('Gray locked | Blue purchased | Green affordable',460,610,{size:16,color:'#b3c7d9'});
 if(!game.save.persistent)game.text('Storage unavailable: session progress only',640,698,{size:15,color:'#ffb36b'});
 refresh();
 if (profile.lastResult.startsWith('Victory in round 1.')) tellStory('scores');
 if (profile.storyComplete) tellStory('ending');
 game.step('tree',dt=>{
  if (game.ui.modalTop) return;
  const p=game.input.pointer;
  if(p?.pressed&&p.x>20&&p.x<900&&p.y>165&&p.y<590){dragging=true;lastY=p.y;moved=0;}
  if(dragging&&p?.down){const delta=lastY-p.y;scroll+=delta;moved+=Math.abs(delta);lastY=p.y;}
  if(dragging&&!p?.down){dragging=false;if(moved<6&&p){const n=UPGRADES.filter(visible).find(n=>Math.abs(p.x-(n.x+30))<91&&Math.abs(p.y-(n.y+190-scroll))<47);if(n)selected=n.id;}}
  if(p&&p.x<900&&p.y>165&&p.y<590)scroll+=game.input.wheel;
  if(game.input.keyDown('ArrowDown'))scroll+=dt*420;if(game.input.keyDown('ArrowUp'))scroll-=dt*420;
  refresh();
 });
}};

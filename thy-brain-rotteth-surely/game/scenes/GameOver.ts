import { game } from '../engine.js';
import { profile,visible,unlocked,purchaseUpgrade,resetProgress } from '../progression/state.js';
import { UPGRADES,upgradeCost } from '../progression/upgrades.js';
let scroll=0,selected='damage';
export const GameOver={name:'gameover',enter():void {
 game.background.color('#10162a');
 game.text(profile.storyComplete?'The mind has found quiet':'Permanent growth',640,36,{size:32,color:'#a8e6cf'});
 game.text(profile.lastResult,640,76,{size:20});
 const bank=game.text('',640,112,{size:22,color:'#ffd88a'});
 game.text('Wheel / Up / Down or drag to scroll. Click a node to inspect.',460,142,{size:17,color:'#b3c7d9'});
 const graph=game.graphics({layer:'back'});
 const title=game.text('',930,195,{align:'left',size:21,color:'#a8e6cf'});
 const detail=Array.from({length:10},(_,i)=>game.text('',930,235+i*27,{align:'left',size:16}));
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
  graph.clear();graph.draw(ctx=>{
   ctx.save();ctx.beginPath();ctx.rect(20,165,880,425);ctx.clip();ctx.fillStyle='#182438';ctx.fillRect(20,165,880,425);
   for(const n of nodes){const parent=nodes.find(p=>p.id===n.parent);if(!parent)continue;ctx.strokeStyle=profile.levels[n.id]>0?'#70cba3':'#53647d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(parent.x+30,parent.y+190-scroll);ctx.lineTo(n.x+30,n.y+190-scroll);ctx.stroke();}
   for(const n of nodes){const x=n.x+30,y=n.y+190-scroll,l=profile.levels[n.id],c=upgradeCost(n,l),locked=!unlocked(n),bought=l>0,affordable=!locked&&profile.insight>=c&&l<(n.max??Infinity);
    ctx.fillStyle=locked?'#394152':affordable?'#275b50':bought?'#304b6c':'#28374d';ctx.strokeStyle=n.id===selected?'#ffe18c':locked?'#616878':affordable?'#79e3b5':bought?'#86baff':'#91a1b8';ctx.lineWidth=n.id===selected?4:2;
    ctx.beginPath();ctx.roundRect(x-91,y-47,182,96,12);ctx.fill();ctx.stroke();
    ctx.fillStyle='#dfeafa';ctx.font='bold 21px sans-serif';ctx.textAlign='center';ctx.fillText(n.icon,x,y-16);
    ctx.font='13px sans-serif';ctx.fillText(n.name.replace('Unlock ','').replace('Connection','Connect.'),x,y+6);ctx.fillText(`Lv ${l} | ${l>=(n.max??Infinity)?'Unlocked':c+' Insight'}`,x,y+25);
    ctx.font='10px sans-serif';ctx.fillText(locked?'LOCKED':affordable?'AFFORDABLE':bought?'PURCHASED':'AVAILABLE',x,y+41);
   }
   ctx.restore();
   const max=Math.max(1,Math.max(...nodes.map(n=>n.y))-300);ctx.fillStyle='#33455e';ctx.fillRect(890,175,6,400);ctx.fillStyle='#a8e6cf';ctx.fillRect(890,175+scroll/max*340,6,60);
  });
 };
 game.ui.button({anchor:'center',x:430,y:200,h:46,text:'Purchase selected',onClick:()=>{purchaseUpgrade(selected);refresh();}});
 game.ui.button({anchor:'center',x:170,y:280,h:50,text:profile.storyComplete?'Continue beyond story':`Attempt round ${profile.round}`,style:'good',onClick:()=>game.scenes.go('play')});
 game.ui.button({anchor:'center',x:470,y:280,h:44,text:'Title',onClick:()=>game.scenes.go('title')});
 const resetLabel=game.text('Reset progress (testing)',210,696,{size:15,color:'#de9eac'});
 game.ui.button({anchor:'center',x:-430,y:280,h:40,text:'Reset save',onClick:()=>{if(!confirm){confirm=true;resetLabel.text='Click Reset save again to erase';return;}resetProgress();scroll=0;selected='damage';game.scenes.go('gameover');}});
 game.text('Gray locked | Blue purchased | Green affordable',460,610,{size:16,color:'#b3c7d9'});
 if(!game.save.persistent)game.text('Storage unavailable: session progress only',640,698,{size:15,color:'#ffb36b'});
 refresh();game.step('tree',dt=>{
  const p=game.input.pointer;
  if(p?.pressed&&p.x>20&&p.x<900&&p.y>165&&p.y<590){dragging=true;lastY=p.y;moved=0;}
  if(dragging&&p?.down){const delta=lastY-p.y;scroll+=delta;moved+=Math.abs(delta);lastY=p.y;}
  if(dragging&&!p?.down){dragging=false;if(moved<6&&p){const n=UPGRADES.filter(visible).find(n=>Math.abs(p.x-(n.x+30))<91&&Math.abs(p.y-(n.y+190-scroll))<47);if(n)selected=n.id;}}
  if(p&&p.x<900&&p.y>165&&p.y<590)scroll+=game.input.wheel;
  if(game.input.keyDown('ArrowDown'))scroll+=dt*420;if(game.input.keyDown('ArrowUp'))scroll-=dt*420;
  refresh();
 });
}};

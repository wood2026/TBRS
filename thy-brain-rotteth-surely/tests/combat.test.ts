import { campaign } from './campaign-simulation.ts';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { run, resetRun, buyDefender, stepBattle, endAttempt } from '../game/battle.ts';
import { createUnit, separate, distance, act, hit, support, brainPosition } from '../game/combat/units.ts';
import { AI, BEHAVIORS } from '../game/combat/config.ts';
import { wavesForRound } from '../game/combat/waves.ts';
import { profile,resetProgress,loadProgress,purchaseUpgrade,visible,unlocked,saveProgress } from '../game/progression/state.ts';
import { UPGRADES,upgradeCost } from '../game/progression/upgrades.ts';
function fight(recruit=true):void {
 for(let frame=0;frame<240*60&&run.phase==='combat';frame++) {if(recruit&&frame%30===0&&run.focus>=40)buyDefender();stepBattle(1/60);}
 assert.notEqual(run.phase,'combat','attempt must terminate');
}
test('first upgrade alone; branches, repeat costs, prerequisites and milestone locks',()=>{
 resetProgress();assert.deepEqual(UPGRADES.filter(visible).map(u=>u.id),['damage']);profile.insight=1000;
 assert.equal(purchaseUpgrade('income'),false);assert.equal(purchaseUpgrade('damage'),true);
 assert.equal(UPGRADES.filter(visible).length,4);const first=upgradeCost(UPGRADES[0],1);purchaseUpgrade('damage');assert.ok(upgradeCost(UPGRADES[0],2)>first);
 purchaseUpgrade('brain');const recovery=UPGRADES.find(u=>u.id==='recovery')!;assert.ok(visible(recovery));assert.equal(unlocked(recovery),false);
 profile.waves=2;assert.equal(purchaseUpgrade('recovery'),true);
});
test('defeat retains round, awards Insight without kills, resets Focus and units on retry',()=>{
 resetProgress();resetRun();fight(false);assert.equal(run.phase,'defeat');assert.ok(profile.insight>0);assert.equal(run.kills,0);assert.equal(profile.round,1);
 const bank=profile.insight;endAttempt(false);assert.equal(profile.insight,bank);
 run.focus=999;resetRun();assert.equal(run.focus,80);assert.equal(run.defenders.length,0);assert.equal(profile.insight,bank);
 assert.equal(purchaseUpgrade('damage'),false,'permanent upgrades only outside combat');endAttempt(false);
});
test('unupgraded late rounds fail naturally but still earn Insight',()=>{
 for(const round of [3,4,5]) {resetProgress();profile.round=round;resetRun();fight();assert.equal(run.phase,'defeat');assert.equal(profile.round,round);assert.ok(profile.insight>0);}
});
test('all five rounds contain four harder waves and upgraded builds complete story and endless',()=>{
 resetProgress();for(const u of UPGRADES)profile.levels[u.id]=6;
 for(let round=1;round<=5;round++) {
  assert.equal(profile.round,round);const waves=wavesForRound(round);assert.equal(waves.length,4);
  for(let i=1;i<4;i++){assert.ok(waves[i].healthScale>waves[i-1].healthScale);assert.ok(waves[i].enemies.length>waves[i-1].enemies.length);}
  resetRun();fight();assert.equal(run.phase,'victory');assert.equal(run.wave,3);assert.equal(profile.round,round+1);
 }
 assert.equal(profile.storyComplete,true);assert.equal(profile.waves,20);resetRun();fight();assert.equal(run.round,6);assert.equal(run.phase,'victory');
});
test('save round-trip preserves Insight, upgrades and milestones; interrupted combat is recoverable',()=>{
 let stored:any=null;loadProgress(null,value=>{stored=JSON.parse(JSON.stringify(value));});
 profile.insight=100;purchaseUpgrade('damage');profile.round=3;profile.waves=5;saveProgress();const snapshot=JSON.parse(JSON.stringify(stored));
 resetProgress();loadProgress(snapshot,value=>{stored=value;});assert.equal(profile.insight,92);assert.equal(profile.levels.damage,1);assert.equal(profile.round,3);assert.equal(profile.waves,5);
 resetRun();stepBattle(9);const bank=profile.insight;const active=JSON.parse(JSON.stringify(stored));loadProgress(active,value=>{stored=value;});
 assert.equal(profile.active,false);assert.equal(profile.insight,bank);assert.match(profile.lastResult,/interrupted/);
 resetProgress();assert.equal(profile.insight,0);assert.equal(profile.round,1);assert.equal(profile.levels.damage,0);
 loadProgress({version:1,insight:NaN,levels:{damage:-5},round:-1},()=>{});assert.equal(profile.insight,0);assert.equal(profile.round,1);
});
test('four earned-currency strategies complete with natural losses',()=>{
 for(const strategy of ['offense','defense','mixed','roles']){
  const result=campaign(strategy,20);assert.equal(result.complete,true,strategy);
  assert.ok(result.attempts>=6&&result.attempts<=12,`${strategy}: ${result.attempts}`);
  assert.ok(result.history.some(a=>a.result==='defeat'));
 }
});
test('aggressive seeks defenders; opportunistic responds to damage then returns to brain', () => {
    const defender = createUnit(1,'reading',580,300);
    const aggressive = createUnit(2,'distraction',800,300,'aggressive');
    act(aggressive,[defender],1/60); assert.equal(aggressive.intent,'engage');
    const enemy = createUnit(3,'distraction',720,300,'opportunistic');
    act(enemy,[defender],1/60); assert.equal(enemy.intent,'brain');
    hit(defender,enemy); act(enemy,[defender],1/60); assert.equal(enemy.intent,'engage');
    for(let i=0;i<100;i++) { if(i%20===0) hit(defender,enemy); enemy.hp=200; act(enemy,[defender],1/60); }
    assert.equal(enemy.intent,'brain'); assert.ok(enemy.resolve>0,'repeated hits must not reset engagement');
    for(let i=0;i<240;i++) act(enemy,[],1/60);
    assert.equal(Object.keys(enemy.threats).length,0); assert.equal(enemy.targetId,null);
});
test('relentless resists redirection; damage slows but does not immobilize', () => {
    const defender=createUnit(1,'reading',600,316);
    const enemy=createUnit(2,'distraction',700,316,'relentless');
    hit(defender,enemy); const x=enemy.x; act(enemy,[defender],0.1);
    assert.equal(enemy.intent,'brain'); assert.ok(enemy.x<x); assert.ok(x-enemy.x<enemy.speed*0.1);
    assert.ok(enemy.slow>0); assert.ok(BEHAVIORS.relentless.slow>BEHAVIORS.aggressive.slow);
});
test('evasive sidesteps at bounded speed and retains brainward progress', () => {
    const defender=createUnit(1,'reading',630,300), enemy=createUnit(2,'distraction',700,300,'evasive');
    const start={x:enemy.x,y:enemy.y}; act(enemy,[defender],0.1);
    assert.equal(enemy.intent,'evade'); assert.ok(enemy.x<start.x); assert.notEqual(enemy.y,start.y);
    assert.ok(distance(start,enemy)<=enemy.speed*0.1+0.001);
});
test('defenders detect, intercept in 2D, attack in range, and abandon dead targets', () => {
    const a=createUnit(1,'reading',300,200), b=createUnit(2,'distraction',1100,400);
    act(a,[b],0.1); assert.equal(a.targetId,null); b.x=600;
    act(a,[b],0.5); assert.ok(a.x>300 && a.y>200); assert.equal(b.hp,b.maxHp);
    b.x=a.x+35; b.y=a.y; act(a,[b],0.1); assert.ok(b.hp<b.maxHp);
    assert.ok(b.threats[a.id]); assert.equal(b.slow,AI.slowDuration);
    b.hp=0; act(a,[b],0.1); assert.equal(a.targetId,null);
});


test('permanent resources, income, stats and wave recovery affect combat',()=>{
 resetProgress();profile.levels.resources=2;profile.levels.income=2;profile.levels.damage=2;profile.levels.attack=2;profile.levels.movement=2;profile.levels.brain=2;profile.levels.recovery=2;
 resetRun();assert.equal(run.focus,120);assert.equal(run.maxHp,150);buyDefender();const unit=run.defenders[0];
 assert.equal(unit.damage,27);assert.ok(unit.attackSpeed>1.4);assert.equal(unit.speed,168);
 run.hp=100;unit.hp=50;run.spawned=wavesForRound(1)[0].enemies.length;
 run.enemies=[createUnit(999,'distraction',900,300)];run.enemies[0].hp=0;
 const focus=run.focus;stepBattle(1/60);assert.equal(run.focus,focus+28);assert.equal(run.hp,116);assert.equal(unit.hp,80);assert.equal(run.wave,1);
});

test('brain attackers persist, damage repeatedly, remain targetable and stop damage on death',()=>{
 resetProgress();resetRun();run.spawnTimer=1000;
 const a=createUnit(100,'distraction',0,0),b=createUnit(102,'distraction',0,0);
 Object.assign(a,brainPosition(a));Object.assign(b,brainPosition(b));run.enemies=[a,b];
 stepBattle(1/60);const first=run.hp;assert.equal(run.enemies.length,2);assert.ok(a.attackingBrain&&b.attackingBrain);
 assert.equal(first,100-a.damage-b.damage);stepBattle(0.1);assert.equal(run.hp,first,'respect attack interval');
 for(let i=0;i<85;i++)stepBattle(1/60);assert.ok(run.hp<first);assert.ok(a.hp>0);
 const defender=createUnit(103,'exercise',950,300),decoy=createUnit(104,'distraction',980,300);
 act(defender,[decoy,a],1/60);assert.equal(defender.targetId,a.id,'brain attacker beats nearby decoy');assert.ok(defender.x<950);
 a.hp=0;b.hp=0;const hp=run.hp;stepBattle(1/60);stepBattle(2);assert.equal(run.hp,hp);assert.equal(run.enemies.length,0);assert.equal(run.kills,2);
});
test('brain-front separation prevents coincident attackers',()=>{
 const units=Array.from({length:7},(_,i)=>createUnit(i+20,'distraction',230,316));
 for(let i=0;i<180;i++){for(const u of units)act(u,[],1/60);separate(units,1/60);}
 for(let i=0;i<units.length;i++)for(let j=i+1;j<units.length;j++)assert.ok(distance(units[i],units[j])>20);
});
test('unit unlocks are one-time, old saves migrate, mastery applies to every instance',()=>{
 loadProgress({version:1,insight:100,levels:{damage:1,movement:1},round:2},()=>{});
 assert.equal(profile.levels.unlock_exercise,0);assert.equal(purchaseUpgrade('unlock_exercise'),true);
 assert.equal(purchaseUpgrade('unlock_exercise'),false);assert.ok(visible(UPGRADES.find(u=>u.id==='exercise_mastery')!));
 assert.equal(purchaseUpgrade('exercise_mastery'),true);profile.levels.resources=4;
 resetRun();buyDefender('exercise');buyDefender('exercise');assert.equal(run.defenders.length,2);
 assert.equal(run.defenders[0].roleLevel,1);assert.equal(run.defenders[1].roleLevel,1);
 const focus=run.focus;buyDefender('sleep');assert.equal(run.focus,focus,'locked role cannot be purchased');
});
test('Sleep heals, Social buffs without stacking, Mindfulness damages and slows an area',()=>{
 const healer=createUnit(1,'sleep',400,300),ally=createUnit(2,'reading',430,300),social=createUnit(3,'social',450,300);
 ally.hp=50;support([healer,ally,social],1);assert.ok(ally.hp>50);assert.ok(ally.buff>1);
 const buff=ally.buff;support([healer,ally,social,createUnit(4,'social',450,320)],1);assert.equal(ally.buff,buff);
 const mind=createUnit(5,'mindfulness',500,300),enemy=createUnit(6,'distraction',550,300),other=createUnit(7,'distraction',560,315);
 act(mind,[enemy,other],1/60);assert.ok(enemy.hp<enemy.maxHp&&other.hp<other.maxHp);assert.ok(other.slow>0);
 const runner=createUnit(8,'exercise',400,300),reader=createUnit(9,'reading',400,300),target=createUnit(10,'distraction',700,300);
 act(runner,[target],0.1);act(reader,[target],0.1);assert.ok(runner.x-reader.x>5,'Exercise sprints rather than merely walking');
});

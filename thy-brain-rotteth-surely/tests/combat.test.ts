import assert from 'node:assert/strict';
import { test } from 'node:test';
import { run, resetRun, buyDefender, stepBattle, endAttempt } from '../game/battle.ts';
import { createUnit, separate, distance, act, hit } from '../game/combat/units.ts';
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
test('actual earned-currency campaign eventually wins after meaningful losses',()=>{
 resetProgress();let losses=0;
 for(let attempt=0;attempt<60&&!profile.storyComplete;attempt++) {
  resetRun();fight();if(run.phase==='defeat'){losses++;assert.ok(run.insightEarned>0);}
  for(let i=0;i<100;i++) {const options=UPGRADES.filter(u=>visible(u)&&unlocked(u)&&upgradeCost(u,profile.levels[u.id])<=profile.insight).sort((a,b)=>upgradeCost(a,profile.levels[a.id])-upgradeCost(b,profile.levels[b.id]));if(!options.length)break;purchaseUpgrade(options[0].id);}
 }
 assert.equal(profile.storyComplete,true);assert.ok(losses>=2);
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

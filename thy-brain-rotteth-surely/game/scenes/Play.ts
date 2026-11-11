import { DEFENDERS, type DefenderKind } from '../combat/defenders.js';
import { profile } from '../progression/state.js';
import { game } from '../engine.js';
import { listen, tapped } from '../input.js';
import { createDialoguePanel } from '../dialogue/panel.js';
import { run, resetRun, buyDefender, stepBattle } from '../battle.js';
import { BEHAVIORS } from '../combat/config.js';
import { distance } from '../combat/units.js';
let stopListening = (): void => {};
export const Play = {
    name: 'play',
    enter(): void {
        resetRun(); game.background.color('#10162a');
        const field = game.graphics({ layer: 'back' });
        const hud = game.text('', 32, 38, { align: 'left', size: 24 });
        const notice = game.text('', 640, 98, { size: 18, color: '#ffd88a' });
        const stats = game.text('', 640, 514, { size: 17, color: '#b3c7d9' });
        game.text('Red: aggressive   Gold: opportunistic   Purple: evasive   Blue: relentless', 640, 540, { size: 14, color: '#b3c7d9' });
        game.text('BRAIN', 128, 316, { size: 24 });
        const kinds=Object.keys(DEFENDERS) as DefenderKind[];
        kinds.forEach((kind,i)=>{if(kind==='reading'||profile.levels['unlock_'+kind])game.ui.button({anchor:'center',x:-510+i*245,y:218,h:40,text:`[${i+1}] ${kind==='social'?'Social':DEFENDERS[kind].name}: ${DEFENDERS[kind].cost}`,onClick:()=>buyDefender(kind)});});
        const refreshDialogue = createDialoguePanel();
        game.ui.pauseButton(); game.ui.muteButton(); stopListening = listen();
        const draw = (): void => {
            hud.text = `Brain: ${Math.ceil(run.hp)}/${run.maxHp}   Focus: ${run.focus}   Round ${run.round}  Wave ${run.wave+1}/4   Insight: +${run.insightEarned}`;
            notice.text = run.message;
            const selected = run.defenders.find(d => d.id === run.selected);
            stats.text = selected ? `${DEFENDERS[selected.kind as DefenderKind].name} L${selected.roleLevel} | HP ${Math.ceil(selected.hp)}/${Math.ceil(selected.maxHp)} | Damage ${selected.damage.toFixed(1)} | ${selected.attackSpeed.toFixed(2)} attacks/s | Speed ${Math.round(selected.speed)} | Reach ${selected.range}` : 'Select a defender by clicking it. Focus recruits defenders. Insight buys permanent upgrades after this attempt.';
            field.clear(); field.draw(ctx => {
                ctx.fillStyle = '#19263b'; ctx.fillRect(0, 0, 1280, 76);
                ctx.fillStyle = '#23354a'; ctx.fillRect(216, 126, 1000, 368);
                ctx.fillStyle = run.hp / run.maxHp > 0.75 ? '#cf91bb' : run.hp / run.maxHp > 0.5 ? '#a48294' : run.hp / run.maxHp > 0.25 ? '#797565' : '#555b48';
                ctx.beginPath(); ctx.ellipse(128, 316, 88, 112, 0, 0, Math.PI * 2); ctx.fill();
                for (let i = 0; i < (1 - run.hp / run.maxHp) * 10; i++) {
                    ctx.fillStyle = '#354238'; ctx.beginPath(); ctx.arc(80 + (i % 4) * 30, 260 + Math.floor(i / 4) * 48, 10, 0, Math.PI * 2); ctx.fill();
                }
                for (const unit of [...run.defenders, ...run.enemies]) {
                    if (unit.id === run.selected) {
                        ctx.strokeStyle = '#ffe494'; ctx.lineWidth = 2;
                        ctx.beginPath(); ctx.arc(unit.x, unit.y, 22, 0, Math.PI * 2); ctx.stroke();
                    }
                    ctx.fillStyle = unit.flash > 0 ? '#ffffff' : unit.kind !== 'distraction' ? DEFENDERS[unit.kind].color : BEHAVIORS[unit.behavior].color;
                    ctx.beginPath(); ctx.arc(unit.x, unit.y, 15, 0, Math.PI * 2); ctx.fill();
                    if(unit.attackingBrain){ctx.strokeStyle='#ff4545';ctx.lineWidth=3;ctx.beginPath();ctx.arc(unit.x,unit.y,20,0,Math.PI*2);ctx.stroke();}
                    ctx.fillStyle = '#162a32';
                    if(unit.kind!=='distraction'){ctx.font='bold 15px sans-serif';ctx.textAlign='center';ctx.fillText(DEFENDERS[unit.kind].icon,unit.x,unit.y+5);}
                    else {ctx.fillRect(unit.x-7,unit.y-5,4,4);ctx.fillRect(unit.x+3,unit.y-5,4,4);}
                    ctx.fillStyle = '#151b27'; ctx.fillRect(unit.x - 18, unit.y - 27, 36, 4);
                    ctx.fillStyle = '#a8e6cf'; ctx.fillRect(unit.x - 18, unit.y - 27, 36 * Math.max(0, unit.hp / unit.maxHp), 4);
                }
            }); refreshDialogue();
        };
        draw();
        game.step('play', dt => {
            if (game.input.keyPressed('Escape') || game.input.keyPressed('KeyP')) { game.scenes.push('pause'); return; }

            if (game.input.keyPressed('KeyB')) buyDefender();
            kinds.forEach((kind,i)=>{if(game.input.keyPressed('Digit'+(i+1)))buyDefender(kind);});
            const tap = tapped();
            if (tap && tap.y < 494) {
                const unit = run.defenders.find(d => distance(d, tap) < 25);
                if (unit) run.selected = unit.id;
            }
            stepBattle(dt); draw();
            if (run.phase === 'victory' || run.phase === 'defeat') game.scenes.go('gameover');
        });
    },
    exit(): void { stopListening(); },
};





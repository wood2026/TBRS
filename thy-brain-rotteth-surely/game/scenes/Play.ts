import { DEFENDERS, type DefenderKind } from '../combat/defenders.js';
import type { Unit } from '../combat/units.js';
import { profile } from '../progression/state.js';
import { game } from '../engine.js';
import { musicButton } from '../music.js';
import { listen, tapped } from '../input.js';
import { createDialoguePanel } from '../dialogue/panel.js';
import { run, resetRun, buyDefender, stepBattle } from '../battle.js';
import { BEHAVIORS, type Behavior } from '../combat/config.js';

let stopListening = (): void => {};

const ROLE_EFFECTS: Partial<Record<string, string>> = { exercise: 'sprint', sleep: 'healing', social: 'buff', mindfulness: 'pulse' };
const BATTLEFIELDS = [
    'combat-background', 'battlefield-crossroads', 'battlefield-archive', 'battlefield-cloister', 'battlefield-sanctuary',
];

const DISTRACTION_LABELS: [Behavior, string][] = [
    ['aggressive', 'Pop-up Ads'],
    ['opportunistic', 'Phone Notifications'],
    ['evasive', 'Tab Hopping'],
    ['relentless', 'Autoplay Feeds'],
];

const screenX = (x: number) => 300 + (x - 190) * 0.88;
const screenY = (y: number) => 244 + (y - 125) * 0.69;
const UNIT_ATTACK_POSE_TIME = 0.18;
const UNIT_HURT_POSE_TIME = 0.18;
const BRAIN_FLASH_TIME = 0.18;
const BRAIN_CRACKS = [
    [[110, 204], [101, 228], [117, 239], [110, 260], [123, 272]],
    [[170, 223], [153, 252], [165, 269], [147, 288], [154, 304]],
    [[67, 254], [78, 275], [65, 295], [83, 307], [86, 324]],
];

function makeUnitArt(unit: Unit) {
    const texture = unit.kind === 'distraction' ? unit.behavior : unit.kind;
    const body = game.spawn({ id: texture + '-' + unit.id, texture, width: texture === 'relentless' ? 86 : 66, layer: 'world', sx: texture === 'evasive' ? -1 : 1 });
    const impact = game.spawn({ texture: 'impact', width: 45, layer: 'front', visible: false });
    const effectTexture = ROLE_EFFECTS[texture];
    const effect = effectTexture
        ? game.spawn({ texture: effectTexture, width: 79, layer: 'world', z: -1, visible: false })
        : undefined;
    return { body, impact, effect, stride: 0, previousHp: unit.hp, hurtTime: 0 };
}

export const Play = {
    name: 'play',
    enter(): void {
        resetRun();
        game.background.picture(BATTLEFIELDS[Math.min(run.round, BATTLEFIELDS.length) - 1], 'cover');
        const field = game.graphics({ layer: 'back' });
        const markers = game.graphics({ layer: 'front' });
        const brainDamage = game.graphics({ layer: 'back' });
        const objective = game.spawn({ id: 'brain-condition', texture: 'brain-healthy', x: 1051, y: 36, width: 69, layer: 'hud' });
        const brainImpact = game.spawn({ id: 'brain-damage-flash', texture: 'brain-impact', x: 121, y: 264, width: 176, layer: 'world', visible: false });
        const sprites = new Map<number, ReturnType<typeof makeUnitArt>>();
        let brainFlash = 0;
        let previousHealth = run.hp;
        let previousDamage = -1;
        const hud = game.text('', 32, 38, { align: 'left', size: 24 });
        const notice = game.text('', 640, 98, { size: 18, color: '#ffd88a', stroke: { color: '#151024', width: 3 } });
        const stats = game.text('', 640, 514, { size: 17, color: '#e1e8fa' });
        DISTRACTION_LABELS.forEach(([behavior, label], index) => {
            const x = 280 + index * 200;
            game.spawn({ texture: behavior, x, y: 540, width: 24, layer: 'hud', sx: behavior === 'evasive' ? -1 : 1 });
            game.text(label, x + 19, 540, { align: 'left', size: 14, color: BEHAVIORS[behavior].color });
        });

        const kinds = Object.keys(DEFENDERS) as DefenderKind[];
        kinds.forEach((kind, i) => {
            if (kind !== 'reading' && !profile.levels['unlock_' + kind]) return;
            game.ui.button({
                anchor: 'center', x: -510 + i * 245, y: 218, h: 40,
                icon: 'icon-' + kind, iconSize: 28,
                text: `[${i + 1}] ${kind === 'social' ? 'Social' : DEFENDERS[kind].name}: ${DEFENDERS[kind].cost}`,
                onClick: () => buyDefender(kind),
            });
        });
        const refreshDialogue = createDialoguePanel();
        game.ui.pauseButton();
        musicButton();
        stopListening = listen();

        field.draw(ctx => {
            ctx.fillStyle = '#161126e8'; ctx.fillRect(0, 0, 1280, 76);
            ctx.fillStyle = '#161126d8'; ctx.fillRect(0, 500, 1280, 220);
        });

        const draw = (dt: number): void => {
            hud.text = `Brain: ${Math.ceil(run.hp)}/${run.maxHp}   Focus: ${run.focus}   Round ${run.round}  Wave ${run.wave + 1}/4   Insight: +${run.insightEarned}`;
            notice.text = run.message;
            const selected = run.defenders.find(d => d.id === run.selected);
            stats.text = selected
                ? `${DEFENDERS[selected.kind as DefenderKind].name} L${selected.roleLevel} | HP ${Math.ceil(selected.hp)}/${Math.ceil(selected.maxHp)} | Damage ${selected.damage.toFixed(1)} | ${selected.attackSpeed.toFixed(2)} attacks/s | Speed ${Math.round(selected.speed)} | Reach ${selected.range}`
                : 'Select a defender by clicking it. Focus recruits defenders. Insight buys permanent upgrades after this attempt.';

            const health = run.hp / run.maxHp;
            const damage = health > 0.75 ? 0 : health > 0.5 ? 1 : health > 0.25 ? 2 : 3;
            if (damage !== previousDamage) {
                previousDamage = damage;
                brainDamage.clear();
                brainDamage.draw(ctx => {
                    for (const crack of BRAIN_CRACKS.slice(0, damage)) {
                        ctx.beginPath();
                        crack.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
                        ctx.lineJoin = 'round';
                        ctx.strokeStyle = '#3b133f';
                        ctx.lineWidth = 5;
                        ctx.stroke();
                        ctx.strokeStyle = damage === 3 ? '#ff9a67' : '#ce5a9a';
                        ctx.lineWidth = damage === 3 ? 2 : 1;
                        ctx.stroke();
                    }
                });
            }
            objective.texture = health <= 0 ? 'brain-defeated' : damage === 3 ? 'brain-critical' : damage ? 'brain-hurt' : 'brain-healthy';
            brainFlash = run.hp < previousHealth ? BRAIN_FLASH_TIME : Math.max(0, brainFlash - dt);
            previousHealth = run.hp;
            brainImpact.visible = brainFlash > 0;
            brainImpact.alpha = brainFlash / BRAIN_FLASH_TIME;
            objective.tint = brainFlash > 0.1 ? '#ffafc4' : damage === 1 ? '#ffc4d8' : '#ffffff';

            const units = [...run.defenders, ...run.enemies];
            const active = new Set(units.map(unit => unit.id));
            for (const [id, art] of sprites) {
                if (active.has(id)) continue;
                game.roster.kill(art.body);
                game.roster.kill(art.impact);
                if (art.effect) game.roster.kill(art.effect);
                sprites.delete(id);
            }

            for (const unit of units) {
                const art = sprites.get(unit.id) ?? makeUnitArt(unit);
                sprites.set(unit.id, art);
                const x = screenX(unit.x), y = screenY(unit.y);
                const speed = Math.hypot(unit.vx, unit.vy);
                const moving = Math.min(1, speed / 35);
                art.stride += dt * Math.min(20, speed * 0.24);
                const stride = Math.sin(art.stride);
                const sinceAttack = unit.cooldown > 0 ? 1 / unit.attackSpeed - unit.cooldown : Infinity;
                const attack = Math.max(0, 1 - sinceAttack / UNIT_ATTACK_POSE_TIME);
                const forward = unit.kind === 'distraction' ? -1 : 1;
                const target = attack > 0 ? units.find(other => other.id === unit.targetId) : undefined;
                const strikeDirection = target ? Math.sign(target.x - unit.x) || forward : forward;
                art.hurtTime = unit.hp < art.previousHp ? UNIT_HURT_POSE_TIME : Math.max(unit.flash, art.hurtTime - dt);
                art.previousHp = unit.hp;
                const hurt = art.hurtTime / UNIT_HURT_POSE_TIME;
                art.body.x = x + strikeDirection * attack * 8 - forward * hurt * 4;
                art.body.y = y - 14 - Math.abs(stride) * moving * 4;
                art.body.rot = stride * moving * 0.075 + strikeDirection * attack * 0.14;
                art.body.sy = 1 + moving * stride * 0.045 - hurt * 0.1;
                art.body.tint = hurt > 0.5 ? '#ffc2c8' : '#ffffff';
                art.body.z = y;
                art.impact.x = x;
                art.impact.y = y - 15;
                art.impact.visible = hurt > 0;
                art.impact.alpha = hurt;
                if (art.effect) {
                    const sprinting = unit.kind === 'exercise' && Math.hypot(unit.vx, unit.vy) > unit.speed * 1.1;
                    art.effect.visible = sprinting || unit.kind === 'sleep' || unit.kind === 'social'
                        || (unit.kind === 'mindfulness' && unit.cooldown > 1 / unit.attackSpeed - 0.16);
                    art.effect.x = sprinting ? x - Math.sign(unit.vx) * 33 : x;
                    art.effect.y = y + 10;
                }
            }

            markers.clear();
            markers.draw(ctx => {
                for (const unit of units) {
                    const x = screenX(unit.x), y = screenY(unit.y);
                    if (unit.id === run.selected || unit.attackingBrain) {
                        ctx.strokeStyle = unit.attackingBrain ? '#ff4545' : '#ffe494';
                        ctx.lineWidth = 2;
                        ctx.beginPath(); ctx.ellipse(x, y + 15, 28, 7, 0, 0, Math.PI * 2); ctx.stroke();
                    }
                    ctx.fillStyle = '#151b27'; ctx.fillRect(x - 18, y - 48, 36, 5);
                    ctx.fillStyle = unit.kind === 'distraction' ? BEHAVIORS[unit.behavior].color : '#a8e6cf';
                    ctx.fillRect(x - 18, y - 48, 36 * Math.max(0, unit.hp / unit.maxHp), 5);
                }
            });
            refreshDialogue();
        };

        draw(0);
        game.step('play', dt => {
            if (game.ui.modalTop) return;
            if (game.input.keyPressed('Escape') || game.input.keyPressed('KeyP')) { game.scenes.push('pause'); return; }
            if (game.input.keyPressed('KeyB')) buyDefender();
            kinds.forEach((kind, i) => { if (game.input.keyPressed('Digit' + (i + 1))) buyDefender(kind); });
            const tap = tapped();
            if (tap && tap.y < 500) {
                const unit = [...run.defenders].sort((a, b) => b.y - a.y).find(defender =>
                    Math.abs(tap.x - screenX(defender.x)) < 33 && Math.abs(tap.y - (screenY(defender.y) - 14)) < 37);
                if (unit) run.selected = unit.id;
            }
            stepBattle(dt);
            draw(dt);
            if (run.phase === 'victory' || run.phase === 'defeat') game.scenes.go('gameover');
        });
    },
    exit(): void { stopListening(); },
};

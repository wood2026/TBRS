import { DEFENDERS, type DefenderKind } from '../combat/defenders.js';
import type { Unit } from '../combat/units.js';
import { profile } from '../progression/state.js';
import { resourceDebug } from '../progression/currency.js';
import { game } from '../engine.js';
import { musicButton } from '../music.js';
import { listen, tapped } from '../input.js';
import { playOpeningConversation, playStory } from '../dialogue/panel.js';
import type { StoryId } from '../dialogue/rounds.js';
import { run, resetRun, buyDefender, stepBattle } from '../battle.js';
import { BEHAVIORS, type Behavior } from '../combat/config.js';

let stopListening = (): void => {};

const ROLE_EFFECTS: Partial<Record<string, string>> = { exercise: 'sprint', sleep: 'healing', social: 'buff', mindfulness: 'pulse' };
const BATTLEFIELDS = [
    'battlefield-forest', 'battlefield-crossroads', 'battlefield-archive', 'battlefield-cloister', 'battlefield-sanctuary',
];
const VICTORY_STORY: Partial<Record<number, StoryId>> = {
    1: 'roundOneFinished',
    2: 'roundTwoFinished',
    3: 'roundThreeFinished',
    4: 'roundFourFinished',
    5: 'ending',
};

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
const BRAIN_BASE = { x: 151, y: 322, width: 322, height: 248 };

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
        const brain = game.spawn({ id: 'brain-base', texture: 'brain-healthy', ...BRAIN_BASE, layer: 'world', z: -3 });
        const minorDamage = game.spawn({
            id: 'brain-light-damage', texture: 'brain-hurt', ...BRAIN_BASE, layer: 'world', z: -2,
            alpha: 0.55, visible: false,
        });
        const objective = game.spawn({ id: 'brain-condition', texture: 'brain-healthy', x: 1051, y: 36, width: 69, layer: 'hud' });
        const brainImpact = game.spawn({ id: 'brain-damage-flash', texture: 'brain-impact', x: 146, y: 307, width: 176, layer: 'world', visible: false });
        const sprites = new Map<number, ReturnType<typeof makeUnitArt>>();
        let brainFlash = 0;
        let previousHealth = run.hp;
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
        game.ui.pauseButton();
        musicButton();
        stopListening = listen();

        field.draw(ctx => {
            ctx.fillStyle = '#161126e8'; ctx.fillRect(0, 0, 1280, 76);
            ctx.fillStyle = '#161126d8'; ctx.fillRect(0, 500, 1280, 220);
        });

        const draw = (dt: number): void => {
            const focus = resourceDebug.infinite ? 'Unlimited' : run.focus;
            const insight = resourceDebug.infinite ? 'Unlimited' : '+' + run.insightEarned;
            hud.text = `Brain: ${Math.ceil(run.hp)}/${run.maxHp}   Focus: ${focus}   Round ${run.round}  Wave ${run.wave + 1}/4   Insight: ${insight}`;
            notice.text = run.message;
            const selected = run.defenders.find(d => d.id === run.selected);
            stats.text = selected
                ? `${DEFENDERS[selected.kind as DefenderKind].name} L${selected.roleLevel} | HP ${Math.ceil(selected.hp)}/${Math.ceil(selected.maxHp)} | Damage ${selected.damage.toFixed(1)} | ${selected.attackSpeed.toFixed(2)} attacks/s | Speed ${Math.round(selected.speed)} | Reach ${selected.range}`
                : 'Select a defender by clicking it. Focus recruits defenders. Insight buys permanent upgrades after this attempt.';

            const health = run.hp / run.maxHp;
            const lightlyDamaged = health <= 0.75 && health > 0.5;
            const brainTexture = health > 0.5 ? 'brain-healthy'
                : health > 0.25 ? 'brain-hurt' : health > 0 ? 'brain-critical' : 'brain-defeated';
            brain.texture = brainTexture;
            minorDamage.visible = lightlyDamaged;
            objective.texture = lightlyDamaged ? 'brain-hurt' : brainTexture;
            brainFlash = run.hp < previousHealth ? BRAIN_FLASH_TIME : Math.max(0, brainFlash - dt);
            previousHealth = run.hp;
            brainImpact.visible = brainFlash > 0 && health > 0;
            brainImpact.alpha = brainFlash / BRAIN_FLASH_TIME;
            objective.tint = brainFlash > 0.1 ? '#ffafc4' : lightlyDamaged ? '#ffc4d8' : '#ffffff';

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
        };

        draw(0);
        playOpeningConversation();
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
            if (run.phase !== 'combat') {
                const story = run.phase === 'defeat' ? 'firstFailure' : VICTORY_STORY[run.round];
                playStory(story ? [story] : [], () => game.scenes.go('gameover'));
            }
        });
    },
    exit(): void { stopListening(); },
};

import { game } from '../engine.js';
import { musicButton } from '../music.js';
import { playStory } from '../dialogue/panel.js';
import type { StoryId } from '../dialogue/rounds.js';
import { rankBenefit } from '../progression/benefits.js';
import { resourceDebug } from '../progression/currency.js';
import { canPurchaseUpgrade, profile, purchaseUpgrade, resetProgress, unlocked, visible } from '../progression/state.js';
import { UPGRADES, upgradeCost, type Upgrade } from '../progression/upgrades.js';

const ART: Record<string, string> = {
    damage: 'reading', attack: 'focus', movement: 'movement', brain: 'resilience',
    income: 'insight', unlock_exercise: 'exercise', recovery: 'health', resources: 'focus',
    exercise_mastery: 'exercise', unlock_sleep: 'sleep', unlock_social: 'social',
    unlock_mindfulness: 'mindfulness', sleep_mastery: 'sleep', social_mastery: 'social',
    mindfulness_mastery: 'mindfulness', reading_mastery: 'reading',
};
const PURCHASE_STORY: Partial<Record<string, StoryId>> = {
    movement: 'exercise', unlock_exercise: 'exercise',
    recovery: 'sleep', unlock_sleep: 'sleep',
    unlock_social: 'social', unlock_mindfulness: 'mindfulness',
};

const TREE = { x: 34, y: 188, w: 818, h: 421 };
const PANEL = { x: 874, y: 188, w: 372, h: 421 };
const NODE_W = 222;
const NODE_H = 90;
const INK = '#f0e7fb';
const MUTED = '#b8acc8';
const CYAN = '#88eaf0';
const GOLD = '#f6cd78';
const nodeX = (node: Upgrade) => node.x + 10;
const nodeY = (node: Upgrade, scroll: number) => TREE.y + node.y - scroll;
const rankText = (node: Upgrade) => `${profile.levels[node.id]}/${node.max ?? '∞'}`;
let scroll = 0;
let selected = UPGRADES[0];

function plate(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, rim?: string) {
    const cut = 10;
    ctx.beginPath();
    ctx.moveTo(x + cut, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h - cut);
    ctx.lineTo(x + w - cut, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + cut);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (rim) {
        ctx.strokeStyle = rim;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}

function text(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, font: string, color: string) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(value, x, y);
}

function wrapped(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, width: number, font: string, color: string, leading = 19) {
    ctx.font = font;
    ctx.fillStyle = color;
    let line = '';
    for (const word of value.split(' ')) {
        const candidate = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(candidate).width > width) {
            ctx.fillText(line, x, y);
            y += leading;
            line = word;
        } else line = candidate;
    }
    ctx.fillText(line, x, y);
}

function bracket(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.beginPath();
    for (const side of [-1, 1]) {
        const left = x + side * (NODE_W / 2 + 4);
        const top = y + side * (NODE_H / 2 + 4);
        ctx.moveTo(left - side * 15, top);
        ctx.lineTo(left, top);
        ctx.lineTo(left, top - side * 15);
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = CYAN;
    ctx.stroke();
}

function lock(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.strokeStyle = '#b0a1bf';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y - 2, 4, Math.PI, 0);
    ctx.stroke();
    ctx.strokeRect(x - 6, y - 2, 12, 9);
}

function drawTree(ctx: CanvasRenderingContext2D, nodes: Upgrade[], maxScroll: number) {
    plate(ctx, TREE.x, TREE.y, TREE.w, TREE.h, '#100d1cce', '#614c72');
    ctx.save();
    ctx.beginPath();
    ctx.rect(TREE.x + 2, TREE.y + 2, TREE.w - 16, TREE.h - 4);
    ctx.clip();
    for (const node of nodes) {
        const parent = nodes.find(candidate => candidate.id === node.parent);
        if (!parent) continue;
        const met = unlocked(node);
        const from = nodeY(parent, scroll) + NODE_H / 2;
        const to = nodeY(node, scroll) - NODE_H / 2;
        const bend = (from + to) / 2;
        ctx.strokeStyle = met ? '#70b5be' : '#71627b';
        ctx.lineWidth = met ? 2 : 1.5;
        ctx.setLineDash(met ? [] : [5, 6]);
        ctx.beginPath();
        ctx.moveTo(nodeX(parent), from);
        ctx.lineTo(nodeX(parent), bend);
        ctx.lineTo(nodeX(node), bend);
        ctx.lineTo(nodeX(node), to);
        ctx.stroke();
    }
    ctx.setLineDash([]);
    for (const node of nodes) {
        const x = nodeX(node), y = nodeY(node, scroll);
        const rank = profile.levels[node.id];
        const maxed = rank >= (node.max ?? Infinity);
        const locked = !unlocked(node);
        plate(ctx, x - NODE_W / 2, y - NODE_H / 2, NODE_W, NODE_H,
            locked ? '#1c1726' : '#251b35', maxed ? GOLD : rank > 0 ? '#bbb6cc' : undefined);
        if (canPurchaseUpgrade(node)) {
            const glow = ctx.createRadialGradient(x - 76, y, 3, x - 76, y, 30);
            glow.addColorStop(0, '#88e6a970');
            glow.addColorStop(1, '#88e6a900');
            ctx.fillStyle = glow;
            ctx.fillRect(x - 106, y - 30, 60, 60);
        }
        wrapped(ctx, node.name, x - 45, y - 18, 137, '600 15px sans-serif', locked ? '#a69ab4' : INK, 17);
        text(ctx, rankText(node), x - 45, y + 29, 'bold 23px sans-serif', maxed ? GOLD : locked ? '#a69ab4' : INK);
        if (locked) lock(ctx, x + 90, y + 23);
        if (node === selected) bracket(ctx, x, y);
    }
    ctx.restore();
    if (maxScroll > 0) {
        const track = TREE.h - 24;
        const thumb = Math.max(30, track * TREE.h / (TREE.h + maxScroll));
        ctx.fillStyle = '#443751';
        ctx.fillRect(TREE.x + TREE.w - 11, TREE.y + 12, 4, track);
        ctx.fillStyle = '#9a7eb9';
        ctx.fillRect(TREE.x + TREE.w - 11, TREE.y + 12 + (track - thumb) * scroll / maxScroll, 4, thumb);
    }
}

function drawSelected(ctx: CanvasRenderingContext2D) {
    const rank = profile.levels[selected.id];
    const max = selected.max ?? Infinity;
    const cost = upgradeCost(selected, rank);
    const x = PANEL.x + 22;
    const content = PANEL.w - 44;
    plate(ctx, PANEL.x, PANEL.y, PANEL.w, PANEL.h, '#171124f5', '#755b8b');
    wrapped(ctx, selected.name, x + 62, 222, content - 62, 'bold 23px sans-serif', INK, 24);
    text(ctx, rankText(selected), x, 294, 'bold 32px sans-serif', rank >= max ? GOLD : INK);

    const count = Number.isFinite(max) ? max : 10;
    const segment = (content - (count - 1) * 4) / count;
    const filled = Number.isFinite(max) ? rank : rank === 0 ? 0 : (rank - 1) % count + 1;
    for (let index = 0; index < count; index++) {
        ctx.fillStyle = index < filled ? rank >= max ? GOLD : '#72cbd4' : '#40364f';
        ctx.fillRect(x + index * (segment + 4), 306, segment, 6);
    }
    if (!Number.isFinite(max)) {
        const first = rank - filled + 1;
        text(ctx, `Ranks ${first}–${first + count - 1}`, x + 104, 291, '14px sans-serif', MUTED);
    }

    text(ctx, 'CURRENT BENEFIT', x, 343, 'bold 13px sans-serif', CYAN);
    wrapped(ctx, rankBenefit(selected, rank), x, 366, content, '16px sans-serif', INK);
    if (rank >= max) {
        text(ctx, 'MAX RANK', x, 448, 'bold 22px sans-serif', GOLD);
        return;
    }

    text(ctx, `RANK ${rank + 1} BENEFIT`, x, 419, 'bold 13px sans-serif', CYAN);
    wrapped(ctx, rankBenefit(selected, rank + 1), x, 442, content, '16px sans-serif', INK);
    text(ctx, `${cost.toLocaleString()} Insight`, x, 517, 'bold 20px sans-serif', GOLD);
    const parent = UPGRADES.find(node => node.id === selected.parent);
    const requirements: string[] = [];
    if (parent && profile.levels[parent.id] < selected.required) {
        requirements.push(`Requires ${parent.name} rank ${selected.required}`);
    }
    if (profile.waves < selected.waves) {
        requirements.push(`Clear ${selected.waves} waves (${profile.waves}/${selected.waves})`);
    }
    const shortfall = cost - profile.insight;
    if (!resourceDebug.infinite && shortfall > 0) requirements.push(`Need ${shortfall.toLocaleString()} more Insight`);
    requirements.forEach((item, index) => text(ctx, item, x, 543 + index * 20, '15px sans-serif', index === 0 ? INK : MUTED));
}

export const GameOver = {
    name: 'gameover',
    enter(): void {
        game.background.picture('upgrade-background', 'cover');
        const art = game.graphics({ layer: 'back' });
        const outcome = profile.storyComplete ? 'complete'
            : profile.lastResult.startsWith('Victory') ? 'victory'
            : profile.lastResult.startsWith('Defeat') ? 'defeat' : null;
        if (outcome) game.spawn({ texture: 'outcome-' + outcome, x: 84, y: 109, width: 78, layer: 'world' });
        game.spawn({ texture: 'icon-insight', x: 956, y: 107, width: 48, layer: 'world' });

        const icons = new Map(UPGRADES.map(node => [node.id, game.spawn({
            id: 'node-icon-' + node.id, texture: 'icon-' + ART[node.id], width: 38, height: 38,
            x: nodeX(node) - 76, layer: 'world', visible: false,
        })]));
        if (!visible(selected)) selected = UPGRADES[0];
        const selectedIcon = game.spawn({
            id: 'selected-upgrade-icon', texture: 'icon-' + ART[selected.id], x: PANEL.x + 45, y: 226,
            width: 42, height: 42, layer: 'world',
        });

        let purchase: ReturnType<typeof game.ui.button> | undefined;
        let dragY: number | undefined;
        let travel = 0;
        let confirmReset = false;
        let lastPaint = '';
        const refresh = () => {
            const nodes = UPGRADES.filter(visible);
            const maxScroll = Math.max(0, nodes[nodes.length - 1].y + NODE_H / 2 + 18 - TREE.h);
            scroll = Math.max(0, Math.min(scroll, maxScroll));
            const key = JSON.stringify([selected.id, scroll, profile, resourceDebug.infinite]);
            if (key === lastPaint) return;
            lastPaint = key;
            const purchasable = canPurchaseUpgrade(selected);
            if (!purchasable && purchase) {
                game.roster.kill(purchase);
                purchase = undefined;
            }
            if (purchasable && !purchase) {
                purchase = game.ui.button({
                    id: 'purchase-upgrade', anchor: 'center', x: 420, y: 213, w: 328, h: 43,
                    text: 'Purchase upgrade', style: 'good', onClick: () => {
                        if (!purchaseUpgrade(selected.id)) return;
                        refresh();
                        const story = PURCHASE_STORY[selected.id];
                        if (story) playStory([story]);
                    },
                });
            }
            selectedIcon.texture = 'icon-' + ART[selected.id];
            for (const node of UPGRADES) {
                const icon = icons.get(node.id)!;
                icon.y = nodeY(node, scroll);
                icon.visible = visible(node) && icon.y - 19 >= TREE.y && icon.y + 19 <= TREE.y + TREE.h;
                icon.alpha = unlocked(node) ? 1 : 0.48;
            }
            art.clear();
            art.draw(ctx => {
                plate(ctx, 34, 18, 418, 47, '#171025e8');
                text(ctx, 'Permanent growth', 49, 51, 'bold 30px sans-serif', INK);
                plate(ctx, 34, 76, 544, 67, '#171025e8', '#645471');
                text(ctx, 'PREVIOUS BATTLE', outcome ? 138 : 50, 99, 'bold 13px sans-serif', MUTED);
                wrapped(ctx, profile.lastResult, outcome ? 138 : 50, 119, outcome ? 424 : 510, '16px sans-serif', INK, 17);
                plate(ctx, 594, 76, 307, 67, '#171025e8', '#645471');
                text(ctx, 'PROGRESSION', 610, 99, 'bold 13px sans-serif', MUTED);
                text(ctx, `Round ${profile.round}  ·  ${profile.waves} waves cleared`, 610, 124, '17px sans-serif', INK);
                plate(ctx, 918, 70, 328, 76, '#241b2bed', '#ab835d');
                text(ctx, resourceDebug.infinite ? 'INSIGHT · DEBUG' : 'INSIGHT', 989, 95, 'bold 13px sans-serif', MUTED);
                text(ctx, resourceDebug.infinite ? '∞' : profile.insight.toLocaleString(), 989, 132, 'bold 38px sans-serif', GOLD);
                plate(ctx, 34, 153, 818, 28, '#171025e8');
                text(ctx, 'Upgrade tree', 46, 173, 'bold 16px sans-serif', INK);
                text(ctx, 'Select an upgrade  ·  Scroll, drag, or use ↑ / ↓', 504, 173, '14px sans-serif', MUTED);
                drawTree(ctx, nodes, maxScroll);
                drawSelected(ctx);
            });
        };

        musicButton();
        game.ui.button({
            anchor: 'center', x: 445, y: 297, w: 316, h: 52, style: 'good',
            text: profile.storyComplete ? 'Continue beyond story' : `Attempt round ${profile.round}`,
            onClick: () => game.scenes.go('play'),
        });
        game.ui.button({ anchor: 'center', x: 192, y: 297, w: 124, h: 44, text: 'Title', onClick: () => game.scenes.go('title') });
        game.ui.button({
            anchor: 'center', x: -529, y: 297, w: 154, h: 42, style: 'bad', text: 'Reset save',
            onClick: control => {
                if (!confirmReset) {
                    confirmReset = true;
                    control.ui.text = 'Confirm reset';
                    return;
                }
                resetProgress();
                scroll = 0;
                selected = UPGRADES[0];
                game.scenes.go('gameover');
            },
        });
        if (!game.save.persistent) game.text('Storage unavailable: session progress only', 640, 701, { size: 15, color: '#ffb36b' });
        refresh();
        game.step('tree', dt => {
            if (game.ui.modalTop) return;
            const p = game.input.pointer;
            const inside = p && p.x >= TREE.x && p.x < TREE.x + TREE.w && p.y >= TREE.y && p.y < TREE.y + TREE.h;
            if (p?.pressed && inside) { dragY = p.y; travel = 0; }
            if (dragY !== undefined && p?.down) {
                const delta = dragY - p.y;
                scroll += delta;
                travel += Math.abs(delta);
                dragY = p.y;
            }
            if (dragY !== undefined && !p?.down) {
                dragY = undefined;
                if (p && inside && travel < 6) {
                    selected = UPGRADES.find(node => visible(node) &&
                        Math.abs(p.x - nodeX(node)) <= NODE_W / 2 && Math.abs(p.y - nodeY(node, scroll)) <= NODE_H / 2) ?? selected;
                }
            }
            if (inside) scroll += game.input.wheel;
            if (game.input.keyDown('ArrowDown')) scroll += dt * 420;
            if (game.input.keyDown('ArrowUp')) scroll -= dt * 420;
            refresh();
        });
    },
};

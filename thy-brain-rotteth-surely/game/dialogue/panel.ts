import { game } from '../engine.js';
import { run } from '../battle.js';
import { BATTLE } from '../combat/config.js';
import { ROUND_INTROS } from './rounds.js';
export function createDialoguePanel(): () => void {
    game.ui.panel({ anchor: 'center', y: 286, w: 1152, h: 100 });
    const speaker = game.text('', 96, 614, { align: 'left', size: 22, color: '#a8e6cf' });
    const line = game.text('', 96, 644, { align: 'left', size: 21 });
    game.text('B: recruit   Insight upgrades after attempts   P: pause', 96, 675, { align: 'left', size: 18, color: '#b3c7d9' });
    return () => {
        const entry = ROUND_INTROS[Math.min(run.round - 1, ROUND_INTROS.length - 1)];
        const index = Math.floor(run.roundTime / BATTLE.dialogueSeconds);
        speaker.text = index < entry.lines.length ? entry.speaker : `Round ${run.round}`;
        line.text = entry.lines[index] ?? run.message;
    };
}


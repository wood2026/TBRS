import { game } from '../engine.js';
import { run } from '../battle.js';
import { markStorySeen, profile } from '../progression/state.js';
import { addExchange, speakerPortrait } from './references.js';
import { exchange, type StoryId } from './rounds.js';

const READ_TIME = 6;
const transparent = { fill: '#00000000', border: 0, bevel: 0, depth: 0, gloss: 0, shine: 0, shadow: 0 };

export function createDialoguePanel(): () => void {
    const pending: StoryId[] = [];
    let panel: ReturnType<typeof game.ui.panel> | undefined;
    let displayedAt = -Infinity;
    const advance = () => {
        if (panel) game.roster.kill(panel);
        panel = undefined;
        const id = pending.shift();
        if (!id) return;
        markStorySeen(id);
        displayedAt = run.roundTime;
        panel = game.ui.panel({
            id: 'story-strip', anchor: 'center', y: 300, w: 1152, h: 118,
            layout: { direction: 'row', padding: 8, gap: 12, align: 'center' },
        });
        const speakers = new Set(exchange(id).lines.map(line => line.speaker));
        for (const speaker of speakers) {
            game.ui.label({
                parent: panel, id: speakerPortrait[speaker], w: 80, h: 94,
                icon: speakerPortrait[speaker], iconSize: 72,
            });
        }
        const dialogue = game.ui.panel({
            parent: panel, w: 1136 - speakers.size * 92, h: 102, style: transparent,
            layout: { padding: 0, gap: 2, align: 'stretch' },
        });
        addExchange(dialogue, id, false);
        game.ui.button({ parent: dialogue, alignSelf: 'end', h: 30, text: 'Dismiss', onClick: advance });
    };
    const dialogueFocused = () => {
        let focused = game.ui.focus;
        while (focused) {
            if (focused === panel) return true;
            focused = focused.ui.parent;
        }
        return false;
    };
    const queue = (id: StoryId, reached: boolean) => {
        if (reached && !profile.storySeen.includes(id) && !pending.includes(id)) pending.push(id);
    };
    return () => {
        if (run.round !== 1) return;
        queue('opening', true);
        queue('distraction', run.spawned > 0 || run.wave > 0);
        queue('reading', run.defenders.some(unit => unit.kind === 'reading'));
        queue('wave', run.wave > 0);
        if (pending.length && (!panel || (run.roundTime - displayedAt >= READ_TIME && !dialogueFocused()))) advance();
    };
}

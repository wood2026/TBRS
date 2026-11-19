import { game } from '../engine.js';
import { run } from '../battle.js';
import { markStorySeen, profile } from '../progression/state.js';
import { addExchange } from './references.js';
import { type StoryId } from './rounds.js';

const READ_TIME = 6;

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
            layout: { padding: { top: 8, left: 18, right: 18, bottom: 8 }, gap: 2, align: 'stretch' },
        });
        addExchange(panel, id);
        game.ui.button({ parent: panel, alignSelf: 'end', h: 30, text: 'Dismiss', onClick: advance });
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

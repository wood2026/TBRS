import { markStorySeen, profile } from '../progression/state.js';
import { showExchange } from './references.js';
import type { StoryId } from './rounds.js';

export function playStory(ids: readonly StoryId[], onComplete?: () => void): void {
    const advance = () => {
        const id = ids.find(candidate => !profile.storySeen.includes(candidate));
        if (!id) {
            onComplete?.();
            return;
        }
        markStorySeen(id);
        showExchange(id, advance);
    };
    advance();
}

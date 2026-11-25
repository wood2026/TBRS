import { markStorySeen, profile, saveProgress } from '../progression/state.js';
import { showExchange } from './references.js';
import type { StoryId } from './rounds.js';

const OPENING_CONVERSATION: readonly StoryId[] = ['opening', 'distraction', 'reading'];

export function playOpeningConversation(): void {
    if (profile.openingComplete) return;
    const advance = (index: number): void => {
        if (index === OPENING_CONVERSATION.length) {
            profile.openingComplete = true;
            saveProgress();
            return;
        }
        showExchange(OPENING_CONVERSATION[index], () => advance(index + 1));
    };
    advance(0);
}

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

import type { SourceId } from './sources.js';

type Line = { speaker: 'Inner Voice' | 'Brain'; text: string; sources?: SourceId[]; context?: SourceId[] };
type Exchange = { title: string; lines: Line[] };

export const STORY = {
    opening: {
        title: 'A convenient suspect',
        lines: [
            { speaker: 'Inner Voice', text: "Thinking is too hard! What are you doing up there?!" },
            { speaker: 'Brain', text: "You're blaming me? I'll show you what's really to blame!" },
        ],
    },
    distraction: {
        title: 'First distraction',
        lines: [
            { speaker: 'Inner Voice', text: "Oh, hey, it's a YouTube short! What were we talking about?", sources: ['yousef'] },
        ],
    },
    reading: {
        title: 'Recruiting Reading',
        lines: [
            { speaker: 'Brain', text: "Of course you can't think if that's all you feed me! Try reading! Spend your focus wisely!" },
        ],
    },
    wave: {
        title: 'First wave cleared',
        lines: [
            { speaker: 'Brain', text: 'Remember the plan. Decide when to spend. That’s executive function at work.', sources: ['dictionary'] },
        ],
    },
    scores: {
        title: 'What did the tests measure?',
        lines: [
            { speaker: 'Inner Voice', text: 'Some school scores fell. Have I found my proof?', sources: ['neves'] },
            { speaker: 'Brain', text: 'You found a change in school scores. The older Danish tests showed modest gains.', sources: ['teasdale'] },
        ],
    },
    exercise: {
        title: 'Making room for movement',
        lines: [
            { speaker: 'Brain', text: 'Fewer young teens met the fitness benchmark in one U.S. survey.', sources: ['gahche'], context: ['fryar'] },
            { speaker: 'Inner Voice', text: 'Fitness matters, then. Send in the runner.', sources: ['diamond'] },
        ],
    },
    sleep: {
        title: 'One more clip',
        lines: [
            { speaker: 'Inner Voice', text: 'One more clip?' },
            { speaker: 'Brain', text: 'Short on sleep? Good luck keeping that plan straight.', sources: ['diamond'], context: ['ford', 'cdc'] },
        ],
    },
    social: {
        title: 'Social Connection',
        lines: [
            { speaker: 'Brain', text: 'Feeling alone can make planning harder. Put this one near an ally.', sources: ['diamond'], context: ['apa'] },
        ],
    },
    mindfulness: {
        title: 'Mindfulness',
        lines: [
            { speaker: 'Brain', text: 'Stress and low mood can make it harder to think clearly.', sources: ['diamond'] },
            { speaker: 'Inner Voice', text: 'One thing at a time, dear Brain. A pulse should buy us a moment.' },
        ],
    },
    ending: {
        title: 'Who rotteth the brain?',
        lines: [
            { speaker: 'Inner Voice', text: 'Who rotteth the brain, then? Was it the feed?' },
            { speaker: 'Brain', text: 'Perhaps. Sleep, fitness, stress and company all deserve a look.', sources: ['diamond'] },
            { speaker: 'Inner Voice', text: 'I came for a culprit. I leave with a bedtime and a walking companion.' },
        ],
    },
} satisfies Record<string, Exchange>;

export type StoryId = keyof typeof STORY;
export const STORY_IDS = Object.keys(STORY) as StoryId[];
export const exchange = (id: StoryId): Exchange => STORY[id];

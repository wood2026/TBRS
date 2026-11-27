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
    firstFailure: {
    title: 'Thy Brain Doth Rot!',
        lines: [
            { speaker: 'Inner Voice', text: "Task failed successfully!" },
            { speaker: 'Brain', text: "Ugh, let's try that again! Prepare better this time!" },
            { speaker: 'Brain', text: 'Remember the plan. Decide when to spend. That’s executive function at work.', sources: ['dictionary'] },
        ],
    },
    roundOneFinished: {
        title: 'We won?',
        lines: [
            { speaker: 'Inner Voice', text: "Am I cured?" },
            { speaker: 'Brain', text: "It's not that simple. Real progress takes time." },
            { speaker: 'Inner Voice', text: "It can't just be me." },
            { speaker: 'Inner Voice', text: "Studies show cognitive tests declining across the board.", sources: ['neves'] },
            { speaker: 'Brain', text: "You found a change in school scores. The older Danish tests showed modest gains.", sources: ['teasdale'] },
            { speaker: 'Inner Voice', text: "Ugh, whatever... Let's go again!" },
        ],
    },
    roundTwoFinished: {
        title: 'Lookie there! We won again!',
        lines: [
            { speaker: 'Inner Voice', text: "So maybe everyone including me isn't completely stupid." },
            { speaker: 'Brain', text: "..." },
            { speaker: 'Inner Voice', text: "Which one are you not responding to?" },
            { speaker: 'Brain', text: "Moving right along, it's great to be making progress, but repetition is key.", sources: ['diamond'] },
            { speaker: 'Inner Voice', text: "Then let's repeat!" },
        ],
    },
    roundThreeFinished: {
        title: 'What is this feeling?',
        lines: [
            { speaker: 'Inner Voice', text: "Is this... clarity?" },
            { speaker: 'Brain', text: "Not quite! Patience, my young padawan." },
            { speaker: 'Inner Voice', text: "Lord, that's a dated reference..." },
            { speaker: 'Brain', text: "I'm *your* brain, you know..."},
            { speaker: 'Inner Voice', text: "Oh, isn't there supposed to be a lesson here?" },
            { speaker: 'Brain', text: "That's right! Notice how each round is more difficult? That's called progressive difficulty!", sources: ['diamond'] },
            { speaker: 'Inner Voice', text: "I see. So the more I learn, the more I can handle? Well then, bring it!" },
        ],
    },
    roundFourFinished: {
        title: 'Is that all you got?',
        lines: [
            { speaker: 'Inner Voice', text: "Let's go again! I can handle more than this!" },
            { speaker: 'Brain', text: "That's great, but you should know: \"people improve on what they practice, but only on what they practice.\"", sources: ['diamond2'] },
            { speaker: 'Inner Voice', text: "So what's the point of this?" },
            { speaker: 'Brain', text: "Exactly! The beatings will continue until morale improves." },
            { speaker: 'Inner Voice', text: "..." },
        ],
    },
    exercise: {
        title: 'Making room for movement',
        lines: [
            { speaker: 'Brain', text: 'We need to get moving. Fewer young teens met the fitness benchmark in one U.S. survey.', sources: ['gahche'], context: ['fryar'] },
            { speaker: 'Inner Voice', text: 'Ah, and physical fitness will help protect my brain. Send in the runner.', sources: ['diamond'] },
        ],
    },
    sleep: {
        title: 'One more round',
        lines: [
            { speaker: 'Inner Voice', text: 'One more round?' },
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
            { speaker: 'Inner Voice', text: 'One thing at a time, dear Brain...' },
        ],
    },
    ending: {
        title: 'Thy Brain Rotteth Not!',
        lines: [
            { speaker: 'Inner Voice', text: "It is finished. My executive functions." },
            { speaker: 'Brain', text: "I thrive, but you must know, \"Once practice ends, benefits diminish.\"", sources: ['diamond2'] },
            { speaker: 'Inner Voice', text: "Then, in order to have a rotless brain, you must transcend?" },
            { speaker: 'Brain', text: "Just change your habits. You are what you do." },
        ],
    },
} satisfies Record<string, Exchange>;

export type StoryId = keyof typeof STORY;
export const STORY_IDS = Object.keys(STORY) as StoryId[];
export const exchange = (id: StoryId): Exchange => STORY[id];

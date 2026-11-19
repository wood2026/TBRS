import { game } from '../engine.js';
import { exchange, STORY_IDS, type StoryId } from './rounds.js';
import { sourceNumber, SOURCE_IDS, SOURCES, type SourceId } from './sources.js';

type Panel = ReturnType<typeof game.ui.panel>;

const rowStyle = { fill: '#00000000', border: 0, bevel: 0, depth: 0, gloss: 0, shine: 0, shadow: 0 };
const readingStyle = { font: '18px sans-serif', textCase: 'none', textOutline: 0, textDepth: 0, textShadowY: 0 } as const;

function openModal(title: string, height: number) {
    const panel = game.ui.window({
        anchor: 'center', w: 1080, h: height, title,
        titleHeight: 48, layout: { padding: 18, gap: 8, align: 'stretch' },
    });
    const close = () => {
        game.ui.modal(panel, false);
        game.roster.kill(panel);
    };
    return { panel, close };
}

function sourceButton(parent: Panel, id: SourceId, line: string, label = 'Source') {
    game.ui.button({
        parent, id: 'story-source-' + id, h: 32, style: 'blue',
        text: label + ' [' + sourceNumber(id) + ']',
        accessibleLabel: line + ' ' + label + ' ' + sourceNumber(id) + ', ' + SOURCES[id].name,
        onClick: trigger => { trigger.ui.focused = true; showSource(id); },
    });
}

function showSource(id: SourceId) {
    const source = SOURCES[id];
    const { panel, close } = openModal('Source [' + sourceNumber(id) + '] · ' + source.name, 350);
    const value = source.note + '\n\n' + source.citation + '\n' + source.url;
    game.ui.textarea({
        parent: panel, h: 175, rows: 6, value, readOnly: true, style: readingStyle,
        accessibleLabel: 'Finding and full citation for ' + source.name,
    });
    const actions = game.ui.panel({ parent: panel, h: 42, style: rowStyle, layout: { direction: 'row', padding: 0, gap: 12 } });
    game.ui.button({
        parent: actions, h: 38, text: 'Open source',
        onClick: () => globalThis.open?.(source.url, '_blank', 'noopener,noreferrer'),
    });
    if ('study' in source) {
        game.ui.button({
            parent: actions, h: 38, text: 'Open underlying study',
            onClick: () => globalThis.open?.(source.study, '_blank', 'noopener,noreferrer'),
        });
    }
    const done = game.ui.button({ parent: actions, h: 38, text: 'Close source', onClick: close });
    game.ui.modal(panel);
    done.ui.focused = true;
}

export function addExchange(parent: Panel, id: StoryId): void {
    for (const line of exchange(id).lines) {
        const row = game.ui.panel({
            parent, h: 34, style: rowStyle, layout: { direction: 'row', padding: 0, gap: 6 },
        });
        const portrait = line.speaker === 'Brain' ? 'portrait-brain' : 'portrait-inner-voice';
        game.ui.label({ parent: row, w: 42, h: 32, icon: portrait, iconSize: 32 });
        const sourceCount = (line.sources?.length ?? 0) + (line.context?.length ?? 0);
        const text = line.speaker + ' · ' + line.text;
        game.ui.label({ parent: row, w: parent.ui.w - 100 - sourceCount * 112, h: 32, text, style: { ...readingStyle, textAlign: 'left' } });
        for (const source of line.sources ?? []) sourceButton(row, source, text);
        for (const source of line.context ?? []) sourceButton(row, source, text, 'Context');
    }
}

export function showExchange(id: StoryId): void {
    const { panel, close } = openModal(exchange(id).title, 256);
    addExchange(panel, id);
    const done = game.ui.button({ parent: panel, h: 38, text: 'Dismiss', onClick: close });
    game.ui.modal(panel);
    done.ui.focused = true;
}

export function showReferences(): void {
    const { panel, close } = openModal('References & Credits', 662);
    game.ui.label({ parent: panel, h: 36, text: 'Adapted from Thy Brain Rotteth Surely, an inquiry essay by Josh Wood.' });
    const columns = game.ui.panel({
        parent: panel, h: 440, style: rowStyle, layout: { direction: 'row', padding: 0, gap: 20, align: 'stretch' },
    });
    const bibliography = game.ui.panel({ parent: columns, w: 503, layout: { padding: 10, gap: 4, align: 'stretch' } });
    game.ui.label({ parent: bibliography, text: 'Works Cited', h: 32 });
    for (const id of SOURCE_IDS) {
        game.ui.button({
            parent: bibliography, h: 32, style: 'blue',
            text: '[' + sourceNumber(id) + '] ' + SOURCES[id].name,
            onClick: trigger => { trigger.ui.focused = true; showSource(id); },
        });
    }
    const dialogue = game.ui.panel({ parent: columns, w: 503, layout: { padding: 10, gap: 4, align: 'stretch' } });
    game.ui.label({ parent: dialogue, text: 'Reread the dialogue · contains story spoilers', h: 32 });
    for (const id of STORY_IDS) {
        game.ui.button({ parent: dialogue, h: 32, text: exchange(id).title, onClick: trigger => { trigger.ui.focused = true; showExchange(id); } });
    }
    game.ui.button({
        parent: panel, h: 42, text: 'Background music (CC0 1.0)', icon: 'cc0-badge', iconSize: 88,
        accessibleLabel: 'Background music, CC0 1.0 Universal. Open the Creative Commons deed.',
        onClick: () => globalThis.open?.('https://creativecommons.org/publicdomain/zero/1.0/', '_blank', 'noopener,noreferrer'),
    });
    const done = game.ui.button({ parent: panel, h: 38, text: 'Close references and credits', onClick: close });
    game.ui.modal(panel);
    done.ui.focused = true;
}

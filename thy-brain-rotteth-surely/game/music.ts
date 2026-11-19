import { game } from './engine.js';

const TRACKS = new Map([
    ['title', 'main_menu_track.mp3'],
    ['play', 'battle_track.ogg'],
    ['pause', 'battle_track.ogg'],
    ['gameover', 'upgrade_track.ogg'],
]);
const AUDIO_PATH = './assets/audio/';
const FADE_SECONDS = 0.45;
const MUTE_KEY = 'music-muted';

let muted = false;
let playing: string | undefined;
let gain = 0;

function updateVolume(): void {
    game.sound.volume('music', muted ? 0 : gain);
}

export function loadMusic() {
    return game.assets.load([...new Set(TRACKS.values())].map(track => ({
        kind: 'audio' as const, key: track, url: AUDIO_PATH + track, stream: true,
    })));
}

export function setupMusic(): void {
    muted = game.save.read(MUTE_KEY, false);
    updateVolume();
    let interacted = false;
    game.kernel.hooks.on('input.firstGesture', () => {
        interacted = true;
    });
    game.step('background-music', dt => {
        if (!interacted) return;
        const wanted = TRACKS.get(game.scenes.current);
        if (playing !== wanted) {
            gain = Math.max(0, gain - dt / FADE_SECONDS);
            if (gain === 0) {
                // Replacing a track with the default zero crossfade pauses it immediately.
                if (wanted) game.sound.music(AUDIO_PATH + wanted, { loop: true });
                else game.sound.stopMusic();
                playing = wanted;
            }
        } else if (playing) {
            gain = Math.min(1, gain + dt / FADE_SECONDS);
        }
        updateVolume();
    });
}

export function musicButton(): void {
    const caption = () => muted ? 'Music off' : 'Music on';
    const button = game.ui.button({
        id: 'music-toggle', anchor: 'top-right', x: -84, y: 16,
        w: 108, h: 42, text: caption(),
        onClick: () => {
            muted = !muted;
            game.save.write(MUTE_KEY, muted);
            updateVolume();
            button.ui.text = caption();
        },
    });
    game.step('music-toggle-state', () => {
        if (button.ui.text !== caption()) button.ui.text = caption();
    });
}

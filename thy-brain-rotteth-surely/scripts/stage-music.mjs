import { copyFileSync, mkdirSync } from 'node:fs';

const source = new URL('../public/assets/audio/', import.meta.url);
const destination = new URL('../game/assets/audio/', import.meta.url);
mkdirSync(destination, { recursive: true });
for (const track of ['main_menu_track.mp3', 'battle_track.ogg', 'upgrade_track.ogg']) {
    copyFileSync(new URL(track, source), new URL(track, destination));
}

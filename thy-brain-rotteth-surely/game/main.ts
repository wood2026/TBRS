import { loadProgress } from './progression/state.js';
// The game starts here. Its pictures are painted, the files the title screen shows load under the loading screen,
// the scenes are registered and the title begins; then the rest of the game loads quietly while the title is up.
// The game is READY (`game.ready`) once that has landed too.
// A new screen is a file in scenes/, registered below. The debug controls are added here too, before the first scene.
import { game } from './engine.js';
import { loadMusic, setupMusic } from './music.js';
import assets from './assets.json';
import prototypeArt from './prototype-assets.json';
import { paintArt } from './art.js';
import { installUiTheme } from './ui-theme.js';
import { addDebugControls } from './debug.js';
import { Title } from './scenes/Title.js';
import { Play } from './scenes/Play.js';
import { GameOver } from './scenes/GameOver.js';
import { Pause } from './scenes/Pause.js';

loadProgress(game.save.read('progression-v1', null), value => game.save.write('progression-v1', value));
paintArt();
installUiTheme();
await Promise.all([game.assets.load(assets, { pack: 'title' }), game.assets.load(prototypeArt), loadMusic()]);

game.scenes.register(Title);
game.scenes.register(Play);
game.scenes.register(GameOver);
game.scenes.register(Pause);
addDebugControls();
setupMusic();

await game.start();
game.scenes.go('title');

game.assets.load(assets, { pack: 'game' });


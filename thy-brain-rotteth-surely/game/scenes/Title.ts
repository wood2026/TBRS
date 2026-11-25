import { game } from '../engine.js';
import { musicButton } from '../music.js';
import { showReferences } from '../dialogue/references.js';
import assets from '../assets.json';
import { version } from '../../package.json';

/**
 * The title screen: the first thing the player sees.
 *
 * Usually the game's name (or its logo, if it has one), its title art and music, and the way in. The way in is
 * already here: the Play button, Space or Enter goes to 'play'. Add more buttons (levels, settings) the same way:
 * the skin's styles, an engine icon, and no width, so each fits its icon and caption.
 *
 * Everything this screen shows comes from the 'title' pack in assets.json, or is painted in art.ts. The 'game' pack
 * is still loading while the title is up, so the way in waits for it: it only waits if the player is quicker than
 * the download.
 *
 * A game that drops straight into play can delete this file and go to 'play' from main.ts.
 */
const NAME = 'Thy Brain Rotteth Surely';

/**
 * A title screen designed on phaser.io arrives as a file in the 'title' pack (`title-screen`). With the
 * `title-screen` pack composed, it plays exactly as designed (its art, motion, music and the way into play) and
 * this scene does nothing else. Without one, the plain way in below.
 */
interface TitlePlayer { play(file: unknown, options: { next: string; wait: () => unknown }): unknown }
const designed = (): TitlePlayer | null => {
    const player = (game as unknown as { titleScreen?: TitlePlayer }).titleScreen;
    return player && game.assets.has('title-screen') ? player : null;
};

export const Title = {
    name: 'title',
    enter(): void {
        musicButton();
        game.text(`v${version}`, game.screen.width - 28, game.screen.height - 28, {
            align: 'right', size: 18, color: '#f5e8ff', stroke: { color: '#151024', width: 4 },
        });
        const references = () => {
            game.ui.button({ anchor: 'bottom', y: -82, x: -240, h: 52, text: 'References & Credits', onClick: showReferences });
        };
        const player = designed();
        if (player) {
            player.play(game.assets.get('title-screen'), { next: 'play', wait: () => game.assets.load(assets, { pack: 'game' }) });
            references();
            return;
        }
        game.background.picture('title-background', 'cover');
        if (game.assets.has('logo')) {
            game.spawn({ id: 'title-logo', texture: 'logo', x: 398, y: 282, width: 594, layer: 'world' });
        } else {
            game.ui.label({ anchor: 'center', y: -110, w: 960, h: 96, text: NAME, style: 'heading' });
        }
        let starting = false;
        const start = (): void => {
            if (starting) return;
            starting = true;
            void game.assets.load(assets, { pack: 'game' }).then(() => game.scenes.go('gameover'));
        };
        game.ui.button({ anchor: 'center', y: 136, x: -240, h: 64, text: 'Progression', style: 'good', icon: 'play', onClick: start });
        references();
        game.step('title', () => {
            if (!game.ui.modalTop && !game.ui.focus && (game.input.keyPressed('Space') || game.input.keyPressed('Enter'))) start();
        });
    },
};


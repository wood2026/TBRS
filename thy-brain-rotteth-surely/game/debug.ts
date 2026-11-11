import { game } from './engine.js';
import { UPGRADES } from './progression/upgrades.js';
import { profile, saveProgress, type Profile } from './progression/state.js';
import { run } from './battle.js';

/**
 * The game's debug controls: the ways into it that playing would take minutes to reach (docs/make-a-2d-game.md and docs/00-kernel.md, Debug
 * controls). `bake play` runs them with `cheat`, and a person opens them with the backquote key (`) or `?cheats`.
 *
 * Add the game's own here: a jump to any level, a power-up, infinite lives, win or lose now. A jump starts the game
 * as a player would find it there, and an outcome goes through the game's own path, so what is checked is what a
 * player gets. main.ts adds them at boot, before the first scene, so they work from any screen. Run before the game
 * is ready (`game.ready`), a control waits for it by itself.
 *
 * Register the run's state here too, once the game keeps it in one object: `game.inspect.state(() => run)`. Every
 * inspection then reports it, so a reviewer's change request says "level 14, 1 life, score 8400" from the game itself.
 */
let testBackup:Profile|null=null;
export function addDebugControls(): void
{
    game.cheats.add({name:'test-snapshot',does:'Back up progression before a UI test',run:()=>{testBackup=JSON.parse(JSON.stringify(profile)) as Profile;return 'Progression snapshot stored';}});
    game.cheats.add({name:'test-tree',does:'Preview the expanded tree; restore after testing',run:()=>{
        if(!testBackup)testBackup=JSON.parse(JSON.stringify(profile)) as Profile;
        for(const u of UPGRADES)profile.levels[u.id]=1;
        profile.insight=500;profile.waves=20;profile.active=false;game.scenes.go('gameover');return 'Expanded tree preview';
    }});
    game.cheats.add({name:'test-restore',does:'Restore the progression snapshot',run:()=>{if(!testBackup)return 'No snapshot';Object.assign(profile,testBackup);saveProgress();testBackup=null;game.scenes.go('title');return 'Progression restored';}});
    game.inspect.state(() => ({ run, progression: profile, persistent: game.save.persistent }));
    game.cheats.add({
        name: 'screen',
        does: 'Go straight to a screen: title, play or gameover',
        args: 'name',
        run: name => { game.scenes.go(name ?? 'title'); return `screen ${name ?? 'title'}`; },
    });
}



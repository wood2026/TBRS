import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

if (!process.env.PHASER_AE_TOKEN) {
    throw new Error('Set the PHASER_AE_TOKEN repository Actions secret to download the Phaser AE engine and packs.');
}

const projectDir = fileURLToPath(new URL('../', import.meta.url));
const cliLib = new URL('../.phaser/ci/node_modules/@phaser-ae/cli/lib/', import.meta.url);
const { apiAccess, siteClient } = await import(new URL('site.mjs', cliLib));
const { installEngine } = await import(new URL('engine.mjs', cliLib));
const { installManifest, installed } = await import(new URL('packs.mjs', cliLib));

const lock = JSON.parse(readFileSync(new URL('../game/manifest.lock.json', import.meta.url), 'utf8'));
const access = await apiAccess(siteClient({ site: 'https://phaser.io' }));
const release = await installEngine(projectDir, access);
if (release.kernel !== lock.kernel) {
    throw new Error(`Phaser AE supplied kernel ${release.kernel}, but the game locks ${lock.kernel}.`);
}

await installManifest(access, projectDir);
const versions = new Map(installed(fileURLToPath(new URL('../game/', import.meta.url)))
    .map(({ id, version }) => [id, version]));
for (const [id, version] of Object.entries(lock.packs)) {
    if (versions.get(id) !== version) {
        throw new Error(`Phaser AE supplied ${id}@${versions.get(id) ?? 'missing'}, but the game locks ${version}.`);
    }
}

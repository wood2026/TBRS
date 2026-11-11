# Thy Brain Rotteth Surely

A portrait lane-defense game. You guard a weary Central Mind in a rainy neon village from waves of creeping anxieties by placing healthy cognitive wards, harvesting focus, mending cottages and unlocking a Journal of Clarity that tells the story of a return to calm.

## The game

- **Platform:** Mobile and desktop, portrait.
- **Screen:** Portrait first. On desktop the game sits centered, with a backdrop of brooding neon-gothic village architecture on either side.
- **Graphics:** 2D, 16-bit pixel art.
- **Kind:** Lane defense, with a narrative incremental layer (journal unlocks and lasting blessings) working inside it.
- **Audience:** Everyone. Nothing that isn't fine for a child.
- **Length:** Lots of levels that unlock in order. Progress saves itself.
- **Sound:** Music and sound effects.
- **Language:** English. Every word a player reads or hears is in English: the title, menus, buttons, HUD labels, tutorials, messages, journal entries and the names of characters, items and places. The brief names no font or text direction, so text is standard left-to-right English in a crisp pixel font.

## Decisions

1. **Number of levels.** The brief asks for lots of levels. The pages describe three mindscapes. The Level Select holds many levels, grouped in order into the three mindscapes (The Gloom Perimeter, Cobblestone Circuit, The Sanctuary Core). Each level is a sector of several waves.
2. **Lane shape.** Cobblestone Circuit's "curving dual avenues" would break the brief's straight march from right to left. All lanes stay straight and horizontal. The curves, crossroads and corner sockets in that mindscape are look and socket placement only.
3. **Touch controls.** The brief's general touch note mentions an on-screen joystick or d-pad with action buttons, but the brief also decided "tap screen directly to fire". Touch play is direct tapping, with no joystick. The only on-screen controls are the pause button, the mute button and the ward picker.
4. **"Left click / Tap anywhere" on several actions.** One tap or click does whatever fits what it lands on:
   - an empty socket deploys a ward;
   - a creep fires a blast;
   - an ember is harvested;
   - a cottage or ward during the rest is mended or strengthened;
   - the pause button pauses.
5. **Choosing which ward to place.** No control is listed for this. Selecting an empty socket opens a small interaction wheel showing the three wards, with one highlighted. Touch and mouse players tap or click a ward to pick it. Keyboard and gamepad players step through the wheel with the Switch Lane keys while it is open. Deploy places the highlighted ward.
6. **Upgrading wards.** The brief has defenders strengthened between waves, but no control for it. During the rest, the Mend action on a selected cottage repairs it, and the same action on a selected ward strengthens it.
7. **Focus and salvage.** The brief spends "leftover focus" between waves. The pages convert leftover focus into salvage. Both are kept as one flow: focus buys wards during waves, and at a wave's end any leftover focus becomes salvage, which is spent at the rest. Salvage scrap that creeps drop is collected like embers.
8. **Journal unlocks.** The page's twist has salvage funding journal revelations, but the brief unlocks journal thoughts by clearing consecutive waves. Journal pages unlock only by clearing consecutive waves. Salvage buys repairs and ward strength, not journal pages.
9. **Selling wards dropped.** The Logic Pylon's "sold for salvage refund" has no control and no screen. It is dropped.
10. **Logic Pylon against Static Phantom.** One page says the beam "pierces armored static" and another says the Static Phantom shields lighter creeps from beams. The beam pierces Echo Whispers and Doomscroller Spectres but is stopped by a Static Phantom. The Mindful Totem's pulse still reaches everything in its wave.
11. **What happens on a loss.** The pages variously return the player to the sanctuary, re-enter the sector, or retry at once. A loss shows the Gentle Failure Screen. Its retry restarts the lost wave with the field as it stood when that wave began. Journal pages are always kept.
12. **Cottages.** The pages leave the cottages' place vague. Each lane ends at a perimeter cottage just in front of the Mind. A creep that reaches the end of its lane strikes that cottage first. Only once the cottage is broken do creeps in that lane reach the Mind.
13. **Pause and Journal.** The control is "Pause and Journal", but the pages' pause menu has no journal. The pause menu gains a Journal button.
14. **Title screen audio.** "Adjust audio" on the title screen is the mute toggle, matching the brief's mute button.
15. **Optional polish.** Several polish lines describe a different game: siege shells, artillery, interceptors and bombs. Those words are dropped. Each line is kept only where it fits this game; see Optional polish below.
16. **Avatar movement on touch.** The Consciousness Spark is the cursor. On touch it jumps to wherever the player taps, and swiping up steps it to the next lane.

## The design

### What it is
A fixed field of parallel horizontal cobblestone lanes fills the portrait screen. The colossal Central Mind sits in its warm copper-domed sanctuary on the left edge. A perimeter cottage stands at the left end of each lane, in front of the Mind. Anxieties emerge from rainy cyber-fog on the right and march left along the lanes. Play is in real time.

### Core loop
1. **Watch** creeps approach in each lane.
2. **Deploy** wards into empty lane sockets, paying with focus.
3. **Fire** mindfulness blasts by tapping creeps directly, to help overstretched lanes.
4. **Harvest** focus embers and salvage scrap from fallen creeps.
5. **Rest** between waves. Leftover focus becomes salvage. Spend it to mend cottages, which also soothes the Mind's stress, and to strengthen wards. Read any newly unlocked journal page, then start the next wave when ready.

### Rules
**Placing wards**
- Selecting an empty socket with enough focus places the highlighted ward. It lands with a firm stone thud and a burst of soothing cyan runes.
- Selecting an occupied socket, or not having enough focus, makes the socket pulse dull amber with a soft muted chime. Nothing is spent.

**Wards and creeps**
- Wards attack automatically. Each targets the creep in range that is closest to the village end of its lane.
- Tapping a creep makes the Consciousness Spark fire a mindfulness blast. The blast deals instant damage and briefly staggers the creep. On keyboard and gamepad, Fire strikes the leading creep in the selected lane.
- A creep that reaches a ward stops and strikes it. Mindful Totems and Logic Pylons break quickly when struck. The Restful Ward is built to hold: it absorbs blows and slows nearby creeps with a soothing mist, until repeated blows crack and crumble it, leaving salvage fragments.

**Embers and scrap**
- A creep whose resilience runs out shatters into harmless pixel motes. It drops focus embers and sometimes salvage scrap.
- Embers drift gently toward the Spark.
- Touching or tapping an ember absorbs it with a resonant harp chime and fills the focus meter. On keyboard and gamepad, Harvest collects the embers in the selected lane.
- Embers left too long fade away.

**Cottages and the Mind**
- A creep reaching the end of its lane strikes that lane's cottage. When the cottage is broken, creeps in that lane go on to the Mind.
- A creep touching the Mind dissolves in a crackle of static. It adds stress fissures to the Mind, which sparks magenta, and the screen gives a gentle rumble.

**The rest**
- Clearing every creep in a wave starts the rest. The rest has no time pressure.
- Leftover focus converts to salvage, and the Journal Seal glows.
- Mending a cottage spends salvage. It rebuilds and reinforces the cottage and soothes the Mind's stress.
- Strengthening a ward spends salvage and raises that ward's power.

**The journal**
- Clearing consecutive waves without the Mind's stress reaching critical unlocks a new page of the Journal of Clarity.
- Pages are saved permanently.
- Completing a journal chapter grants a cognitive blessing: the Spark gathers focus more easily in later sectors.

### Win, lose, score
- **Win a level:** Dispel every wave in the sector. Dawn lights the mindscape, the sector's closing journal insight unlocks, and the next level opens.
- **Lose:** The Mind's stress gauge fills. The field softly dissolves into twilight mist and the Gentle Failure Screen appears. Its retry restarts the lost wave. Losing never costs journal pages.
- **Score:** The score reflects four things:
  - clarity milestones reached;
  - unbroken runs of calm lanes with no leaks;
  - cottage durability kept;
  - journal entries collected.
  
  The Sector Victory Screen shows these as calm performance commendations.

### Entities

**The Mind and the player**
- **Central Mind:** A colossal bioluminescent brain in a copper-domed sanctuary on the left edge, laced with fiber-optic roots and pulsing cyan synapses. Stress shows as visible fractures and urgent magenta sparks. It is never removed.
- **Consciousness Spark:** The player's avatar and cursor. A radiant mote of gold and white light trailing soft pixel embers. It glides between lanes, highlights sockets, aims blasts and sweeps up embers. It is always present.

**Wards**
- **Mindful Totem:** A carved wooden shrine bound with glowing neon vines and a hovering tuning crystal. It rhythmically pulses calming waves straight down its lane, damaging and soothing every creep the wave reaches. When broken it dissolves into soft petals.
- **Logic Pylon:** A slender obsidian spire with cool blue circuitry and revolving glass lenses. It fires straight geometric light beams that pierce through lighter creeps but are stopped by a Static Phantom. When broken it shatters.
- **Restful Ward:** A heavy cobblestone boundary altar with a glowing brass lantern and mossy timber barricades. It blocks creeps in its lane, absorbs their blows and gives off a lulling mist that strongly slows creeps nearby. Under repeated blows it cracks and crumbles, leaving salvage fragments.

**Creeps**
- **Echo Whispers:** Swarming clusters of translucent floating masks murmuring nagging doubts. They drift forward in dense, synchronized clouds. Each one is fragile, but together they overwhelm single-target defenses. Pulse waves clear them best. They scatter tiny focus sparks.
- **Doomscroller Spectre:** A twitching multi-legged shadow cloaked in flickering feed-glare and jagged neon static. It sprints forward in erratic bursts, trying to slip past slow-firing totems and unguarded lanes. It drops quick focus embers.
- **Static Phantom:** A towering, lumbering behemoth of compacted CRT static, iron wires and dread. It marches down the middle of its lane at an unstoppable pace, shielding lighter creeps behind it from beams. It collapses into harmless glowing static sparks and leaves rich focus and salvage.

**Pickups**
- **Focus Embers:** Shimmering crystalline orbs glowing golden. They float gently in the lane.
- **Salvage scrap:** Fragments dropped by creeps and crumbled Restful Wards. They are collected like embers.

**Village**
- **Perimeter cottages:** Mossy, thatched cyber-village cottages with neon signs, one at the village end of each lane. They show their wear as they take blows.

**HUD**
- **UI glyphs:** Crisp 16-bit neon emblems kept along the screen edges and in the interaction wheel:
  - Lane Sockets
  - Focus Flask (focus meter)
  - Mind Barometer (stress gauge)
  - Journal Seal
  - Salvage Hammer (salvage)

### Places
The levels are grouped into three mindscapes, in order. Lanes are always straight and horizontal. Within each mindscape the levels grow harder.

1. **The Gloom Perimeter**
   - **Look:** Distant neon haze through steady indigo rain. Mossy thatched cottages hung with damp fiber cables and flickering gaslights.
   - **Lanes:** Wide, straight alleys with long sightlines, giving plenty of time to react.
   - **Threats:** Small groups of Echo Whispers, with the odd lone Doomscroller Spectre.
2. **Cobblestone Circuit**
   - **Look:** Rambling village crossroads over worn paving and humming underground circuitry, with slanted timber gables and faded cyan shop signs.
   - **Lanes:** Sockets sit at street corners and chokepoints, inviting crossfire and barricades.
   - **Threats:** Fast packs of Doomscroller Spectres darting down the outer lanes to exploit gaps.
3. **The Sanctuary Core**
   - **Look:** A gothic cyber-cathedral courtyard in warm golden lantern light, with floating dream motes and stained glass open to a clear sky.
   - **Lanes:** Tightly packed parallel lanes flanking the Mind's pool, all needing cover at once.
   - **Threats:** Static Phantoms leading as shields, with dense Echo Whisper swarms behind them.

### Screens and flow
**Title → Level Select → Level (waves ⇄ Inter-Wave Rest) → Sector Victory or Gentle Failure → Level Select.**

- **Title Screen:** The pixel village resting under twilight rain, lanterns glowing, with a soft synth hum. Buttons:
  - Begin Journey (continues at the next open level)
  - Level Select
  - Journal of Clarity
  - Mute
  - Controls (input reference)
- **Level Select:** A branching neural constellation over an aerial village map. Cleared levels glow warm. Locked levels sleep in fog, and each level stays locked until the one before it is done. Tapping an open level shows its wave progression and the journal fragments found there, and starts it.
- **Inter-Wave Rest Screen:** A peaceful courtyard view as the rain softens to mist. Mend cottages, strengthen wards, read new journal pages, and start the next wave when ready.
- **Journal of Clarity Screen:** A leather-bound grimoire woven with fiber-optic ribbons and glowing illuminated pixel script. Flip through recovered entries and review unlocked cognitive blessings.
  - Early entries speak of digital overload, scattered focus and restless exhaustion.
  - Later entries speak of grounding, deliberate quiet and restored presence.
- **Pause menu:** Opened by the on-screen pause button. A translucent frosted-parchment overlay that stops all action. Options:
  - Resume
  - Journal
  - Mute (one press, remembered next time)
  - Controls reference
  - Restart Wave
  - Retreat to Level Select
- **Gentle Failure Screen:** Titled "A Moment of Respite". A soft twilight vignette with a calming reflection and a soothing chime. It shows the focus harvested this attempt, confirms the journal pages are kept, and offers an immediate, penalty-free retry.
- **Sector Victory Screen:** Dawn breaks over the cobblestones, burning away the fog and lighting the mended cottages gold. It shows the sector's closing journal thought and the calm performance commendations, unlocks the next level, and invites another go.

Progress saves itself after every wave and level: open levels, journal pages, blessings and the mute setting. Closing the game and returning picks up where the player left off.

### Controls
| Action | Desktop | Mobile | Gamepad |
| --- | --- | --- | --- |
| Deploy Ward | Enter / left click an empty socket | Tap an empty socket | A |
| Fire (mindfulness blast) | F / left click a creep | Tap a creep | RT |
| Switch Lane (and step through the ward wheel when open) | Arrow Up / Down, W / S, or mouse move | Swipe up, or tap a lane | D-pad |
| Harvest Focus | E / left click an ember | Tap an ember (embers also drift to the Spark) | X |
| Mend (repair a cottage or strengthen a ward, at the rest only) | R / left click | Tap the cottage or ward | Y |
| Pause and Journal | Escape / P / click the pause button | Tap the pause button | Start |

- Touch taps act instantly, with no dead zone, so placing a ward feels immediate.
- Keyboard and gamepad cycle quickly between lanes.
- On-screen buttons (pause, mute, ward picker) appear only on touch screens. On desktop the same buttons are clicked.
- A gamepad works if one is plugged in.

### How a new player learns
The first level of The Gloom Perimeter is the tutorial, a short first go that teaches by doing, with one short prompt at a time:
1. Place a Mindful Totem in a lane as the first Echo Whispers drift in.
2. Tap a creep to fire a blast.
3. Collect the embers it drops.
4. At the first rest, mend a damaged cottage and start the next wave.

Each prompt waits until the player has done it. The Logic Pylon and Restful Ward are introduced in the following levels when their threats first appear.

### Optional polish (only once everything above works)
- Mindfulness blasts expand into bright pulsing rings of neon light.
- The screen gently shakes when a Static Phantom collapses.
- Cottage neon signs flicker and spark when struck by creeps.
- The Spark leaves shimmering trails of colored pixel smoke.
- Shattered creeps scatter harmless glowing sparks that fade into the dark.
- The amount of salvage gained pops up in bright green above fallen creeps.

## Difficulty & Feel

### Targets
- A newcomer who places a ward in every active lane finishes the early waves comfortably, with the Mind barely stressed.
- A careless player who clusters only Mindful Totems and ignores ward variety starts taking Mind stress once Doomscroller Spectres and Echo Whisper swarms arrive together.
- A player who hoards salvage instead of mending cottages risks a sudden breach in the heavy multi-lane assaults.
- Panic-spending focus on redundant wards leaves a player empty-handed when a Static Phantom marches into an open lane.
- A good player gathers embers actively and taps blasts to help strained lanes. They clear whole sectors with the Mind serene, coming close to a leak only in the late multi-lane waves.

### What gets harder
Challenge grows through enemy combinations, how threats spread across lanes, and rhythm, not through inflated creep strength.
- **Early waves:** Single-lane, predictable marches of fragile Echo Whispers. This is room to experiment with placement and timing.
- **Mid waves:** Fast Doomscroller Spectres demand quick reactions and Restful Wards. Clustered Echo Whisper swarms test pulse coverage.
- **Late waves:** Static Phantoms march down the main lanes while Doomscroller Spectres try to slip through unguarded side lanes.
- **Rests:** Calm breathing room with no time pressure, for repairs and reading.

### Comeback tools
- **Mindfulness blasts:** Stall threats when wards are stretched thin.
- **Layering:** A Restful Ward placed ahead of a Logic Pylon holds creeps inside the beam's path.
- **Mended cottages:** They absorb stray creeps before those creeps stress the Mind.
- **Gentle retry:** It keeps every journal page and blessing.

## The look

- **Style:** 16-bit pixel art. A cyberpunk dark-fantasy village where neon meets thatch, cobblestone and gothic stone.
- **Palette:**
  - Indigo rain and night fog.
  - Neon cyan and blue for wards and calm.
  - Magenta for stress and anxieties.
  - Gold and white for the Spark and embers.
  - Copper and brass, with warm lantern amber.
  - Dawn gold for victory.
- **Key words:** rain-soaked, neon-gothic, weary then restored, calm, glowing, gentle.

---

## A prototype

This build is a prototype: the design's whole game, playable from the title to the win and lose screens, made quickly to find out whether it is fun. No art, sounds or music were made for it. `assets.json` loads nothing and the contact sheet is blank: everything the game shows and plays is made in code, with the engine, by this build. Wherever the briefs speak of the art, the art is what you draw.

![Concept art](https://cdn.phaser.games/projects/46TiNwHL3mc/concept/bedf765d282db08f.jpg) (reference picture: look at it, it is not a game asset)

The concept art: one picture of how the game could look in play. Open it before you plan. Use it for the look, the layout and how much is on screen; the design decides what is in the game.

- **The look.** Draw the game the way The look describes and the concept art shows: its palette, its shapes, its mood. Keep one style throughout. Give every entity a clear silhouette and a color of its own, so a player tells everything apart at a glance, at phone size.
- **Pictures.** Paint each entity, tile, background, button and panel once, as the game starts, with `game.paint(name, width, height, ctx => …)` and the Canvas 2D API (an animation is `{ frames }`, drawn with `(ctx, i)`); a sprite shows it with `texture: name`, at its size. Name each picture for what it is (`player`, `enemy-bat`, `tile-grass`, `button-play`), as a full build's Assets section names its files: when real art is made later, it replaces your pictures by those names. `game.background` gives a scene its color, gradient or stars; `game.graphics()` draws what changes while the game runs (trails, glows, meters).
- **Words.** The title and every word on screen are `game.text`, with a stroke or shadow where they sit over the scene. The title screen is the game's name over a scene drawn like the rest of the game.
- **Effects.** `game.particles` (its shapes are `particle:spark`, `particle:soft` and more, or your own pictures), `game.tween` and `game.feel` add the juice the guides ask for.
- **Sound.** Define every sound effect by name as a synthesized sound with `game.sound.defineAll`, and play it by name. Where the design has music, it is a short chiptune in the audio pack's notation, played with `game.sound.loop`.
- **What stays whole.** Everything in the design above: every rule, entity, level, screen and control. A prototype is plain in its art, never in its game.

---

## Debug controls

These controls let the team and the designer reach any level, wave, screen or state of the game at once, without playing up to it.

| Control | Takes | Does |
| --- | --- | --- |
| level | n: a level number from the Level Select (the mindscape follows from the level) | Starts that level at its first wave as a player would find it. Every earlier level counts as cleared and open, the journal pages and blessings a player would have by then are unlocked, and the Mind's stress, cottages and wards start fresh. |
| wave | n: a wave number within the current level | Jumps to that wave of the current level as a player would reach it. The earlier waves count as cleared, the journal pages for them are unlocked, and the cottages, wards, focus and salvage are as they would normally be at that point. |
| rest | nothing | Ends the current wave the way the game does, with leftover focus converted to salvage, and opens the Inter-Wave Rest Screen. |
| screen | name: title, level-select, journal, victory or failure | Goes to that screen. Victory and failure show the screen with the current level's results, as if the level had been won or lost. |
| give | item: focus, salvage, totem, pylon or ward-upgrade | Gives the item at once. Focus and salvage fill their meters. A ward (totem or pylon) is placed in the selected empty socket, or the Restful Ward when the item is restful-ward. Ward-upgrade strengthens the selected ward as Mend would. |
| heal | target: mind or cottages | Mind soothes the Mind's stress gauge to empty. Cottages mends every cottage in full. |
| spawn | creep: echo-whispers, doomscroller or static-phantom | Sends that creep down the selected lane at once, to test wards and the creeps' behavior. |
| infinite-focus | on or off | Switch. Wards cost no focus while on. |
| invincible | on or off | Switch. Creeps that reach the cottages or the Mind add no stress and break nothing. |
| unlock-all | nothing | Opens every level on the Level Select and unlocks every journal page and blessing. |
| slow-motion | on or off | Switch. Runs the game at a slower speed so the creeps' movement and the wards' attacks can be watched. |
| win-level | nothing | Wins the current level through the game's own path: dawn, the closing journal insight, the commendations on the Sector Victory Screen, the score and sounds, and the next level opens. |
| lose-level | nothing | Fills the Mind's stress gauge through the game's own path, with the twilight dissolve, the Gentle Failure Screen and its retry, and journal pages kept. |

In the engine each is added once at boot with `game.cheats.add({ name, does, args, run })` (the kernel manual says how); `bake play` lists them with `cheat` and runs one with `cheat <name> [args]`; a person opens them in a panel with the backquote key (`), or with `?cheats` in the address.

---

## Recommended packs

| Pack | For | Notes |
|---|---|---|
| `wave-plan` | The waves in each sector: what creeps arrive, in which lane and when. Also the difficulty curve across the three mindscapes and the "dispel every wave" win goal. | No lane-defense core pack turned up, so this is the nearest fit. The design's own code must still handle the lanes, sockets, wards, creeps, cottages and the Mind's stress. Write the wave tables as data. Make difficulty come from creep combinations and lane spread, not from creep strength. |
| `bars` | The Focus Flask (focus meter) and the Mind Barometer (stress gauge). It could also show cottage durability. | Needs `typography`, which is already present. The pixel styling and the magenta stress colour are left to the game. |
| `controls-2d` | The intents Deploy, Fire, Switch Lane, Harvest, Mend and Pause, across keyboard and gamepad, with the ward wheel stepping on Switch Lane. | Mouse and touch taps on sockets, creeps, embers and cottages go through the already-present `pointer`. This pack only covers the key and gamepad intents. |
| `controls-touch` | The touch-only pause, mute and ward-picker buttons. | The design says no joystick, so use only buttons and never the thumb stick. Show them only on touch screens. |

From a search of the pack library for this design, made before the build: recommendations for the lead, who checks each (`packs.mjs get <id>`), chooses, and adds what fits. A pack that doesn't fit the game is left out. `core-2d` and the packs it brings (maths, color, typography, audio, ui, tween, save, backdrops, backdrop-sky, backdrop-stars, feel, render-auto, world-screen, world-side, rig-follow, render-texture, particle-textures, particles-2d, collision, pointer) are in the game already.
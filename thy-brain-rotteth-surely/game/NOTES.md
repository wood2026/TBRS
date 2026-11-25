# Progression and combat prototype

## Controls / progression
- Five story rounds with four automatic waves each; wins advance, losses retry through the upgrade tree.
- Focus is attempt-only; Insight and all unlocked nodes persist via localStorage (progression-v1).
- Keys 1..5 recruit Reading, Exercise, Sleep, Social Connection, Mindfulness when unlocked.
- B also recruits Reading. Click a defender to inspect; P/Escape pauses.
- Music on/off is at the upper right. The preference persists and playback starts after the first interaction.
- Upgrades use Insight only on the tree screen; repeat levels cost more. Unit unlocks are one-time.
- Tree: wheel, Up/Down or drag scrolls. Click a node, then Purchase upgrade when offered.
- Silver outlines mark owned upgrades, gold marks max rank, and cyan brackets mark selection.
- Green icon glow marks affordable upgrades. Locks and dashed links mark unmet requirements.
- A rank of 0/∞ indicates an uncapped repeatable upgrade. Its bar displays ten ranks at a time.
- Only the root is visible initially; purchases reveal connected branches.
- Reset save requires two clicks and affects progression only. Older saves receive zero levels for new nodes.

## Prototype art
- The 1280 × 720 forest, crossroads, archive, cloister and sanctuary backgrounds leave room for a separate Brain sprite.
- At 75%, 50% and 25% remaining health, the battlefield Brain and HUD change artwork. At zero health, the ruined sprite appears.
- Existing unit sprites bob while moving, lunge on attacks and recoil on hits. The Brain flashes briefly when damaged.
- The thumbnail and favicon files are in prototype-art for packaging or hosting.

## Story and sources
- A convenient suspect, First distraction and Recruiting Reading play together before the first battle.
  Existing saves see the complete opening once. The first defeat plays once per save before the upgrade screen.
- The visual novel dialogue box shows one line and the active speaker's large portrait. Click Next or Continue,
  or press Enter when the button has focus.
- Each campaign victory plays its exchange before the results screen. Round 5 plays the ending with the zen portraits.
- The upgrade screen carries the first movement/sleep purchases and Social Connection and Mindfulness unlocks.
  First-time dialogue is tracked in progression-v1.
- Tab to a Source button and press Enter, or click/tap it. A source opened in play holds combat until closed.
- Title > References & Credits includes eleven full citations, the complete dialogue and the CC0 music credit.
- dialogue/rounds.ts holds the exchanges, sources.ts holds citation records, panel.ts sequences unseen exchanges,
  and references.ts renders dialogue, source notes and the bibliography.

## Brain attacks and roles
- Enemies reaching the brain remain alive and attack with their own damage and attack interval.
- Seven offset approach positions plus separation spread attackers. Brain attackers have red rings.
- Defenders prioritize brain attackers even outside normal detection radius and rush back to intercept.
- Reading: baseline melee damage. Exercise: fast pursuit sprint, including emergency interception.
- Sleep: durable healer for nearby living allies. Social: nearby non-stacking damage aura.
- Mindfulness: area damage and a longer slow pulse. Masteries improve all instances of their unit type.
- Enemies remain targetable during siege; killing them stops their attacks and awards Focus/Insight normally.

## Tunable modules
- combat/config.ts: enemy base stats, AI profiles, threat, slow, spacing, brain attack radius.
- combat/defenders.ts: defender prices/stats/colors/roles and ability parameters.
- combat/waves.ts: five round difficulty multipliers, four wave counts, composition, cadence and scaling.
- progression/upgrades.ts: 16 nodes, costs/growth, prerequisites, milestones, one-time caps, icons and graph positions.
  More nodes need data plus an effect handler; the clipped scrolling viewport has no hardcoded node count/page cap.
- progression/currency.ts: attempt resources and currency payouts.
- progression/state.ts: save validation/migration, purchases, attempt settlements and permanent progression.
- combat/units.ts: movement, melee, brain approach positions, role abilities and separation.
- music.ts: screen tracks, sequential fades and the saved music preference.
- battle.ts: live purchases, upgraded stats, timed waves, brain damage, rewards and outcomes.
- scenes/GameOver.ts: upgrade tree and detail panel. scenes/Play.ts: combat UI.

## Balance evidence
- Round difficulty: 2.15 / 3.4 / 4.5 / 5.8 / 7.2. Repeat upgrade cost growth: 1.35.
- tests/campaign-balance.ts runs four deterministic earned-currency strategies (one recruitment decision/sec):
  offense-first 6 attempts; defense-first 8; mixed frontline 6; specialist-unlock-first 10.
- All lose naturally in round one before upgrading; some lose later as well. No forced attempt count.
- These are playtest baselines, not guarantees for every strategy, reaction time or team composition.
- tests/campaign-simulation.ts contains the actual purchase priorities and recruitment choices.

## Verification
- npm test covers campaign strategies, all rounds/endless, retries, saves, new-node migration, unlock caps,
  global/unit-specific effects, brain siege persistence/cadence, emergency targeting, attacker separation,
  healing, non-stacking buffs, area slowing/damage, and retained enemy behavior tests.
- Browser: real defeat -> Insight -> root purchase -> branch reveal; tree keyboard/drag scroll;
  selected mastery purchase; unlocked-role buttons and combat rendering.
- Preview tests snapshot and restore progression; user progression is not left with test grants.
- Debug: infinite-resources on/off grants free recruitment and purchases during this session.
  Purchases and battle progression still save. Use test-snapshot and test-restore to roll back testing.
- Debug: test-tree (expanded tree preview), screen and inspect.
- npm run -s smoke -- --seconds 30 checks browser runtime; npm run -s serve opens localhost:4173.

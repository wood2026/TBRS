# Incremental progression prototype

## Loop
- Five story rounds; every attempt contains four escalating waves in the current round.
- Waves start automatically. B / Recruit spends Focus during combat. Click units to inspect them.
- Wins and losses open the permanent-upgrade screen. Win: next round. Loss: repeat current round.
- Finishing round five closes the story. Continue beyond story starts optional harder rounds.
- Focus resets every attempt. Insight and upgrades persist in localStorage through the engine save adapter.
- Insight is banked immediately: kills, cleared waves, victory and every eight seconds of combat.
- Even a no-kill loss earns Insight. Interrupted attempts keep banked Insight and retry the same round.
- Only Deliberate practice is visible initially. Buying it opens branches. Repeat purchases cost more.
- Advanced branches show prerequisites and cumulative wave milestones. No permanent purchases in combat.
- Recovery heals the brain and surviving defenders after a wave. New attempts restore brain health.
- New attempts replace the defender roster. Focus never buys permanent upgrades.
- P/Escape pauses. End attempt exits through the upgrade screen, keeping earned Insight.
- Reset save requires two clicks on the upgrade screen. It clears only progression, not other site storage.

## Tuning / modules
- combat/config.ts: unit stats, AI behaviors, threat, slowing, interception, team size and brain damage.
- combat/waves.ts: five round difficulty multipliers, four wave counts, composition and spawn cadence.
- progression/currency.ts: starting Focus, recruit cost, kill rewards and Insight calculations.
- progression/upgrades.ts: seven upgrade definitions, effect descriptions, prices and prerequisites.
- progression/state.ts: versioned save validation, upgrades, progression and interrupted-attempt recovery.
- battle.ts: application of upgrade effects, wave recovery, currencies and combat outcomes.
- scenes/GameOver.ts: paginated upgrade screen, levels/effects/costs/prerequisites and reset control.
- dialogue/rounds.ts: five editable narrative introductions; dialogue never blocks automatic combat.
- main.ts: game.save localStorage adapter, key progression-v1 in the game's namespace.
- Storage errors degrade to session memory and display a warning on the upgrade screen.

## Verification
- npm test: unlocks, repeat costs, milestone locks, currency separation, failure/retry, interrupted saves,
  all five four-wave rounds, story completion, endless play, upgrade effects, recovery and retained AI tests.
- tests/balance.ts compares base and upgraded builds across every story round.
- tests/campaign-balance.ts buys upgrades only with earned Insight until the story is complete.
- Current simple cheapest-upgrade/recruit-as-affordable strategy completes in 31 attempts (26 losses).
  This is initial balance evidence, not a claim that every strategy takes this long; tune after playtesting.
- Browser: no-defense loss returned to upgrades with +7 Insight, same round; retry reset Focus.
- Purchased damage and attack upgrades survived actual browser restart.
- Browser four-wave victory returned to upgrades with +66 Insight and round two unlocked.
- Reset, malformed saves and idempotent settlement are covered by regression tests.
- Debug screen command remains available; inspect includes run state, profile and storage status.
- npm run -s serve: http://localhost:4173/. Placeholder graphics only, no paid assets.

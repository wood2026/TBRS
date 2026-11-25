// Currency tuning: Focus is attempt-only. Insight is banked immediately.
export const CURRENCY = { startingFocus:80, recruit:40, focusPerKill:20, insightPerKill:1,
 insightPerWave:4, insightPerVictory:12, progressSeconds:8, insightPerProgress:1 };
export const startingFocus = (level:number):number => CURRENCY.startingFocus + level * 20;
export const focusReward = (level:number):number => Math.round(CURRENCY.focusPerKill * (1 + level * 0.2));

export const resourceDebug = { infinite: false };

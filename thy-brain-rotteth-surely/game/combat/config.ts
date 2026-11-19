// All distances are logical pixels; durations are seconds; attackSpeed is attacks/second.
export type Behavior = 'aggressive' | 'opportunistic' | 'evasive' | 'relentless';
export type Stats = { speed: number; range: number; attackSpeed: number; maxHp: number; damage: number; aggro: number };
export const READING: Stats = { speed: 140, range: 43, attackSpeed: 1.4, maxHp: 150, damage: 18, aggro: 650 };
export const ENEMY_STATS: Stats = { speed: 88, range: 38, attackSpeed: 0.8, maxHp: 62, damage: 9, aggro: 180 };
export const AI = {
    threatPerDamage: 1, threatDecay: 16, threatLifetime: 3, maxThreat: 80,
    slowDuration: 0.65, interceptionLead: 0.3, defenderRetarget: 0.45,
    separationDistance: 32, separationSpeed: 65, routeSpread: 85,
};
export const BEHAVIORS = {
    aggressive: { speed: 0.9, seek: 300, threshold: 0, engage: 3, resolve: 2.5, slow: 0.55, avoid: 0, color: '#ed6b75' },
    opportunistic: { speed: 1, seek: 68, threshold: 12, engage: 1.3, resolve: 3, slow: 0.65, avoid: 0.15, color: '#f1b35b' },
    evasive: { speed: 1.18, seek: 0, threshold: 60, engage: 0.35, resolve: 4, slow: 0.75, avoid: 1.1, color: '#b08aef' },
    relentless: { speed: 0.95, seek: 0, threshold: 100, engage: 0.2, resolve: 5, slow: 0.85, avoid: 0.2, color: '#6faee8' },
} satisfies Record<Behavior, { speed: number; seek: number; threshold: number; engage: number; resolve: number; slow: number; avoid: number; color: string }>;
export const ECONOMY = { capacity: 12 };
export const BATTLE = { brainAttackRange: 28, brainHealth: 100, leakDamage: 20, firstSpawnDelay: 0.8, roundDelay: 2.5,
    brain: { x: 190, y: 316 }, breachRadius: 28 };




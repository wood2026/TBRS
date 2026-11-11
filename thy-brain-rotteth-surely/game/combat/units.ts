import { READING, ENEMY_STATS, BEHAVIORS, AI, BATTLE, type Stats, type Behavior } from './config.js';
export { READING } from './config.js';
export type Unit = Stats & {
    id: number; kind: 'reading' | 'distraction'; behavior: Behavior; x: number; y: number; vx: number; vy: number;
    hp: number; cooldown: number; flash: number; targetId: number | null; level: number;
    threats: Record<number, { value: number; ttl: number }>; slow: number; engagement: number; resolve: number;
    retarget: number; route: number; intent: 'brain' | 'engage' | 'evade' | 'intercept' | 'idle';
};
export function createUnit(id: number, kind: Unit['kind'], x: number, y: number, behavior: Behavior = 'opportunistic'): Unit {
    const stats = kind === 'reading' ? READING : ENEMY_STATS;
    return { ...stats, speed: stats.speed * (kind === 'reading' ? 1 : BEHAVIORS[behavior].speed), id, kind, behavior,
        x, y, vx: 0, vy: 0, hp: stats.maxHp, cooldown: 0, flash: 0, targetId: null, level: 1,
        threats: {}, slow: 0, engagement: 0, resolve: 0, retarget: 0,
        route: ((id * 47) % 101 - 50) / 50, intent: 'idle' };
}
export const distance = (a: {x: number; y: number}, b: {x: number; y: number}): number => Math.hypot(a.x - b.x, a.y - b.y);
export function moveToward(unit: Unit, target: {x: number; y: number}, dt: number, stop = 0): void {
    const d = distance(unit, target);
    if (d <= stop) return;
    const speed = unit.speed * (unit.slow > 0 ? BEHAVIORS[unit.behavior].slow : 1);
    const step = Math.min(speed * dt, d - stop);
    unit.x += (target.x - unit.x) / d * step; unit.y += (target.y - unit.y) / d * step;
}
export function hit(attacker: Unit, target: Unit): void {
    target.hp -= attacker.damage; target.flash = 0.18; attacker.cooldown = 1 / attacker.attackSpeed;
    if (target.kind === 'distraction') {
        const prior = target.threats[attacker.id]?.value ?? 0;
        target.threats[attacker.id] = { value: Math.min(AI.maxThreat, prior + attacker.damage * AI.threatPerDamage), ttl: AI.threatLifetime };
        target.slow = AI.slowDuration;
    }
}
function brainward(unit: Unit, opponents: Unit[], dt: number): void {
    const profile = BEHAVIORS[unit.behavior];
    const remaining = Math.min(1, Math.max(0, (unit.x - 250) / 650));
    const goal = { x: BATTLE.brain.x, y: BATTLE.brain.y + unit.route * AI.routeSpread * remaining };
    // Sidestep defenders ahead; keep a leftward component and never teleport.
    let avoidance = 0;
    for (const defender of opponents) {
        const d = distance(unit, defender);
        if (defender.hp > 0 && defender.x < unit.x + 25 && d < 125) {
            const side = unit.y < defender.y ? -1 : unit.y > defender.y ? 1 : unit.route >= 0 ? 1 : -1;
            avoidance += side * (125 - d) * profile.avoid;
        }
    }
    goal.y = Math.max(155, Math.min(465, goal.y + avoidance * 3));
    // Use a local waypoint so evasive units visibly skirt the obstacle.
    if (Math.abs(avoidance) > 8 && unit.x > 330) goal.x = unit.x - 100;
    moveToward(unit, goal, dt);
}
export function act(unit: Unit, opponents: Unit[], dt: number): void {
    if (unit.hp <= 0) return;
    const oldX = unit.x, oldY = unit.y;
    unit.cooldown = Math.max(0, unit.cooldown - dt); unit.flash = Math.max(0, unit.flash - dt);
    unit.slow = Math.max(0, unit.slow - dt); unit.resolve = Math.max(0, unit.resolve - dt);
    for (const [id, threat] of Object.entries(unit.threats)) {
        threat.ttl -= dt; threat.value = Math.max(0, threat.value - AI.threatDecay * dt);
        if (threat.ttl <= 0 || threat.value <= 0 || !opponents.some(d => d.id === Number(id) && d.hp > 0)) delete unit.threats[Number(id)];
    }
    const live = opponents.filter(other => other.hp > 0);
    let target = live.find(other => other.id === unit.targetId);
    if (unit.kind === 'reading') {
        unit.retarget -= dt;
        if (!target || distance(unit, target) > unit.aggro || unit.retarget <= 0) {
            // Prefer reachable enemies that are closer to the brain, rather than chasing a distant decoy forever.
            target = live.filter(other => distance(unit, other) <= unit.aggro)
                .sort((a,b) => (distance(unit,a) + a.x * 0.2) - (distance(unit,b) + b.x * 0.2))[0];
            unit.retarget = AI.defenderRetarget;
        }
        unit.intent = target ? 'intercept' : 'idle';
        if (target) {
            const goal = distance(unit,target) <= unit.range + 12 ? target : {
                x: target.x + target.vx * AI.interceptionLead, y: target.y + target.vy * AI.interceptionLead };
            moveToward(unit, goal, dt, unit.range - 4);
        }
    } else {
        const profile = BEHAVIORS[unit.behavior];
        if (unit.engagement > 0) {
            unit.engagement = Math.max(0, unit.engagement - dt);
            if (!target || distance(unit,target) > Math.max(unit.aggro, profile.seek) || unit.engagement === 0) {
                unit.engagement = 0; unit.resolve = profile.resolve; target = undefined;
            }
        } else target = undefined;
        if (!target && unit.resolve <= 0) {
            target = live.filter(other => distance(unit,other) <= unit.aggro &&
                (distance(unit,other) <= profile.seek || (unit.threats[other.id]?.value ?? 0) >= profile.threshold))
                .sort((a,b) => ((unit.threats[b.id]?.value ?? 0) - distance(unit,b) * 0.1) - ((unit.threats[a.id]?.value ?? 0) - distance(unit,a) * 0.1))[0];
            // Aggressive enemies have a wider search radius than other profiles.
            if (!target && unit.behavior === 'aggressive') target = live.filter(o => distance(unit,o) <= profile.seek).sort((a,b) => distance(unit,a)-distance(unit,b))[0];
            if (target) unit.engagement = profile.engage;
        }
        unit.intent = target ? 'engage' : unit.behavior === 'evasive' ? 'evade' : 'brain';
        if (target) moveToward(unit, target, dt, unit.range - 2);
        else brainward(unit, live, dt);
    }
    unit.targetId = target?.id ?? null;
    // Enemies can strike as they pass without abandoning their brainward movement.
    const contact = target ?? (unit.kind === 'distraction' ? live.find(o => distance(unit,o) <= unit.range) : undefined);
    if (contact && distance(unit, contact) <= unit.range && unit.cooldown <= 0) hit(unit, contact);
    unit.vx = (unit.x - oldX) / dt; unit.vy = (unit.y - oldY) / dt;
}
export function separate(units: Unit[], dt: number): void {
    for (let i = 0; i < units.length; i++) for (let j = i + 1; j < units.length; j++) {
        const a = units[i], b = units[j];
        let dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
        if (d >= AI.separationDistance) continue;
        if (d < 0.001) { dx = (a.id % 2 ? 1 : -1); dy = 0.5; d = Math.hypot(dx, dy); }
        const push = Math.min((AI.separationDistance - d) / 2, AI.separationSpeed * dt);
        a.x -= dx / d * push; a.y -= dy / d * push; b.x += dx / d * push; b.y += dy / d * push;
    }
    for (const unit of units) { unit.x = Math.max(205, Math.min(1200, unit.x)); unit.y = Math.max(146, Math.min(478, unit.y)); }
}


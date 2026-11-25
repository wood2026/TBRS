import { focusReward, startingFocus } from './currency.js';
import type { Upgrade } from './upgrades.js';

export function rankBenefit(upgrade: Upgrade, rank: number): string {
    if (rank === 0) return upgrade.max === 1 ? 'Defender locked' : 'No bonus yet';
    if (upgrade.max === 1) return upgrade.effect;

    switch (upgrade.id) {
        case 'damage': return `+${25 * rank}% defender damage`;
        case 'attack': return `+${15 * rank}% defender attack speed`;
        case 'movement': return `+${10 * rank}% defender movement speed`;
        case 'brain': return `+${25 * rank} brain health`;
        case 'income': return `${focusReward(rank)} Focus per enemy defeated`;
        case 'resources': return `${startingFocus(rank)} starting Focus`;
        case 'recovery': return `Up to ${8 * rank} brain HP and ${10 * rank}% defender HP restored between waves`;
        case 'sleep_mastery': return `+${2 * rank} HP/s healing and +${15 * rank}% Sleep damage and health`;
        case 'social_mastery': return `+${8 * rank} percentage points of aura damage and +${15 * rank}% Social damage and health`;
        case 'mindfulness_mastery': return `+${(rank / 5).toFixed(1)} s pulse slow and +${15 * rank}% Mindfulness damage and health`;
        case 'reading_mastery': return `+${15 * rank}% Reading damage and health`;
        case 'exercise_mastery': return `+${15 * rank}% Exercise damage and health`;
        default: return upgrade.effect;
    }
}

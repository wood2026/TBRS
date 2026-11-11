export type UpgradeId = 'damage' | 'attack' | 'movement' | 'brain' | 'recovery' | 'income' | 'resources';
export type Upgrade = { id: UpgradeId; name: string; base: number; growth: number; effect: string; parent?: UpgradeId; required: number; waves: number };
export const UPGRADES: Upgrade[] = [
 {id:'damage',name:'Deliberate practice',base:8,growth:1.45,effect:'+25% defender damage / level',required:0,waves:0},
 {id:'attack',name:'Steady rhythm',base:12,growth:1.5,effect:'+15% attack speed / level',parent:'damage',required:1,waves:0},
 {id:'movement',name:'Daily movement',base:10,growth:1.45,effect:'+10% movement speed / level',parent:'damage',required:1,waves:0},
 {id:'brain',name:'Mental resilience',base:10,growth:1.45,effect:'+25 maximum brain health / level',parent:'damage',required:1,waves:0},
 {id:'recovery',name:'Restorative sleep',base:18,growth:1.5,effect:'+8 brain healing and +10% defender healing after waves / level',parent:'brain',required:1,waves:2},
 {id:'income',name:'Focused attention',base:14,growth:1.5,effect:'+20% Focus per kill / level',parent:'attack',required:1,waves:0},
 {id:'resources',name:'Morning routine',base:20,growth:1.5,effect:'+20 starting Focus / level',parent:'income',required:1,waves:4},
];
export const upgradeCost = (u: Upgrade, level: number): number => Math.ceil(u.base * u.growth ** level);

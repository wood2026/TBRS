export type UpgradeId=string;
export type Upgrade={id:UpgradeId;name:string;base:number;growth:number;effect:string;parent?:UpgradeId;required:number;waves:number;max?:number;icon:string;x:number;y:number};
export const UPGRADES:Upgrade[]=[
 {id:'damage',name:'Deliberate practice',base:8,growth:1.35,effect:'+25% global damage / level',required:0,waves:0,icon:'D',x:430,y:60},
 {id:'attack',name:'Steady rhythm',base:12,growth:1.35,effect:'+15% global attack speed / level',parent:'damage',required:1,waves:0,icon:'A',x:170,y:210},
 {id:'movement',name:'Daily movement',base:10,growth:1.35,effect:'+10% global movement / level',parent:'damage',required:1,waves:0,icon:'V',x:430,y:210},
 {id:'brain',name:'Mental resilience',base:10,growth:1.35,effect:'+25 brain health / level',parent:'damage',required:1,waves:0,icon:'B',x:690,y:210},
 {id:'income',name:'Focused attention',base:14,growth:1.35,effect:'+20% Focus per kill / level',parent:'attack',required:1,waves:0,icon:'F',x:170,y:360},
 {id:'unlock_exercise',name:'Unlock Exercise',base:20,growth:1,effect:'Fast interceptor with a pursuit sprint',parent:'movement',required:1,waves:0,max:1,icon:'E',x:430,y:360},
 {id:'recovery',name:'Restorative sleep',base:18,growth:1.35,effect:'+8 brain HP and +10% team healing after waves / level',parent:'brain',required:1,waves:2,icon:'H',x:690,y:360},
 {id:'resources',name:'Morning routine',base:20,growth:1.35,effect:'+20 starting Focus / level',parent:'income',required:1,waves:4,icon:'$',x:170,y:510},
 {id:'exercise_mastery',name:'Exercise mastery',base:16,growth:1.35,effect:'+15% Exercise damage and health / level',parent:'unlock_exercise',required:1,waves:0,icon:'E+',x:430,y:510},
 {id:'unlock_sleep',name:'Unlock Sleep',base:22,growth:1,effect:'Durable support that heals nearby allies',parent:'recovery',required:1,waves:2,max:1,icon:'Z',x:690,y:510},
 {id:'unlock_social',name:'Unlock Social Connection',base:24,growth:1,effect:'Nearby allies gain a non-stacking damage aura',parent:'resources',required:1,waves:4,max:1,icon:'S',x:170,y:660},
 {id:'unlock_mindfulness',name:'Unlock Mindfulness',base:24,growth:1,effect:'Area damage and slowing pulses',parent:'exercise_mastery',required:1,waves:4,max:1,icon:'M',x:430,y:660},
 {id:'sleep_mastery',name:'Sleep mastery',base:18,growth:1.35,effect:'+2 healing/sec, +15% Sleep damage and health / level',parent:'unlock_sleep',required:1,waves:0,icon:'Z+',x:690,y:660},
 {id:'social_mastery',name:'Connection mastery',base:18,growth:1.35,effect:'+8% aura damage bonus, +15% own stats / level',parent:'unlock_social',required:1,waves:0,icon:'S+',x:170,y:810},
 {id:'mindfulness_mastery',name:'Mindfulness mastery',base:18,growth:1.35,effect:'+0.2s pulse slow, +15% damage and health / level',parent:'unlock_mindfulness',required:1,waves:0,icon:'M+',x:430,y:810},
 {id:'reading_mastery',name:'Reading mastery',base:14,growth:1.35,effect:'+15% Reading damage and health / level',parent:'attack',required:2,waves:2,icon:'R+',x:430,y:960},
];
export const upgradeCost=(u:Upgrade,level:number):number=>Math.ceil(u.base*u.growth**level);


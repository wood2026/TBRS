import type { Stats } from './config.js';
export type DefenderKind='reading'|'exercise'|'sleep'|'social'|'mindfulness';
export const DEFENDERS:Record<DefenderKind,{name:string;cost:number;color:string;icon:string;role:string;stats:Stats}>={
 reading:{name:'Reading',cost:40,color:'#77d4ab',icon:'R',role:'Reliable melee fighter',stats:{speed:140,range:43,attackSpeed:1.4,maxHp:150,damage:18,aggro:650}},
 exercise:{name:'Exercise',cost:50,color:'#ff9c66',icon:'E',role:'Sprints to intercept brain attackers',stats:{speed:175,range:42,attackSpeed:1.5,maxHp:130,damage:17,aggro:780}},
 sleep:{name:'Sleep',cost:65,color:'#96a5ff',icon:'Z',role:'Durable healer; restores nearby allies',stats:{speed:108,range:42,attackSpeed:0.9,maxHp:270,damage:11,aggro:600}},
 social:{name:'Social Connection',cost:60,color:'#ffd675',icon:'S',role:'Non-stacking damage aura for nearby allies',stats:{speed:130,range:48,attackSpeed:1.1,maxHp:160,damage:12,aggro:650}},
 mindfulness:{name:'Mindfulness',cost:65,color:'#d7a0f2',icon:'M',role:'Area pulse damages and slows nearby enemies',stats:{speed:125,range:65,attackSpeed:0.8,maxHp:145,damage:16,aggro:650}},
};
export const ROLE_TUNING={healRadius:145,healPerSecond:5,buffRadius:160,buff:0.25,pulseRadius:85,pulseDamage:0.45,pulseSlow:1.3,sprint:1.45};

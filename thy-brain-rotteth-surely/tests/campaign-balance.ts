import { campaign } from './campaign-simulation.ts';
for(const strategy of ['offense','defense','mixed','roles'])console.log(JSON.stringify(campaign(strategy)));







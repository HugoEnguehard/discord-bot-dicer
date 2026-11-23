require('dotenv').config({quiet:true});
const {format}=require('node:util');
for(const level of ['log','warn','error','info','debug']){const original=console[level].bind(console);console[level]=(...args)=>{let text=format(...args.map(a=>a instanceof Error?'[erreur masquée]':a));for(const [key,value] of Object.entries(process.env)){if(value&&value.length>=4&&/TOKEN|SECRET|PASSWORD|KEY|EASTER_EGG/i.test(key))text=text.split(value).join('[masqué]');}original(text.replace(/(?:Bot|Bearer)\s+\S+/gi,'[autorisation masquée]'));};}

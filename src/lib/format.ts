import type { QuantityUnit } from "@/types/api";
export const fmtNumber=(n:number)=>new Intl.NumberFormat("en-IN",{maximumFractionDigits:2}).format(n);
export const fmtDate=(s:string)=>new Intl.DateTimeFormat("en-IN",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(s));
export const fmtDateTime=(s:string)=>new Intl.DateTimeFormat("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}).format(new Date(s));
export const fmtQty=(n:number,u:QuantityUnit)=>`${fmtNumber(n)} ${u}`;
export const hoursUntil=(s:string)=>Math.max(0,(new Date(s).getTime()-Date.now())/3600000);
export const expiryLabel=(s:string)=>{const h=hoursUntil(s); if(h<1)return `${Math.round(h*60)}m left`; if(h<24)return `${h.toFixed(1)}h left`; return `${Math.ceil(h/24)}d left`};
export const titleCase=(s:string)=>s.toLowerCase().replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase());

"use client";
import * as I from "lucide-react";
export function Icon({name,size=18}:{name:string;size?:number}){const C=(I as any)[name]||I.Circle;return <C size={size} strokeWidth={1.8}/>}

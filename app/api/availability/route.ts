import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { defaultServices, provisionalSchedule } from "@/lib/brand";

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? ""; const slug = request.nextUrl.searchParams.get("service") ?? "";
  const service = defaultServices.find((item)=>item.slug===slug);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !service) return NextResponse.json({error:"Parâmetros inválidos."},{status:400});
  const day = new Date(`${date}T12:00:00-03:00`).getDay(); if (!provisionalSchedule.weekdays.includes(day)) return NextResponse.json({slots:[]});
  const db = env.DB; if (!db) return NextResponse.json({error:"Agenda indisponível."},{status:503});
  const override = await db.prepare("SELECT duration_minutes, active FROM service_overrides WHERE slug=?").bind(slug).first<{duration_minutes:number;active:number}>();
  if (override && !override.active) return NextResponse.json({slots:[]});
  const durationMinutes = override?.duration_minutes ?? service.durationMinutes;
  const occupied = await db.prepare("SELECT slot_key FROM appointment_slots WHERE slot_key LIKE ?").bind(`${date}T%`).all<{slot_key:string}>();
  const taken = new Set(occupied.results.map((row)=>row.slot_key)); const slots:string[]=[];
  for(let minutes=provisionalSchedule.startHour*60; minutes+durationMinutes<=provisionalSchedule.endHour*60; minutes+=provisionalSchedule.slotMinutes){
    if(minutes<provisionalSchedule.lunchEnd*60 && minutes+durationMinutes>provisionalSchedule.lunchStart*60) continue;
    const needed=Array.from({length:Math.ceil(durationMinutes/provisionalSchedule.slotMinutes)},(_,i)=>minutes+i*provisionalSchedule.slotMinutes);
    if(needed.some((value)=>taken.has(`${date}T${String(Math.floor(value/60)).padStart(2,"0")}:${String(value%60).padStart(2,"0")}`))) continue;
    slots.push(`${String(Math.floor(minutes/60)).padStart(2,"0")}:${String(minutes%60).padStart(2,"0")}`);
  }
  return NextResponse.json({slots,timezone:provisionalSchedule.timezone,provisional:true});
}

import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { defaultServices, provisionalSchedule } from "@/lib/brand";

const bookingSchema=z.object({serviceSlug:z.string(),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),time:z.string().regex(/^\d{2}:\d{2}$/),name:z.string().trim().min(3).max(100),whatsapp:z.string().min(10).max(24),email:z.string().email().or(z.literal("")),notes:z.string().max(800),consent:z.literal(true)});
export const dynamic="force-dynamic";
export async function POST(request:NextRequest){
  const parsed=bookingSchema.safeParse(await request.json().catch(()=>null)); if(!parsed.success) return NextResponse.json({error:"Revise os dados informados."},{status:400});
  const service=defaultServices.find((item)=>item.slug===parsed.data.serviceSlug); if(!service) return NextResponse.json({error:"Procedimento inválido."},{status:400});
  const db=env.DB; if(!db) return NextResponse.json({error:"Agenda temporariamente indisponível."},{status:503});
  const override=await db.prepare("SELECT duration_minutes,active FROM service_overrides WHERE slug=?").bind(service.slug).first<{duration_minutes:number;active:number}>(); if(override&&!override.active)return NextResponse.json({error:"Procedimento indisponível."},{status:400});
  const durationMinutes=override?.duration_minutes??service.durationMinutes;
  const [hour,minute]=parsed.data.time.split(":").map(Number); const start=hour*60+minute; const end=start+durationMinutes;
  if(start<provisionalSchedule.startHour*60 || end>provisionalSchedule.endHour*60 || (start<provisionalSchedule.lunchEnd*60 && end>provisionalSchedule.lunchStart*60)) return NextResponse.json({error:"Horário inválido."},{status:400});
  const id=crypto.randomUUID(); const now=new Date().toISOString(); const endTime=`${String(Math.floor(end/60)).padStart(2,"0")}:${String(end%60).padStart(2,"0")}`;
  const slots=Array.from({length:Math.ceil(durationMinutes/provisionalSchedule.slotMinutes)},(_,i)=>{const m=start+i*provisionalSchedule.slotMinutes;return `${parsed.data.date}T${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`});
  try { await db.batch([db.prepare("INSERT INTO appointments (id,service_slug,service_name,customer_name,whatsapp,email,notes,appointment_date,start_time,end_time,duration_minutes,status,consent_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(id,service.slug,service.name,parsed.data.name,parsed.data.whatsapp,parsed.data.email||null,parsed.data.notes||null,parsed.data.date,parsed.data.time,endTime,durationMinutes,"pending",now,now,now),...slots.map((slot)=>db.prepare("INSERT INTO appointment_slots (appointment_id,slot_key) VALUES (?,?)").bind(id,slot))]); }
  catch { return NextResponse.json({error:"Esse horário acabou de ser reservado. Escolha outro."},{status:409}); }
  return NextResponse.json({id,status:"pending"},{status:201});
}

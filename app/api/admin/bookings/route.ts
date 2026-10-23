import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthorizedAdmin } from "@/lib/admin-auth";
export const dynamic="force-dynamic";
export async function GET(){if(!await getAuthorizedAdmin())return NextResponse.json({error:"Não autorizado."},{status:401});if(!env.DB)return NextResponse.json({error:"Banco indisponível."},{status:503});const rows=await env.DB.prepare("SELECT * FROM appointments ORDER BY appointment_date ASC, start_time ASC LIMIT 200").all();return NextResponse.json({appointments:rows.results})}
const patchSchema=z.object({id:z.string().uuid(),status:z.enum(["pending","confirmed","completed","cancelled","no_show"])});
export async function PATCH(request:NextRequest){if(!await getAuthorizedAdmin())return NextResponse.json({error:"Não autorizado."},{status:401});const parsed=patchSchema.safeParse(await request.json().catch(()=>null));if(!parsed.success||!env.DB)return NextResponse.json({error:"Dados inválidos."},{status:400});const now=new Date().toISOString();await env.DB.prepare("UPDATE appointments SET status=?,updated_at=? WHERE id=?").bind(parsed.data.status,now,parsed.data.id).run();if(parsed.data.status==='cancelled')await env.DB.prepare("DELETE FROM appointment_slots WHERE appointment_id=?").bind(parsed.data.id).run();return NextResponse.json({ok:true})}

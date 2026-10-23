import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BookingFlow } from "@/components/booking-flow";

export const metadata: Metadata = { title: "Agendar", description: "Escolha procedimento, data e horário para solicitar seu atendimento." };

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ servico?: string }> }) {
  const { servico } = await searchParams;
  return <main className="booking-page"><header className="booking-header"><Link href="/"><ArrowLeft size={18} /> Voltar</Link><Link href="/" className="booking-brand">Amanda Teixeira Beauty</Link><span>Horário de Brasília</span></header><BookingFlow initialServiceSlug={servico} /></main>;
}

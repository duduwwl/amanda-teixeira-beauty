import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { defaultServices } from "@/lib/brand";
export default function ServicesPage(){return <main className="legal-page"><Link href="/"><ArrowLeft size={18}/>Voltar</Link><h1>Procedimentos</h1>{defaultServices.map((service)=><section key={service.slug}><h2>{service.name}</h2><p>{service.description}</p><p><strong>{service.priceLabel}</strong> · duração a confirmar</p><Link className="text-link" href={`/agendar?servico=${service.slug}`}>Consultar agenda <ArrowUpRight size={17}/></Link></section>)}</main>}

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Camera } from "lucide-react";
import { defaultServices, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/brand";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";

const visualNotes = [["ref-profile", "Retrato da Amanda visível no perfil enviado"], ["ref-result", "Resultado divulgado no perfil"], ["ref-process", "Bastidores de procedimento"], ["ref-studio", "Ambiente e presença da marca"]] as const;

export default function Home() {
  return <main className="site-shell" id="main-content">
    <SiteHeader />
    <section className="hero" id="inicio">
      <h1 className="hero-title" aria-label="Amanda Teixeira Beauty"><span className="mask-line"><span>Amanda Teixeira</span></span><span className="mask-line second"><span>Beauty</span></span></h1>
      <div className="reference-photo hero-small ref-studio" role="img" aria-label="Imagem do ambiente visível no perfil do Instagram" />
      <div className="reference-photo hero-portrait ref-profile" role="img" aria-label="Retrato de Amanda Teixeira visível no perfil do Instagram" />
      <div className="hero-copy"><p>Sua beleza, minha especialidade. Regeneração, micropigmentação e remoção a laser com atenção a cada detalhe.</p><Link className="text-link" href="/agendar">Agendar minha avaliação <ArrowDownRight size={18} /></Link></div>
      <p className="media-disclaimer">Prévia visual feita a partir da captura enviada. Fotos originais autorizadas ainda são necessárias.</p>
    </section>

    <section className="intro section-frame" aria-labelledby="intro-title"><Reveal><h2 id="intro-title">Precisão para cuidar do que é único.</h2></Reveal><Reveal delay={1}><p>O atendimento parte da avaliação e respeita as particularidades de cada pessoa. Sem promessas genéricas: procedimento, plano e próximos passos são definidos com clareza.</p></Reveal><div className="fact-row"><Reveal><div><strong>Avaliação</strong><span>antes de indicar o protocolo</span></div></Reveal><Reveal delay={1}><div><strong>Individual</strong><span>cada atendimento tem seu contexto</span></div></Reveal><Reveal delay={2}><div><strong>Responsável</strong><span>resultados nunca são tratados como garantia</span></div></Reveal></div></section>

    <section className="about-field" id="sobre" aria-labelledby="about-title"><div className="about-sticky"><h2 id="about-title">Amanda</h2></div><div className="about-pass">{visualNotes.slice(0, 3).map(([klass, caption], index) => <figure className={`about-portrait ${index % 2 ? "right" : "left"}`} key={klass}><div className={`reference-photo ${klass}`} role="img" aria-label={caption} /><figcaption><strong>{index === 0 ? "A profissional" : index === 1 ? "O olhar técnico" : "O cuidado em processo"}</strong><span>{caption}. Material provisório até o recebimento dos arquivos originais.</span></figcaption></figure>)}</div></section>

    <section className="services section-frame" id="procedimentos" aria-labelledby="services-title"><Reveal><h2 id="services-title">Procedimentos com contexto, não com fórmulas.</h2></Reveal><div className="service-layout"><div className="reference-photo service-photo ref-result" role="img" aria-label="Resultado visível no perfil do Instagram" /><div className="service-list" aria-label="Serviços divulgados">{defaultServices.map((service) => <article key={service.slug}><div><h3>{service.name}</h3><p>{service.short}</p></div><div><span>{service.priceLabel}</span><Link href={`/agendar?servico=${service.slug}`} aria-label={`Agendar ${service.name}`}><ArrowUpRight size={20} /></Link></div></article>)}</div></div><p className="data-note">Duração e valores não foram publicados nesta prévia. A administradora pode confirmá-los no painel.</p></section>

    <section className="experience section-frame" id="experiencia" aria-labelledby="experience-title"><div className="experience-copy"><Reveal><h2 id="experience-title">Um atendimento que começa antes do procedimento.</h2></Reveal><p>A experiência foi desenhada em três momentos: entender, escolher e acompanhar. O agendamento já organiza as informações essenciais, sem pedir dados pessoais desnecessários.</p><Link href="/agendar" className="text-link">Ver horários disponíveis <ArrowUpRight size={18} /></Link></div><div className="frame-run">{visualNotes.map(([klass, caption], index) => <figure className={index === 1 ? "lifted" : ""} key={`${klass}-run`}><div className={`reference-photo ${klass}`} role="img" aria-label={caption} /><figcaption>{caption}</figcaption></figure>)}</div></section>

    <section className="results section-frame" id="resultados" aria-labelledby="results-title"><div><Reveal><h2 id="results-title">Resultados reais exigem autorização real.</h2></Reveal><p>A galeria está preparada para receber fotografias autorizadas, categorias e comparações acessíveis. Nenhum antes e depois foi inventado para preencher espaço.</p></div><div className="results-stage"><div className="reference-photo ref-result" role="img" aria-label="Imagem de resultado visível na captura do perfil" /><div className="reference-photo ref-process" role="img" aria-label="Imagem de processo visível na captura do perfil" /><div className="reference-photo ref-studio" role="img" aria-label="Imagem do ambiente visível na captura do perfil" /></div></section>

    <section className="booking-cta" aria-labelledby="cta-title"><div className="reference-photo cta-image ref-profile" role="img" aria-label="Retrato da Amanda visível na captura do perfil" /><div className="cta-copy"><h2 id="cta-title">Seu próximo momento de cuidado começa aqui.</h2><p>Escolha o procedimento, veja a disponibilidade e confirme seus dados em poucos passos.</p><Link href="/agendar" className="primary-button">Escolher meu horário <ArrowUpRight size={18} /></Link></div></section>

    <section className="contact-band section-frame" id="contato" aria-labelledby="contact-title"><h2 id="contact-title">Fale diretamente com a Amanda.</h2><div className="reference-photo contact-photo ref-profile" role="img" aria-label="Retrato da Amanda visível na captura do perfil" /><div><p>Dúvidas sobre avaliação, procedimentos ou cursos?</p><a href={WHATSAPP_URL}>Conversar no WhatsApp</a><a href={INSTAGRAM_URL}>Ver Instagram <Camera size={17} /></a><span>Local e horários aguardam confirmação.</span></div></section>

    <footer className="footer"><div><div><strong>Navegação</strong><a href="#sobre">Sobre</a><a href="#procedimentos">Procedimentos</a><Link href="/agendar">Agendar</Link></div><div><strong>Contato</strong><a href={WHATSAPP_URL}>WhatsApp</a><a href={INSTAGRAM_URL}>Instagram</a></div><div><strong>Informações</strong><Link href="/politica-de-privacidade">Privacidade</Link><Link href="/termos">Termos</Link></div><div><strong>Gestão</strong><Link href="/admin">Painel administrativo</Link></div></div><p className="footer-mark">Amanda Teixeira</p><p className="footer-legal">© 2026 Amanda Teixeira Beauty. Informações profissionais e imagens finais sujeitas à confirmação da titular.</p></footer>
  </main>;
}

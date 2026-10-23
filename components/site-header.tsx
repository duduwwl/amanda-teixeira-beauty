"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
export function SiteHeader() {
  const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 24); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  return <header className={`site-header ${scrolled ? "scrolled" : ""}`}><a className="skip-link" href="#main-content">Ir para o conteúdo</a><a href="#inicio" className="wordmark" translate="no">AT</a><nav className={open ? "open" : ""} aria-label="Navegação principal"><a href="#sobre" onClick={() => setOpen(false)}>Sobre</a><a href="#procedimentos" onClick={() => setOpen(false)}>Procedimentos</a><a href="#resultados" onClick={() => setOpen(false)}>Resultados</a><a href="#contato" onClick={() => setOpen(false)}>Contato</a></nav><Link href="/agendar" className="header-action">Agendar horário</Link><button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button></header>;
}

import { Hero } from '../components/sections/Hero'
import { Ritual } from '../components/sections/Ritual'
import { About } from '../components/sections/About'
import { Procedures } from '../components/sections/Procedures'
import { Studio } from '../components/sections/Studio'
import { Results } from '../components/sections/Results'
import { Courses } from '../components/sections/Courses'
import { Testimonials } from '../components/sections/Testimonials'
import { Faq } from '../components/sections/Faq'
import { Contact } from '../components/sections/Contact'
import { useReveal } from '../hooks/useReveal'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function Home() {
  useDocumentMeta(
    'Amanda Teixeira Beauty | Biomedicina estética em Lavras-MG',
    'Regeneração com exossomos, RegenereHair, RegenereBrows, remoção a laser, nanopigmentação e cursos profissionais com Amanda Teixeira, em Lavras-MG. Agende online.',
  )
  useReveal()
  return (
    <>
      <Hero />
      <Ritual />
      <About />
      <Procedures />
      <Studio />
      <Results />
      <Courses />
      <Testimonials />
      <Faq />
      <Contact />
    </>
  )
}

// Onde cada foto entra no site. Os arquivos ficam em assets-src/<pasta>/<nome>.jpg
// e `npm run images` gera as versões otimizadas em public/images.
// Enquanto um arquivo não existir, o site mostra um campo neutro com a legenda.

export type Photo = { name: string; alt: string; focus?: string }

export const heroPhotos: Photo[] = [
  { name: 'amanda/hero-1', alt: 'Amanda Teixeira no studio', focus: '62% 30%' },
  { name: 'amanda/hero-2', alt: 'Amanda Teixeira em atendimento', focus: '60% 30%' },
  { name: 'amanda/hero-3', alt: 'Amanda Teixeira no espelho do studio', focus: '55% 30%' },
]

export const ritualPhotos: Photo[] = [
  { name: 'estudio/avaliacao', alt: 'Couro cabeludo examinado em imagem ampliada num tablet durante a avaliação' },
  { name: 'estudio/atendimento', alt: 'Amanda conversando com uma cliente antes do procedimento' },
  { name: 'estudio/led', alt: 'Cliente com máscara de LED segurando um frasco de exossomos' },
]

export const aboutPhotos: (Photo & { title: string; text: string })[] = [
  {
    name: 'amanda/sobre-1',
    alt: 'Retrato de Amanda Teixeira',
    title: 'Biomedicina estética',
    text: 'Regeneração com exossomos, remoção a laser e micropigmentação: o trabalho de hoje junta técnica de saúde e olhar para a beleza.',
  },
  {
    name: 'amanda/sobre-2',
    alt: 'Amanda Teixeira no studio em Lavras',
    title: 'Studio em Lavras',
    text: 'Mais de cinco anos cuidando de sobrancelhas, cílios e lábios no studio, com hora marcada e atenção a uma cliente por vez.',
  },
  {
    name: 'amanda/sobre-3',
    alt: 'Amanda Teixeira segurando uma xícara no studio de beleza',
    title: 'Quem ensina',
    text: 'Além de atender, a Amanda forma outras profissionais em cursos próprios.',
  },
]

export const studioPhotos: Photo[] = [
  { name: 'estudio/ambiente', alt: 'Ambiente do studio com espelho e poltrona' },
  { name: 'estudio/equipamento', alt: 'Equipamento usado nos procedimentos' },
  { name: 'estudio/led-2', alt: 'Máscara de LED durante protocolo de regeneração' },
  { name: 'estudio/detalhe', alt: 'Detalhe do atendimento com luvas e materiais descartáveis' },
]

export type ResultCategory = 'Sobrancelhas' | 'Regeneração' | 'Laser' | 'Lábios'
export const results: (Photo & { category: ResultCategory; caption: string })[] = [
  { name: 'resultados/sobrancelha-1', alt: 'Sobrancelhas em close', category: 'Sobrancelhas', caption: 'Design e nanopigmentação' },
  { name: 'resultados/sobrancelha-2', alt: 'Olhar com sobrancelhas desenhadas', category: 'Sobrancelhas', caption: 'Nanopigmentação fio a fio' },
  { name: 'resultados/regenerebrows-1', alt: 'Evolução de sobrancelhas entre sessões', category: 'Regeneração', caption: 'RegenereBrows, evolução entre sessões' },
  { name: 'resultados/sobrancelha-3', alt: 'Sobrancelha em close após o procedimento', category: 'Sobrancelhas', caption: 'Acabamento natural' },
  { name: 'resultados/regenerehair-1', alt: 'Couro cabeludo em imagem ampliada', category: 'Regeneração', caption: 'RegenereHair, acompanhamento por imagem' },
  { name: 'resultados/laser-1', alt: 'Sobrancelha durante sessão de remoção a laser', category: 'Laser', caption: 'Clareamento de pigmento antigo' },
  { name: 'resultados/labios-1', alt: 'Lábios após micropigmentação', category: 'Lábios', caption: 'Micropigmentação labial' },
]

export const coursePhotos: Photo[] = [
  { name: 'cursos/turma-1', alt: 'Aula prática de curso profissional no studio' },
  { name: 'cursos/turma-2', alt: 'Aluna praticando técnica de sobrancelha' },
  { name: 'cursos/turma-3', alt: 'Materiais usados no curso' },
  { name: 'cursos/turma-4', alt: 'Amanda orientando uma aluna' },
]

export const faqPhotos: [Photo, Photo] = [
  { name: 'amanda/faq', alt: 'Amanda Teixeira com uma cliente no studio' },
  { name: 'estudio/detalhe-2', alt: 'Detalhe de procedimento nas sobrancelhas' },
]

export const contactPhoto: Photo = { name: 'amanda/retrato', alt: 'Retrato de Amanda Teixeira' }

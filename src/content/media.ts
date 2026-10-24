// Onde cada foto entra no site. Originais em assets-src/<pasta>/<nome>.jpg (tirados dos perfis
// públicos da Amanda e do studio no Instagram); `npm run images` gera AVIF/WebP em public/images.

export type Photo = { name: string; alt: string; focus?: string }

export const heroPhotos: Photo[] = [
  { name: 'amanda/hero-1', alt: 'Amanda Teixeira de jaleco ao lado do Laser Spectra, no studio', focus: '64% 18%' },
  { name: 'amanda/hero-2', alt: 'Retrato de Amanda Teixeira', focus: '50% 18%' },
  { name: 'amanda/hero-3', alt: 'Amanda Teixeira no programa Caminhos para o Sucesso', focus: '50% 20%' },
]

export const ritualPhotos: Photo[] = [
  { name: 'estudio/avaliacao', alt: 'Sobrancelhas comparadas na tela de um tablet durante a avaliação' },
  { name: 'estudio/atendimento', alt: 'Amanda Teixeira de máscara e luvas atendendo uma cliente' },
  { name: 'estudio/detalhe-2', alt: 'Olhar de cliente antes e depois do design de sobrancelhas' },
]

export const aboutPhotos: (Photo & { title: string; text: string })[] = [
  {
    name: 'amanda/sobre-1',
    alt: 'Retrato de Amanda Teixeira de blazer branco',
    title: 'Biomedicina estética',
    text: 'Dona e responsável pelo studio. Começou na maquiagem e no design de sobrancelhas e hoje trabalha com regeneração por exossomos, laser e nanopigmentação.',
  },
  {
    name: 'amanda/sobre-2',
    alt: 'Amanda Teixeira na recepção do studio, com balões dourados de seis anos',
    title: 'Seis anos de studio',
    text: 'O Studio Amanda Teixeira completou seis anos em 2026, no Centro de Lavras. Quem chega é recebida com atenção e, como ela gosta, com um cafezinho.',
  },
  {
    name: 'amanda/sobre-3',
    alt: 'Amanda Teixeira sentada no studio segurando uma xícara',
    title: 'Quem ensina',
    text: 'Além de atender, forma novas profissionais em cursos próprios e levou os protocolos RegenereBrows e RegenereHair à TV, no programa Caminhos para o Sucesso.',
  },
]

export const studioPhotos: Photo[] = [
  { name: 'estudio/equipamento', alt: 'Equipamento de laser na sala de atendimento do studio' },
  { name: 'estudio/ambiente', alt: 'Amanda Teixeira durante a gravação do programa Caminhos para o Sucesso' },
  { name: 'estudio/cabelo', alt: 'Cabelos longos com mechas iluminadas, de costas, no studio' },
  { name: 'amanda/hero-3', alt: 'Amanda Teixeira com o certificado do programa de TV' },
]

export type ResultCategory = 'Sobrancelhas' | 'Regeneração' | 'Laser' | 'Brow lamination'
export const results: (Photo & { category: ResultCategory; caption: string })[] = [
  { name: 'resultados/sobrancelha-1', alt: 'Olhar antes e depois do lash & brow', category: 'Sobrancelhas', caption: 'Lash & brow' },
  { name: 'resultados/sobrancelha-2', alt: 'Sobrancelhas antes e depois do design', category: 'Sobrancelhas', caption: 'Design estratégico' },
  { name: 'resultados/regenerebrows-1', alt: 'Sobrancelhas antes e durante as sessões de RegenereBrows', category: 'Regeneração', caption: 'RegenereBrows, primeira e segunda sessão' },
  { name: 'resultados/sobrancelha-3', alt: 'Sobrancelhas antes e depois em close', category: 'Sobrancelhas', caption: 'Design reconstrutivo' },
  { name: 'resultados/brow-1', alt: 'Cliente antes e depois da brow lamination', category: 'Brow lamination', caption: 'Brow lamination' },
  { name: 'resultados/laser-1', alt: 'Sobrancelhas antes e depois da remoção de pigmento a laser', category: 'Laser', caption: 'Remoção a laser e novo design' },
  { name: 'resultados/sobrancelha-4', alt: 'Cliente com sobrancelhas desenhadas e nanopigmentadas', category: 'Sobrancelhas', caption: 'Design estratégico e nanopigmentação' },
]

export const coursePhotos: Photo[] = [
  { name: 'cursos/turma-1', alt: 'Maquiagem com delineado gatinho feita no curso Start Makeup' },
  { name: 'cursos/turma-2', alt: 'Maquiagem clássica com esfumado opaco feita por aluna' },
  { name: 'cursos/turma-3', alt: 'Cliente com sobrancelhas realçadas, sem perder a naturalidade' },
  { name: 'cursos/turma-4', alt: 'Amanda Teixeira de jaleco no studio' },
]

export const faqPhotos: [Photo, Photo] = [
  { name: 'amanda/faq', alt: 'Amanda Teixeira sentada na poltrona do studio' },
  { name: 'resultados/sobrancelha-3', alt: 'Close de sobrancelhas depois do atendimento' },
]

export const contactPhoto: Photo = { name: 'amanda/retrato', alt: 'Retrato de Amanda Teixeira' }

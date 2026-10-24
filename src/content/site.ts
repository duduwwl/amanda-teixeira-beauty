// Conteúdo editorial do site. Fontes (consultadas em 23/10/2026):
// - Instagram @amandateixeirabeauty_ e @studioamandateixeira (bio, destaques e legendas dos posts)
// - Perfil do Studio Amanda Teixeira no Google Maps (endereço, horário, telefone, avaliações)

export const brand = {
  name: 'Amanda Teixeira',
  fullName: 'Amanda Teixeira Beauty',
  studioName: 'Studio Amanda Teixeira',
  motto: 'Sua beleza, minha especialidade.',
  role: 'Biomedicina estética',
  city: 'Lavras, Minas Gerais',
  cityShort: 'Lavras-MG',
  instagram: { handle: '@amandateixeirabeauty_', url: 'https://www.instagram.com/amandateixeirabeauty_/' },
  studioInstagram: { handle: '@studioamandateixeira', url: 'https://www.instagram.com/studioamandateixeira/' },
  /** Link oficial publicado na bio. */
  whatsappUrl: 'https://wa.me/message/AJAAIV6XAB5NF1',
  /** Telefone do studio no Google e nas legendas do Instagram. */
  whatsappNumber: '5535998866819',
  phoneDisplay: '(35) 99886-6819',
  address: 'Rua Dr. Álvaro Botelho, Centro, Lavras-MG, 37200-066',
  addressShort: 'Rua Dr. Álvaro Botelho, Centro',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Studio+Amanda+Teixeira&query_place_id=ChIJ6_6GaOytypQRLnepYs0jKDw',
  hours: [
    { days: 'Terça a sexta', time: '9h às 19h' },
    { days: 'Sábado', time: '9h às 18h' },
    { days: 'Domingo e segunda', time: 'fechado' },
  ],
  hoursText: 'Terça a sexta, 9h às 19h. Sábado, 9h às 18h.',
  since: 2020,
  experience: 'Seis anos de studio',
  googleRating: { value: '5,0', count: 7 },
}

export type ProcedureInfo = {
  slug: string
  name: string
  lead: string
  body: string
  care: string
  evaluation: boolean
  image: string
  imageAlt: string
}

// Os mesmos slugs existem na agenda (supabase/seed.sql e services/demoBackend.ts).
export const procedures: ProcedureInfo[] = [
  {
    slug: 'regenerehair',
    name: 'RegenereHair',
    lead: 'Regeneração capilar com exossomos.',
    body: 'Antes de tratar, a escuta: o histórico de cada pessoa e o couro cabeludo examinado em imagem ampliada. A partir disso, um protocolo montado só para você.',
    care: 'Feito em sessões, com acompanhamento da evolução. Cada organismo responde num ritmo.',
    evaluation: true,
    image: 'procedimentos/regenerehair',
    imageAlt: 'Couro cabeludo examinado com aparelho de imagem ampliada durante a consulta do RegenereHair',
  },
  {
    slug: 'regenerebrows',
    name: 'RegenereBrows',
    lead: 'Regeneração de sobrancelhas com exossomos.',
    body: 'Para sobrancelhas com falhas que ainda têm folículos viáveis: o protocolo estimula o crescimento de fios novos em vez de só camuflar.',
    care: 'A evolução é registrada sessão a sessão. A avaliação diz se o seu caso é indicado.',
    evaluation: true,
    image: 'procedimentos/regenerebrows',
    imageAlt: 'Sobrancelhas fotografadas antes, na primeira e na segunda sessão de RegenereBrows',
  },
  {
    slug: 'remocao-laser',
    name: 'Remoção a laser',
    lead: 'Laser Spectra próprio, no dia que você escolher.',
    body: 'Para aquela micropigmentação que já não te representa: o laser clareia ou remove o pigmento sem agredir a pele, e prepara a sobrancelha para um novo trabalho.',
    care: 'O número de sessões depende da cor, da profundidade e do tempo do pigmento.',
    evaluation: true,
    image: 'procedimentos/remocao-laser',
    imageAlt: 'Amanda Teixeira ao lado do equipamento de laser no studio',
  },
  {
    slug: 'nanopigmentacao',
    name: 'Nanopigmentação',
    lead: 'Fios desenhados um a um.',
    body: 'Diferente da micropigmentação: o fio se mistura aos seus pelos naturais e preenche as falhas sem pesar no rosto.',
    care: 'O desenho é aprovado por você antes de qualquer pigmento. Retoque combinado no atendimento.',
    evaluation: false,
    image: 'procedimentos/nanopigmentacao',
    imageAlt: 'Sobrancelhas antes e depois da nanopigmentação fio a fio',
  },
  {
    slug: 'design-estrategico',
    name: 'Design estratégico',
    lead: 'O método da Amanda para desenhar sobrancelhas.',
    body: 'Mapeamento que respeita a anatomia e os fios que você já tem. Quando há falhas, entra o design reconstrutivo, acompanhado ao longo dos meses.',
    care: 'Um bom primeiro passo para quem nunca fez nada nas sobrancelhas.',
    evaluation: false,
    image: 'procedimentos/design',
    imageAlt: 'Sobrancelhas antes e depois do design estratégico',
  },
  {
    slug: 'brow-lamination',
    name: 'Brow lamination',
    lead: 'Com lash lifting, olhar levantado com os próprios fios.',
    body: 'A brow lamination alinha e dá volume às sobrancelhas; o lash lifting curva e tinge os cílios com efeito de rímel. Juntos, formam o combo de efeito lifting no olhar.',
    care: 'Sem pigmento na pele. Os cuidados dos primeiros dias são passados no atendimento.',
    evaluation: false,
    image: 'procedimentos/brow-lamination',
    imageAlt: 'Cliente sorrindo com sobrancelhas alinhadas após a brow lamination',
  },
  {
    slug: 'henna-labial',
    name: 'Henna labial',
    lead: 'Lábios hidratados com efeito lip tint.',
    body: 'Trata o ressecamento, tira a pele que descasca e deixa uma cor suave que dura alguns dias: a sensação de acordar pronta.',
    care: 'Procedimento rápido, que pode ser feito junto com outros.',
    evaluation: false,
    image: 'procedimentos/labial',
    imageAlt: 'Cliente com lábios rosados e pele iluminada',
  },
]

export type Course = { name: string; audience: string; summary: string; topics?: string[] }
export const courses: Course[] = [
  {
    name: 'Formação Design Estratégico',
    audience: 'Para quem quer começar na área da beleza',
    summary: 'O método da Amanda ensinado do zero, em turma presencial.',
    topics: ['100% prático, com certificado', 'Comunidade de alunas e suporte depois do curso'],
  },
  {
    name: 'VIP Design Estratégico',
    audience: 'Individual',
    summary: 'A mesma técnica em atendimento exclusivo, nos mínimos detalhes, para sair pronta para o mercado.',
  },
  {
    name: 'VIP Brow & Lash',
    audience: 'Individual, 2 em 1',
    summary: 'Brow lamination e lash lifting, os dois procedimentos em alta de sobrancelhas e cílios.',
  },
  {
    name: 'Start Makeup',
    audience: 'Maquiagem profissional',
    summary: 'Para transformar o talento em profissão, com turma de aperfeiçoamento para quem já maquia.',
  },
]

/** Avaliações públicas do studio no Google (sem nome: só o texto publicado). */
export type Testimonial = { quote: string; author: string; procedure?: string }
export const testimonials: Testimonial[] = [
  { quote: 'Excelente profissional, explica muito bem todos os procedimentos que irá fazer e tem muita experiência na área.', author: 'Avaliação no Google' },
  { quote: 'Amei a experiência no curso profissional de maquiagem com a Amanda, aprendi bastante coisa.', author: 'Avaliação no Google', procedure: 'Curso de maquiagem' },
  { quote: 'Atendimento maravilhoso, com profissionais perfeitas e ótimos valores.', author: 'Avaliação no Google' },
]

export const faq: { q: string; a: string }[] = [
  {
    q: 'Como faço para agendar?',
    a: 'Pela página de agendamento: escolha o procedimento, o dia e um dos horários livres, deixe nome e WhatsApp e receba o código da reserva na hora. A confirmação vem pelo WhatsApp do studio.',
  },
  {
    q: 'Preciso de avaliação antes?',
    a: 'Para RegenereHair, RegenereBrows e remoção a laser, sim: a avaliação define se o procedimento é indicado e quantas sessões fazem sentido. Nos demais, a conversa acontece no começo do próprio atendimento.',
  },
  {
    q: 'Nanopigmentação e micropigmentação são a mesma coisa?',
    a: 'Não. Na nanopigmentação os fios são desenhados um a um e se misturam aos seus pelos, o que deixa o resultado mais leve e natural.',
  },
  {
    q: 'Dá para tirar uma micropigmentação antiga?',
    a: 'Na maioria dos casos, sim, com sessões de laser Spectra. A avaliação diz quantas, conforme a cor e a profundidade do pigmento.',
  },
  {
    q: 'Como me preparo e quais os cuidados depois?',
    a: 'As orientações dependem do procedimento. Você recebe tudo pelo WhatsApp antes do atendimento e sai do studio com os cuidados dos dias seguintes.',
  },
  {
    q: 'Posso reagendar ou cancelar?',
    a: 'Pode. Avise pelo WhatsApp com o código da reserva, de preferência com antecedência, para que o horário fique livre para outra pessoa.',
  },
  {
    q: 'Quais as formas de pagamento?',
    a: 'Valores e formas de pagamento são informados na confirmação do horário pelo WhatsApp.',
  },
]

export const bookingConditions = [
  'A reserva fica pendente até o studio confirmar pelo WhatsApp.',
  'Para reagendar ou cancelar, avise pelo WhatsApp com o código da reserva.',
  'Procedimentos que exigem avaliação podem ser ajustados depois dela.',
]

// Conteúdo editorial do site. Tudo aqui foi conferido nos perfis públicos
// @amandateixeirabeauty_ e @studioamandateixeira (23/10/2026), exceto o que está
// marcado como PENDENTE — esses campos ficam vazios até a Amanda confirmar e,
// enquanto vazios, o site simplesmente não exibe a informação.

export const brand = {
  name: 'Amanda Teixeira',
  fullName: 'Amanda Teixeira Beauty',
  motto: 'Sua beleza, minha especialidade.',
  role: 'Biomedicina estética',
  city: 'Lavras, Minas Gerais',
  cityShort: 'Lavras-MG',
  instagram: { handle: '@amandateixeirabeauty_', url: 'https://www.instagram.com/amandateixeirabeauty_/' },
  studioInstagram: { handle: '@studioamandateixeira', url: 'https://www.instagram.com/studioamandateixeira/' },
  /** Link oficial publicado na bio. Abre o WhatsApp da Amanda. */
  whatsappUrl: 'https://wa.me/message/AJAAIV6XAB5NF1',
  /** PENDENTE: número com DDI+DDD (ex.: 5535999999999). Com ele, as mensagens já vão pré-preenchidas. */
  whatsappNumber: '' as string,
  /** PENDENTE: endereço completo do studio. */
  address: '' as string,
  /** PENDENTE: link do Google Maps do endereço. */
  mapsUrl: '' as string,
  /** PENDENTE: horários reais; a agenda online usa o que está cadastrado no painel. */
  hoursText: '' as string,
  experience: 'Mais de cinco anos de studio',
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

// Os mesmos slugs existem na tabela `services` do banco (supabase/seed.sql).
export const procedures: ProcedureInfo[] = [
  {
    slug: 'regenerehair',
    name: 'RegenereHair',
    lead: 'Regeneração capilar com exossomos.',
    body: 'Protocolo para couro cabeludo e fios. Antes de começar, o couro cabeludo é examinado em imagem ampliada para entender o que está acontecendo com cada região.',
    care: 'Feito em sessões. Quantas e com que intervalo, só a avaliação diz.',
    evaluation: true,
    image: 'procedimentos/regenerehair.webp',
    imageAlt: 'Frasco de exossomos para protocolo capilar, com máscara de LED ao fundo',
  },
  {
    slug: 'regenerebrows',
    name: 'RegenereBrows',
    lead: 'Regeneração de sobrancelhas com exossomos.',
    body: 'Para sobrancelhas que ficaram ralas ou com falhas. A evolução é acompanhada e registrada de sessão em sessão.',
    care: 'Cada organismo responde num ritmo; não há promessa de resultado igual ao de outra pessoa.',
    evaluation: true,
    image: 'procedimentos/regenerebrows.webp',
    imageAlt: 'Sobrancelhas em close após sessão de RegenereBrows',
  },
  {
    slug: 'remocao-laser',
    name: 'Remoção a laser',
    lead: 'Clareamento ou remoção de pigmento.',
    body: 'Para micropigmentações e tatuagens que você não quer mais, ou que precisam clarear antes de um novo trabalho.',
    care: 'O número de sessões depende da cor, da profundidade e da idade do pigmento.',
    evaluation: true,
    image: 'procedimentos/remocao-laser.webp',
    imageAlt: 'Atendimento de remoção a laser no studio',
  },
  {
    slug: 'nanopigmentacao',
    name: 'Nanopigmentação',
    lead: 'Sobrancelhas fio a fio.',
    body: 'Os fios são desenhados um a um, seguindo a direção natural dos seus, para preencher sem pesar.',
    care: 'O desenho é aprovado por você antes de qualquer pigmento.',
    evaluation: false,
    image: 'procedimentos/nanopigmentacao.webp',
    imageAlt: 'Olhar com sobrancelhas nanopigmentadas fio a fio',
  },
  {
    slug: 'micropigmentacao-labial',
    name: 'Micropigmentação labial',
    lead: 'Cor e contorno para os lábios.',
    body: 'Devolve cor e definição aos lábios, com a tonalidade escolhida junto com você.',
    care: 'A cor assenta nos dias seguintes; as orientações de cuidado são passadas no atendimento.',
    evaluation: false,
    image: 'procedimentos/labial.webp',
    imageAlt: 'Lábios após micropigmentação',
  },
  {
    slug: 'design-sobrancelhas',
    name: 'Design de sobrancelhas',
    lead: 'Desenho para o seu rosto.',
    body: 'Mapeamento e design das sobrancelhas respeitando o formato do seu rosto e dos seus fios.',
    care: 'Um bom primeiro passo para quem nunca fez procedimento nas sobrancelhas.',
    evaluation: false,
    image: 'procedimentos/design.webp',
    imageAlt: 'Sobrancelhas após design',
  },
]

/** PENDENTE: cursos com nome, público e conteúdo confirmados pela Amanda. */
export type Course = { name: string; audience: string; summary: string; topics?: string[]; image?: string }
export const courses: Course[] = []

/** Somente depoimentos reais, com autorização por escrito. Vazio = seção não aparece. */
export type Testimonial = { quote: string; author: string; procedure?: string }
export const testimonials: Testimonial[] = []

export const faq: { q: string; a: string }[] = [
  {
    q: 'Como faço para agendar?',
    a: 'Pela página de agendamento: você escolhe o procedimento, o dia e um dos horários livres, deixa nome e WhatsApp e recebe um código de reserva na hora. A Amanda confirma o horário pelo WhatsApp.',
  },
  {
    q: 'Preciso de avaliação antes?',
    a: 'Para RegenereHair, RegenereBrows e remoção a laser, sim: a avaliação define se o procedimento é indicado e quantas sessões fazem sentido. Para os demais, a conversa acontece no início do próprio atendimento.',
  },
  {
    q: 'Como me preparo para o procedimento?',
    a: 'As orientações dependem do procedimento e de você. Depois da reserva, a Amanda envia pelo WhatsApp o que fazer nos dias anteriores.',
  },
  {
    q: 'E os cuidados depois?',
    a: 'Você sai do atendimento com as orientações por escrito para os dias seguintes e pode tirar dúvidas pelo WhatsApp.',
  },
  {
    q: 'Posso reagendar ou cancelar?',
    a: 'Pode. Fale pelo WhatsApp informando o código da reserva, de preferência com antecedência, para que o horário volte a ficar livre para outra pessoa.',
  },
  {
    q: 'Quais formas de pagamento?',
    a: 'As formas de pagamento são informadas na confirmação do horário pelo WhatsApp.',
  },
]

/** Página de agendamento usa esses textos como condições exibidas antes de confirmar. */
export const bookingConditions = [
  'A reserva fica pendente até a Amanda confirmar pelo WhatsApp.',
  'Para reagendar ou cancelar, avise pelo WhatsApp com o código da reserva.',
  'Procedimentos que exigem avaliação podem ser ajustados depois dela.',
]

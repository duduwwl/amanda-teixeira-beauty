export const INSTAGRAM_URL = "https://www.instagram.com/amandateixeirabeauty_/";
export const WHATSAPP_URL = "https://wa.me/message/AJAAIV6XAB5NF1";

export type Service = {
  slug: string; name: string; short: string; description: string; durationMinutes: number;
  priceLabel: string; provisional: boolean; category: "regeneracao" | "pigmentacao" | "laser" | "formacao";
};

export const defaultServices: Service[] = [
  { slug: "regeneracao-capilar", name: "Regeneração capilar", short: "Cuidado direcionado ao couro cabeludo e aos fios.", description: "Protocolo individualizado de regeneração capilar. A indicação, o número de sessões e os cuidados são definidos após avaliação.", durationMinutes: 60, priceLabel: "Sob consulta", provisional: true, category: "regeneracao" },
  { slug: "regeneracao-de-sobrancelhas", name: "Regeneração de sobrancelhas", short: "Protocolo para acompanhar a recuperação dos fios.", description: "Atendimento voltado à regeneração dos fios naturais das sobrancelhas, com plano ajustado às necessidades observadas na avaliação.", durationMinutes: 60, priceLabel: "Sob consulta", provisional: true, category: "regeneracao" },
  { slug: "remocao-a-laser", name: "Remoção a laser", short: "Avaliação e plano responsável para remoção de pigmento.", description: "Procedimento de remoção a laser com avaliação prévia. Resultados e número de sessões variam conforme cada caso.", durationMinutes: 60, priceLabel: "Sob consulta", provisional: true, category: "laser" },
  { slug: "micropigmentacao", name: "Micropigmentação", short: "Planejamento cuidadoso para valorizar traços naturais.", description: "Micropigmentação com análise individual. Técnica, desenho e tonalidade são definidos em conjunto durante o atendimento.", durationMinutes: 120, priceLabel: "Sob consulta", provisional: true, category: "pigmentacao" },
  { slug: "exossomos", name: "Tratamentos com exossomos", short: "Recurso integrado a protocolos de regeneração.", description: "Uso de exossomos em protocolos divulgados pela profissional. A indicação depende de avaliação individual.", durationMinutes: 60, priceLabel: "Sob consulta", provisional: true, category: "regeneracao" },
  { slug: "cursos-profissionais", name: "Cursos profissionais", short: "Capacitações para profissionais da área de beleza.", description: "Cursos e capacitações profissionais divulgados pela Amanda. Conteúdo, agenda e investimento são informados sob consulta.", durationMinutes: 240, priceLabel: "Solicite informações", provisional: true, category: "formacao" },
];

export const provisionalSchedule = { timezone: "America/Sao_Paulo", weekdays: [1, 2, 3, 4, 5], startHour: 9, endHour: 18, lunchStart: 12, lunchEnd: 13, slotMinutes: 30, minimumNoticeHours: 24, bookingWindowDays: 60 };

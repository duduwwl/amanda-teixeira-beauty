import { animate, inView, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@12.23.24/+esm";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("motion-ready");

const header = document.querySelector("[data-header]");
let lastScroll = 0;
addEventListener("scroll", () => {
  const current = scrollY;
  header?.classList.toggle("is-hidden", current > lastScroll && current > 160);
  lastScroll = current;
}, { passive: true });

if (!reduced) {
  inView("main section:not(.hero)", (section) => {
    const pieces = section.querySelectorAll("h2, h3, p, figure, .service-row");
    animate(pieces, { opacity: [0.55, 1], y: [24, 0] }, { duration: 0.78, delay: stagger(0.055), ease: [0.16, 1, 0.3, 1] });
  }, { amount: 0.12 });

  const heroPhoto = document.querySelector(".hero-main img");
  const hero = document.querySelector(".hero");
  if (heroPhoto && hero) scroll(animate(heroPhoto, { transform: ["scale(1)", "scale(1.08) translateY(3%)"] }, { ease: "linear" }), { target: hero, offset: ["start start", "end start"] });

  const media = document.querySelector("[data-media-between] figure");
  if (media) inView(media.parentElement, () => animate(media, { scaleX: [0, 1], opacity: [0, 1] }, { duration: 0.8, ease: [0.16, 1, 0.3, 1] }), { amount: 0.55 });
}

const explorer = document.querySelector("[data-service-explorer]");
if (explorer) {
  const rows = [...explorer.querySelectorAll("[data-service]")];
  const image = explorer.querySelector("[data-service-image]");
  const name = explorer.querySelector("[data-service-name]");
  const copy = explorer.querySelector("[data-service-copy]");
  const link = explorer.querySelector("[data-service-link]");

  const selectService = async (row) => {
    rows.forEach((item) => item.classList.toggle("is-active", item === row));
    if (!reduced && image) await animate(image, { opacity: [1, 0], scale: [1, 1.025] }, { duration: 0.16 }).finished;
    image.src = row.dataset.image;
    name.textContent = row.dataset.service;
    copy.textContent = row.dataset.copy;
    link.href = `agendar/?servico=${encodeURIComponent(row.dataset.service)}`;
    if (!reduced && image) animate(image, { opacity: [0, 1], scale: [1.025, 1] }, { duration: 0.42, ease: [0.16, 1, 0.3, 1] });
  };

  rows.forEach((row) => {
    row.addEventListener("click", () => selectService(row));
    row.addEventListener("mouseenter", () => selectService(row));
  });
}

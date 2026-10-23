import { animate, stagger } from "https://cdn.jsdelivr.net/npm/motion@12.23.24/+esm";

const form = document.querySelector("#booking-form");
const steps = [...document.querySelectorAll("[data-step]")];
const progress = [...document.querySelectorAll("[data-go]")];
const dateGrid = document.querySelector("[data-date-grid]");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let current = 0;

const weekdays = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
const fullDate = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });
for (let offset = 1; offset <= 12; offset += 1) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  if (date.getDay() === 0) continue;
  const iso = date.toISOString().slice(0, 10);
  const label = document.createElement("label");
  label.className = "date-option";
  label.innerHTML = `<input type="radio" name="data" value="${iso}" required><span><small>${weekdays.format(date).replace(".", "")}</small><strong>${date.getDate()}</strong></span>`;
  dateGrid.append(label);
}

const queryService = new URLSearchParams(location.search).get("servico");
if (queryService) {
  const option = [...form.elements.servico].find((input) => input.value === queryService);
  if (option) option.checked = true;
}

function fieldsForStep(index) {
  return [...steps[index].querySelectorAll("input, select, textarea")].filter((field) => field.required);
}

function validateStep(index) {
  const fields = fieldsForStep(index);
  const invalid = fields.find((field) => !field.checkValidity());
  steps[index].querySelector(".booking-error")?.remove();
  if (!invalid) return true;
  const message = document.createElement("p");
  message.className = "booking-error";
  message.setAttribute("role", "alert");
  message.textContent = "Complete esta etapa para continuar.";
  steps[index].querySelector(".step-actions").before(message);
  invalid.reportValidity();
  return false;
}

function showStep(index) {
  current = Math.max(0, Math.min(index, steps.length - 1));
  steps.forEach((step, stepIndex) => {
    const active = stepIndex === current;
    step.hidden = !active;
    step.classList.toggle("is-active", active);
  });
  progress.forEach((item, itemIndex) => item.classList.toggle("is-current", itemIndex === current));
  if (current === 3) updateSummary();
  const active = steps[current];
  if (!reduced) animate(active.querySelectorAll(".step-heading, .service-options, .date-layout, .field-grid, .privacy-check, .booking-summary, .confirmation-note, .step-actions"), { opacity: [0, 1], y: [18, 0] }, { duration: .55, delay: stagger(.06), ease: [0.16, 1, .3, 1] });
  active.querySelector("h2")?.focus?.();
  scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}

function updateSummary() {
  const data = new FormData(form);
  const values = Object.fromEntries(data.entries());
  const parsedDate = values.data ? new Date(`${values.data}T12:00:00`) : null;
  const display = { ...values, data: parsedDate ? fullDate.format(parsedDate) : "—" };
  document.querySelectorAll("[data-summary]").forEach((node) => node.textContent = display[node.dataset.summary] || "—");
}

document.querySelectorAll("[data-next]").forEach((button) => button.addEventListener("click", () => validateStep(current) && showStep(current + 1)));
document.querySelectorAll("[data-back]").forEach((button) => button.addEventListener("click", () => showStep(current - 1)));
progress.forEach((button, index) => button.addEventListener("click", () => { if (index <= current) showStep(index); }));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const date = new Date(`${data.get("data")}T12:00:00`);
  const message = [
    "Olá, Amanda! Gostaria de solicitar um horário.",
    "",
    `Nome: ${data.get("nome")}`,
    `Procedimento: ${data.get("servico")}`,
    `Data de preferência: ${fullDate.format(date)}`,
    `Período: ${data.get("periodo")}`,
    `WhatsApp: ${data.get("telefone")}`,
    `Observação: ${data.get("observacao") || "—"}`,
  ].join("\n");
  location.href = `https://wa.me/message/AJAAIV6XAB5NF1?text=${encodeURIComponent(message)}`;
});

showStep(0);

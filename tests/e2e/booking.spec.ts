import { test, expect, type Page } from '@playwright/test'

const url = (p = '') => `http://127.0.0.1:4175/amanda-teixeira-beauty/${p}`
const phone = () => `(35) 9${String(Math.floor(10000000 + Math.random() * 89999999))}`

async function pickFirstSlot(page: Page, service = 'Design estratégico') {
  await page.goto(url('agendamento'))
  await page.getByRole('button', { name: new RegExp(service) }).click()
  await expect(page.getByRole('heading', { name: 'Escolha o dia' })).toBeVisible()
  const day = page.locator('button[data-day]:not([disabled])').first()
  await expect(day).toBeVisible()
  await day.click()
  await expect(page.getByRole('heading', { name: 'Escolha o horário' })).toBeVisible()
  const slot = page.locator('fieldset button').first()
  const label = await slot.innerText()
  await slot.click()
  return label
}

async function fill(page: Page, name = 'Maria Teste Souza', tel = phone()) {
  await page.getByLabel('Nome completo').fill(name)
  await page.getByLabel('WhatsApp com DDD').fill(tel)
  await page.getByLabel(/Li e aceito/).check()
  await page.getByRole('button', { name: 'Revisar reserva' }).click()
  await expect(page.getByRole('heading', { name: 'Confira e confirme' })).toBeVisible()
}

test('fluxo completo: procedimento, dia, horário, dados, confirmação e código', async ({ page }) => {
  const label = await pickFirstSlot(page)
  // validação: tentar seguir vazio mostra erros perto dos campos
  await page.getByRole('button', { name: 'Revisar reserva' }).click()
  await expect(page.getByText('Escreva nome e sobrenome.')).toBeVisible()
  await expect(page.getByText(/Informe DDD e número/)).toBeVisible()
  await expect(page.getByText(/aceite a política de privacidade/)).toBeVisible()
  await expect(page.getByLabel('Nome completo')).toBeFocused()
  // máscara
  await page.getByLabel('WhatsApp com DDD').fill('35998765432')
  await expect(page.getByLabel('WhatsApp com DDD')).toHaveValue('(35) 99876-5432')
  await fill(page)
  await expect(page.getByText(label).first()).toBeVisible()
  await page.getByRole('button', { name: 'Confirmar agendamento' }).click()
  await expect(page.getByRole('heading', { name: 'Horário reservado' })).toBeVisible()
  await expect(page.getByTestId('codigo')).toHaveText(/^AT-[A-Z2-9]{6}$/)
  await expect(page.getByRole('link', { name: 'Enviar resumo pelo WhatsApp' })).toHaveAttribute('href', /wa\.me/)
})

test('horário reservado some da lista para a próxima cliente', async ({ page }) => {
  const label = await pickFirstSlot(page)
  await fill(page)
  await page.getByRole('button', { name: 'Confirmar agendamento' }).click()
  await expect(page.getByTestId('codigo')).toBeVisible()
  const day = await page.locator('dd').nth(2).innerText()
  await page.goto(url('agendamento?servico=design-estrategico'))
  await page.locator('button[data-day]:not([disabled])').first().click()
  await expect(page.getByRole('heading', { name: 'Escolha o horário' })).toBeVisible()
  // mesmo dia (o primeiro livre) não oferece mais o horário que acabou de ser reservado
  if ((await page.locator('p.first-letter\\:uppercase').first().innerText()).toLowerCase() === day.toLowerCase()) {
    await expect(page.locator('fieldset button', { hasText: label })).toHaveCount(0)
  }
})

test('duas clientes no mesmo horário ao mesmo tempo: só uma consegue', async ({ browser }) => {
  const a = await (await browser.newContext()).newPage()
  const b = await (await browser.newContext()).newPage()
  const la = await pickFirstSlot(a, 'Avaliação individual')
  const lb = await pickFirstSlot(b, 'Avaliação individual')
  expect(la).toBe(lb)
  await fill(a, 'Ana Primeira Silva')
  await fill(b, 'Bia Segunda Lima')
  await Promise.all([
    a.getByRole('button', { name: 'Confirmar agendamento' }).click(),
    b.getByRole('button', { name: 'Confirmar agendamento' }).click(),
  ])
  const okA = await a.getByRole('heading', { name: 'Horário reservado' }).isVisible().catch(() => false)
  await expect(okA ? b.getByRole('alert') : a.getByRole('alert')).toContainText('acabou de ser reservado')
  await expect((okA ? a : b).getByTestId('codigo')).toBeVisible()
})

test('dias passados e domingos ficam bloqueados no calendário', async ({ page }) => {
  await page.goto(url('agendamento?servico=avaliacao'))
  await expect(page.locator('button[data-day]').first()).toBeVisible()
  const disabledSundays = await page.locator('[role=gridcell]:nth-child(7n+8) button[data-day]').evaluateAll((els) => els.every((e) => (e as HTMLButtonElement).disabled))
  expect(disabledSundays).toBe(true)
  await expect(page.getByRole('button', { name: 'Mês anterior' })).toBeDisabled()
})

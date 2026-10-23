import { test, expect } from '@playwright/test'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './mock-supabase.mjs'

const url = (p = '') => `http://127.0.0.1:4175/amanda-teixeira-beauty/${p}`

test('painel exige login; senha errada é recusada', async ({ page }) => {
  await page.goto(url('admin'))
  await expect(page.getByRole('heading', { name: 'Área da Amanda' })).toBeVisible()
  await expect(page.getByText('Agenda do studio')).toHaveCount(0)
  await page.getByLabel('E-mail').fill(ADMIN_EMAIL)
  await page.getByLabel('Senha').fill('errada')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.getByRole('alert')).toContainText('E-mail ou senha incorretos')
})

test('admin entra, vê a reserva, confirma e reagenda @desktop-only', async ({ page, isMobile }) => {
  test.skip(isMobile)
  // cria uma reserva pelo site
  await page.goto(url('agendamento?servico=design-sobrancelhas'))
  await page.locator('button[data-day]:not([disabled])').first().click()
  await page.locator('fieldset button').first().click()
  await page.getByLabel('Nome completo').fill('Cliente Painel Teste')
  await page.getByLabel('WhatsApp com DDD').fill('(35) 98111-2233')
  await page.getByLabel(/Li e aceito/).check()
  await page.getByRole('button', { name: 'Revisar reserva' }).click()
  await page.getByRole('button', { name: 'Confirmar agendamento' }).click()
  const code = await page.getByTestId('codigo').innerText()
  const day = await page.locator('button[data-day]').count() // força espera
  void day

  await page.goto(url('admin'))
  await page.getByLabel('E-mail').fill(ADMIN_EMAIL)
  await page.getByLabel('Senha').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.getByText('Agenda do studio')).toBeVisible()

  await page.getByRole('button', { name: 'Mês' }).click()
  // abre o dia que tem atendimentos
  await page.locator('button[aria-label*="atendimentos"]').filter({ hasText: 'atend.' }).first().click()
  const row = page.locator('tr', { hasText: 'Cliente Painel Teste' })
  await expect(row).toBeVisible()
  await row.getByRole('button', { name: 'Abrir' }).click()
  await expect(page.getByText(`Código ${code}`)).toBeVisible()
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click()
  await expect(row.getByText('Confirmado')).toBeVisible()

  await row.getByRole('button', { name: 'Abrir' }).click()
  await page.getByRole('button', { name: 'Reagendar' }).click()
  const opt = page.locator('td button.tabular-nums').last()
  await expect(opt).toBeVisible()
  const newTime = await opt.innerText()
  await opt.click()
  await expect(page.locator('tr', { hasText: 'Cliente Painel Teste' })).toContainText(newTime)

  await page.getByRole('tab', { name: 'Histórico' }).click()
  await expect(page.getByRole('cell', { name: new RegExp(code) }).first()).toBeVisible()
})

test('procedimento novo cadastrado no painel aparece na agenda pública @desktop-only', async ({ page, isMobile }) => {
  test.skip(isMobile)
  await page.goto(url('admin'))
  await page.getByLabel('E-mail').fill(ADMIN_EMAIL)
  await page.getByLabel('Senha').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.getByRole('tab', { name: 'Procedimentos' }).click()
  await page.getByRole('button', { name: 'Novo procedimento' }).click()
  await page.getByLabel('Nome', { exact: true }).fill('Brow lamination teste')
  await page.getByLabel('Duração (min)').fill('50')
  await page.getByLabel(/Preço/).fill('150,00')
  await page.getByRole('button', { name: 'Salvar' }).click()
  await expect(page.getByRole('status')).toContainText('salvo')
  await page.goto(url('agendamento'))
  const btn = page.getByRole('button', { name: /Brow lamination teste/ })
  await expect(btn).toBeVisible()
  await expect(btn).toContainText('R$ 150,00')
})

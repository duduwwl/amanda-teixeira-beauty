import { test, expect } from '@playwright/test'

// Modo demonstração: sem Supabase, a agenda e o painel funcionam com dados fictícios no navegador.
const url = (p = '') => `http://127.0.0.1:4178/amanda-teixeira-beauty/${p}`

test('demo: aviso visível e reserva completa com código', async ({ page }) => {
  await page.goto(url('agendamento'))
  await expect(page.getByText('Agenda de demonstração.')).toBeVisible()
  await page.getByRole('button', { name: /Brow lamination/ }).click()
  const day = page.locator('button[data-day]:not([disabled])').first()
  await expect(day).toBeVisible()
  await day.click()
  await page.locator('fieldset button').first().click()
  await page.getByLabel('Nome completo').fill('Visitante Demonstração')
  await page.getByLabel('WhatsApp com DDD').fill(`(35) 9${String(Date.now()).slice(-8)}`)
  await page.getByLabel(/Li e aceito/).check()
  await page.getByRole('button', { name: 'Revisar reserva' }).click()
  await page.getByRole('button', { name: 'Confirmar agendamento' }).click()
  await expect(page.getByTestId('codigo')).toHaveText(/^AT-[A-Z2-9]{6}$/)
})

test('demo: agenda já tem horários ocupados e segunda/domingo fechados', async ({ page }) => {
  await page.goto(url('agendamento?servico=nanopigmentacao'))
  await expect(page.locator('button[data-day]').first()).toBeVisible()
  const closed = await page.locator('[role=gridcell]:nth-child(7n+8) button[data-day], [role=gridcell]:nth-child(7n+9) button[data-day]').evaluateAll((els) => els.every((e) => (e as HTMLButtonElement).disabled))
  expect(closed).toBe(true)
})

test('demo: painel com acesso de teste, agenda fictícia e confirmação @desktop-only', async ({ page, isMobile }) => {
  test.skip(isMobile)
  await page.goto(url('admin'))
  await page.getByRole('button', { name: 'Preencher para mim' }).click()
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.getByText('Agenda do studio')).toBeVisible()
  await page.getByRole('button', { name: 'Semana' }).click()
  const pending = page.locator('tr', { hasText: 'Pendente' }).first()
  if (await pending.count()) {
    await pending.getByRole('button', { name: 'Abrir' }).click()
    await page.getByRole('button', { name: 'Confirmar', exact: true }).click()
  }
  await page.getByRole('tab', { name: 'Procedimentos' }).click()
  await expect(page.getByRole('cell', { name: /RegenereHair/ })).toBeVisible()
})

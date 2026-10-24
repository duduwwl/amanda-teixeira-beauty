import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const BASE = '/amanda-teixeira-beauty/'
const url = (p = '') => `http://127.0.0.1:4175${BASE}${p}`

test('landing: título, seções e navegação por âncora', async ({ page, isMobile }) => {
  await page.goto(url())
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('h1')).toContainText('Amanda')
  for (const id of ['sobre', 'procedimentos', 'resultados', 'cursos', 'contato']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1)
  }
  if (isMobile) {
    await page.getByRole('button', { name: /Menu/ }).click()
    const menu = page.getByRole('dialog', { name: 'Menu' })
    await expect(menu).toBeVisible()
    await menu.getByRole('link', { name: 'Procedimentos' }).click()
    await expect(menu).toBeHidden()
  } else {
    await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Procedimentos' }).click()
  }
  await expect(page).toHaveURL(/#procedimentos$/)
  await expect(page.locator('#procedimentos')).toBeInViewport()
})

test('menu do celular: Esc fecha e devolve o foco', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'só no celular')
  await page.goto(url())
  const btn = page.getByRole('button', { name: /Menu/ })
  await btn.click()
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden()
  await expect(btn).toBeFocused()
})

test('procedimentos: a linha abre e o botão leva à agenda com o procedimento', async ({ page }) => {
  await page.goto(url('#procedimentos'))
  const item = page.locator('#procedimentos li').filter({ hasText: 'Nanopigmentação' })
  await item.getByRole('button', { name: /Nanopigmentação/ }).click()
  await expect(item.getByRole('link', { name: 'Agendar Nanopigmentação' })).toBeVisible()
  await item.getByRole('link', { name: 'Agendar Nanopigmentação' }).click()
  await expect(page).toHaveURL(/agendamento\?servico=nanopigmentacao/)
  await expect(page.getByRole('heading', { name: 'Escolha o dia' })).toBeVisible()
})

test('resultados: visor troca de caso pelo índice, setas e filtro', async ({ page }) => {
  await page.goto(url('#resultados'))
  const sec = page.locator('#resultados')
  await expect(sec.getByText(/^1\/\d+$/)).toBeVisible()
  await sec.getByRole('button', { name: 'Próximo caso' }).click()
  await expect(sec.getByText(/^2\/\d+$/)).toBeVisible()
  await sec.getByRole('button', { name: 'Regeneração' }).click()
  await expect(sec.getByText('1/1')).toBeVisible()
  await expect(sec.getByText(/RegenereBrows/).first()).toBeVisible()
})

test('rotas internas funcionam abrindo direto (fallback do GitHub Pages)', async ({ page }) => {
  for (const [path, heading] of [['agendamento', 'Agendar horário'], ['politica-de-privacidade', 'Política de privacidade'], ['termos', 'Termos de uso'], ['admin', 'Área da Amanda']] as const) {
    await page.goto(url(path))
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
    await expect(page).toHaveURL(new RegExp(`${path}$`))
  }
  await page.goto(url('pagina-que-nao-existe'))
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Página não')
})

test('sem rolagem lateral em nenhuma largura @desktop-only', async ({ page, isMobile }) => {
  test.skip(isMobile)
  test.setTimeout(240_000) // 12 larguras × 4 páginas
  for (const w of [320, 360, 375, 390, 414, 768, 820, 1024, 1280, 1440, 1920, 2560]) {
    await page.setViewportSize({ width: w, height: 900 })
    for (const p of ['', 'agendamento', 'admin', 'politica-de-privacidade']) {
      await page.goto(url(p))
      await page.waitForLoadState('networkidle')
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(over, `${w}px /${p}`).toBeLessThanOrEqual(0)
    }
  }
})

test('acessibilidade (axe, WCAG 2.2 AA) nas páginas principais', async ({ page }) => {
  for (const p of ['', 'agendamento', 'admin', 'politica-de-privacidade']) {
    await page.goto(url(p))
    await page.waitForLoadState('networkidle')
    // As entradas são presas à rolagem: abaixo da tela o texto ainda está meio transparente.
    // Mede-se o estado final, que é o que a pessoa lê (e o que aparece com movimento reduzido).
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.waitForTimeout(300)
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    const serious = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`), `/${p}`).toEqual([])
  }
})

test('respeita prefers-reduced-motion: conteúdo visível sem animação', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(url())
  const h = page.locator('#sobre h2')
  await h.scrollIntoViewIfNeeded()
  await expect(h).toHaveCSS('opacity', '1')
  await ctx.close()
})

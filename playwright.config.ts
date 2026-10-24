import { defineConfig, devices } from '@playwright/test'

// Navegador já instalado no ambiente (CHROME_PATH) ou o do Playwright.
const executablePath = process.env.CHROME_PATH || undefined
const launchOptions = { executablePath, args: ['--no-sandbox'] }

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: { launchOptions, trace: 'retain-on-failure', screenshot: 'only-on-failure', locale: 'pt-BR', timezoneId: 'America/Sao_Paulo' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, launchOptions } },
    { name: 'celular', use: { ...devices['Pixel 7'], launchOptions }, grepInvert: /@desktop-only/ },
  ],
  webServer: [
    { command: 'node tests/e2e/mock-supabase.mjs', port: 54321, reuseExistingServer: false },
    {
      command: 'npx vite build --outDir dist-e2e --emptyOutDir && node tests/e2e/gh-pages-server.mjs dist-e2e 4175',
      url: 'http://127.0.0.1:4175/amanda-teixeira-beauty/',
      env: { VITE_SUPABASE_URL: 'http://127.0.0.1:54321', VITE_SUPABASE_ANON_KEY: 'chave-publica-de-teste' },
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      // o mesmo site sem Supabase: a agenda roda em modo demonstração (como no GitHub Pages hoje)
      command: 'npx vite build --outDir dist-demo --emptyOutDir && node tests/e2e/gh-pages-server.mjs dist-demo 4178',
      url: 'http://127.0.0.1:4178/amanda-teixeira-beauty/',
      env: { VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' },
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
})

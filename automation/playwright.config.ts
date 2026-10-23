import fs from 'fs';
import path from 'path';
import { defineConfig, devices } from '@playwright/test';

function loadEnvFile() {
  const file = path.resolve(__dirname, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

const uiBase = process.env.DAM_UI_BASE || process.env.BASE_URL || 'https://dam.rex.lab.reksoft.com';
const apiBase = process.env.DAM_API_BASE || 'http://dam.svc.rex.lab.reksoft.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/,
      use: { baseURL: apiBase },
    },
    {
      name: 'ui',
      testMatch: /ui\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: uiBase,
      },
    },
    {
      name: 'cases',
      testMatch: /by-case\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: uiBase,
      },
    },
  ],
});

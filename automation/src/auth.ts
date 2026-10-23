import { expect, type Page } from '@playwright/test';
import { requiredEnv } from './env';

/**
 * UI login goes through the external IdP, not a DAM OpenAPI route.
 * Selectors are intentionally broad. After the first successful headed run,
 * lock them with `npm run codegen` if the form differs.
 */
export async function loginToLibrary(page: Page): Promise<void> {
  const user = requiredEnv('DAM_USER');
  const password = requiredEnv('DAM_PASSWORD');

  await page.goto('/Library');

  const nextPage = page.getByRole('button', { name: 'Next page' });
  if (await nextPage.isVisible().catch(() => false)) return;

  const passwordBox = page.locator('input[type="password"]').first();
  await passwordBox.waitFor({ state: 'visible', timeout: 20_000 });

  const userBox = page
    .locator(
      'input[type="email"], input[type="text"], input[name="username"], input[name="UserName"], input[name="login"], input[autocomplete="username"]',
    )
    .first();
  await userBox.fill(user);
  await passwordBox.fill(password);

  const submit = page.getByRole('button', { name: /войти|вход|sign in|log in|login|submit/i });
  if (await submit.count()) {
    await submit.first().click();
  } else {
    await passwordBox.press('Enter');
  }

  await page.waitForURL(/\/Library/i, { timeout: 30_000 });
  await expect(nextPage).toBeVisible();
}

import fs from 'fs';
import os from 'os';
import path from 'path';
import { expect, test } from '@playwright/test';
import { LibraryPage } from '../../pages/library.page';
import { loginToLibrary } from '../../src/auth';
import { hasUiAuth } from '../../src/env';

const MIN_JPEG = Buffer.from(
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUQEhIVFhUVFRUVFRUVFRUWFxUVFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGy0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAAEAAQMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAECBQYHB//EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKoAAAAA//Z',
  'base64',
);

test.beforeEach(async ({ page }) => {
  test.skip(!hasUiAuth(), 'Set DAM_USER and DAM_PASSWORD in automation/.env. Do not commit them.');
  await loginToLibrary(page);
});

test('UI-LIB-UPL-01 upload assigns a system category and only that asset is removed', async ({ page }) => {
  test.setTimeout(120_000);
  const library = new LibraryPage(page);
  const fileName = `pw-qa-${Date.now()}.jpg`;
  const filePath = path.join(os.tmpdir(), fileName);
  fs.writeFileSync(filePath, MIN_JPEG);

  try {
    await library.open();
    await expect(library.uploadButton).toBeVisible();
    await library.uploadFile(filePath);

    const confirmation = page.getByText(fileName).or(page.getByText(/успеш/i));
    await expect(confirmation.first()).toBeVisible({ timeout: 60_000 });

    await page.reload();
    await library.search(fileName);
    await library.waitForTotal(1);
    await expect(page.getByText(fileName, { exact: true }).first()).toBeVisible();

    await page.getByText(fileName, { exact: true }).first().click();
    await page.getByRole('tab', { name: 'Категории' }).click();
    await expect(page.getByText(/Изображение|Растровое|Тип файла/).first()).toBeVisible();

    const remove = page.getByRole('button', { name: /^Удалить$/ });
    await expect(remove).toBeVisible();
    await remove.click();
    const confirm = page.getByRole('button', { name: /^(Удалить|Подтвердить|Да)$/ });
    if (await confirm.count()) await confirm.last().click();

    await page.goto('/Library');
    await library.search(fileName);
    await library.waitForTotal(0);
  } finally {
    fs.rmSync(filePath, { force: true });
  }
});

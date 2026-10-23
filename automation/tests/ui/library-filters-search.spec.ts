import { expect, test } from '@playwright/test';
import { expectedPageCount, LibraryPage } from '../../pages/library.page';
import { loginToLibrary } from '../../src/auth';
import { hasUiAuth } from '../../src/env';

test.beforeEach(async ({ page }) => {
  test.skip(!hasUiAuth(), 'Set DAM_USER and DAM_PASSWORD in automation/.env. Do not commit them.');
  await loginToLibrary(page);
});

async function expectNoServerError(page: import('@playwright/test').Page) {
  await expect(page.locator('body')).not.toContainText(/Internal Server Error|Unhandled exception|502 Bad Gateway/i);
}

test('UI-LIB-CAT-01 image category total matches the tree counter', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  const treeCount = await library.treeCount('Изображение');
  const before = await library.totalCount();

  await library.selectCategory('Изображение');
  await library.waitUntilTotalChanges(before);

  await library.waitForTotal(treeCount);
  const size = await library.pageSize();
  expect(await library.visibleResultCount()).toBeLessThanOrEqual(size);
  expect(await library.lastPageNumber()).toBe(expectedPageCount(treeCount, size));
});

test('UI-LIB-CAT-02 child category is not wider than its parent', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  const parent = await library.treeCount('Изображение');
  const child = await library.treeCount('Растровое');

  expect(child).toBeLessThanOrEqual(parent);
  await library.selectCategory('Растровое');
  await library.waitForTotal(child);
});

test('UI-LIB-CAT-03 empty category shows an empty result without a server error', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  const treeCount = await library.treeCount('Мода');
  const before = await library.totalCount();

  await library.selectCategory('Мода');
  if (treeCount === 0) {
    await library.waitUntilTotalChanges(before);
    await library.waitForTotal(0);
  } else {
    await library.waitForTotal(treeCount);
  }
  await expectNoServerError(page);
});

test('UI-LIB-CAT-04 category from another branch does not widen the result', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  const before = await library.totalCount();

  await library.selectCategory('Изображение');
  const images = await library.waitUntilTotalChanges(before);
  await library.selectCategory('Баннеры');
  const combined = await library.totalCount();

  expect(combined).toBeLessThanOrEqual(images);
  await expectNoServerError(page);
});

test('UI-LIB-ROLE-01 non-product account does not receive product assets', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  await expect(library.uploadButton).toContainText(/Непродуктов/);

  const before = await library.totalCount();
  await library.selectCategory('Еда');
  const after = await library.waitUntilTotalChanges(before);

  expect(after, 'непродуктовая учётка не должна получать активы продуктовой категории').toBe(0);
});

test('UI-LIB-SRCH-01 one-character search does not fail', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();

  await library.search('а');
  await expect(page.getByText(/Всего:/)).toBeVisible();
  expect(await library.totalCount()).toBeGreaterThanOrEqual(0);
  await expectNoServerError(page);
});

test('UI-LIB-SRCH-02 filename fragment keeps pagination consistent', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();

  await library.search('jpg');
  await expect.poll(async () => library.totalCount()).toBeGreaterThan(0);
  const total = await library.totalCount();
  const size = await library.pageSize();
  expect(await library.visibleResultCount()).toBeLessThanOrEqual(Math.min(total, size));
  expect(await library.lastPageNumber()).toBe(expectedPageCount(total, size));
});

test('UI-LIB-SRCH-03 unknown query shows an empty result without a server error', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();

  await library.search(`pw-qa-missing-${Date.now()}`);
  await library.waitForTotal(0);
  await expectNoServerError(page);
});

test('UI-LIB-SRCH-04 search stays applied on the next page', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  await library.search('jpg');
  await expect.poll(async () => library.lastPageNumber()).toBeGreaterThan(1);
  const total = await library.totalCount();

  await library.goToPage(2);
  expect(await library.searchBox.inputValue()).toContain('jpg');
  expect(await library.totalCount()).toBe(total);
  expect(await library.currentPageNumber()).toBe(2);
});

test('UI-LIB-SRCH-05 in-files switch can be toggled and restored', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  const before = await library.inFilesSwitch.getAttribute('aria-checked');

  await library.inFilesSwitch.click();
  await expect(library.inFilesSwitch).not.toHaveAttribute('aria-checked', before ?? '');
  await expectNoServerError(page);

  await library.inFilesSwitch.click();
  if (before) await expect(library.inFilesSwitch).toHaveAttribute('aria-checked', before);
});

test('UI-LIB-FIL-01 status filter narrows the library', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  const before = await library.totalCount();

  await library.selectFilter('Создан');
  const after = await library.waitUntilTotalChanges(before);

  expect(after).toBeGreaterThan(0);
  expect(after).toBeLessThan(before);
  expect(await library.visibleResultCount()).toBeLessThanOrEqual(await library.pageSize());
});

test('UI-LIB-FIL-02 tag filter narrows the library', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  const before = await library.totalCount();

  await library.selectFilter('пакет');
  const after = await library.waitUntilTotalChanges(before);

  expect(after).toBeGreaterThan(0);
  expect(after).toBeLessThan(before);
});

test('UI-LIB-FIL-03 date filter controls from the live filters tab are visible', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  await library.openTab('Фильтры');
  const panel = page.getByRole('tabpanel', { name: 'Фильтры' });

  await expect(panel.getByText('Дата изменения', { exact: true })).toBeVisible();
  await expect(panel.getByRole('checkbox', { name: 'Точный' })).toBeVisible();
  await expect(panel.getByRole('checkbox', { name: 'Относительный' })).toBeVisible();
  await expect(panel.getByText('Выберите диапазон')).toBeVisible();
  await expect(panel.getByRole('checkbox', { name: 'Кроме этого периода' })).toBeVisible();
});

test('UI-LIB-FIL-GUIDE-01 user-guide filter controls are present', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  await library.selectFilter('Создан');

  await expect(
    page.getByRole('button', { name: /Сбросить все/i }),
    'Руководство 3.5.1 требует кнопку «Сбросить все» после применения фильтра',
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: /Тип файла/i }),
    'Руководство 3.5.1 описывает самостоятельный фильтр «Тип файла»',
  ).toBeVisible();
  await expect(
    page.getByText('Дата создания', { exact: true }),
    'Руководство 3.5.1 описывает фильтр «Дата создания»',
  ).toBeVisible();
});

test('UI-LIB-COM-01 applied status filter stays on page 2', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  const before = await library.totalCount();
  await library.selectFilter('Создан');
  const filtered = await library.waitUntilTotalChanges(before);
  test.skip(expectedPageCount(filtered, await library.pageSize()) < 2, 'Filtered result has one page');

  await library.goToPage(2);
  expect(await library.totalCount()).toBe(filtered);
  await expect(page.getByRole('tabpanel', { name: 'Фильтры' }).getByRole('checkbox', { name: /^Создан\b/ })).toBeChecked();
});

import { expect, test } from '@playwright/test';
import { expectedPageCount, LibraryPage, type LibraryPageSize } from '../../pages/library.page';
import { loginToLibrary } from '../../src/auth';
import { hasUiAuth } from '../../src/env';

test.beforeEach(async ({ page }) => {
  test.skip(!hasUiAuth(), 'Set DAM_USER and DAM_PASSWORD in automation/.env. Do not commit them.');
  await loginToLibrary(page);
});

test('UI-LIB-PAG-01 first page matches the selected page size', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();

  const total = await library.totalCount();
  const size = await library.pageSize();
  const visible = await library.visibleResultCount();

  expect(visible).toBeGreaterThan(0);
  expect(visible).toBeLessThanOrEqual(size);
  expect(visible).toBe(Math.min(total, size));
  await expect(library.previous).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Current page 1' })).toBeVisible();
  expect(await library.lastPageNumber()).toBe(expectedPageCount(total, size));
});

test('UI-LIB-PAG-02 next and previous change the page and then return', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  test.skip((await library.lastPageNumber()) < 2, 'Stand has only one page');

  await library.goToPage(2);
  expect(await library.currentPageNumber()).toBe(2);

  await library.previous.click();
  await expect(page.getByRole('button', { name: 'Current page 1' })).toBeVisible();
  await expect(library.previous).toBeDisabled();
});

test('UI-LIB-PAG-03 direct page number opens that page', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  const last = await library.lastPageNumber();
  test.skip(last < 4, 'Stand has fewer than 4 pages');

  await library.goToPage(4);
  expect(await library.currentPageNumber()).toBe(4);
  expect(await library.visibleResultCount()).toBeGreaterThan(0);
});

test('UI-LIB-PAG-04 last page disables next and does not exceed the page size', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();

  const total = await library.totalCount();
  const size = await library.pageSize();
  const last = expectedPageCount(total, size);
  await library.goToPage(last);

  await expect(library.next).toBeDisabled();
  const visible = await library.visibleResultCount();
  const remainder = total % size;
  expect(visible).toBe(remainder === 0 ? size : remainder);
});

test('UI-LIB-PAG-05 page size recalculates the last page', async ({ page }) => {
  const library = new LibraryPage(page);
  await library.open();
  const total = await library.totalCount();

  for (const size of [48, 60, 120] as LibraryPageSize[]) {
    await library.changePageSize(size);
    await expect(page.getByRole('button', { name: 'Current page 1' })).toBeVisible();
    expect(await library.lastPageNumber()).toBe(expectedPageCount(total, size));
    expect(await library.visibleResultCount()).toBeLessThanOrEqual(size);
  }
});

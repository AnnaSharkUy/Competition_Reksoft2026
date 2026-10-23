import { expect, type Locator, type Page } from '@playwright/test';

const PAGE_SIZES = [24, 48, 60, 120] as const;
export type LibraryPageSize = (typeof PAGE_SIZES)[number];
export type LibraryTab = 'Категории' | 'Фильтры';

/**
 * Selectors were taken from the live Library page, not from the user-guide wording.
 * The selected page button is "Current page N". Other pages are "Page N".
 * There is no separate first/last control.
 */
export class LibraryPage {
  readonly previous: Locator;
  readonly next: Locator;
  readonly searchBox: Locator;
  readonly inFilesSwitch: Locator;
  readonly uploadButton: Locator;

  constructor(private readonly page: Page) {
    this.previous = page.getByRole('button', { name: 'Previous page' });
    this.next = page.getByRole('button', { name: 'Next page' });
    this.searchBox = page.getByRole('textbox', { name: 'Поиск', exact: true });
    this.inFilesSwitch = page.getByRole('switch');
    this.uploadButton = page.getByRole('button', { name: /Загрузить|Создать/ }).first();
  }

  async open(): Promise<void> {
    await this.page.goto('/Library');
    await expect(this.page.getByText(/Всего:/)).toBeVisible();
  }

  pageButton(pageNumber: number): Locator {
    return this.page.getByRole('button', {
      name: new RegExp(`^(Current page |Page )${pageNumber}$`),
    });
  }

  currentPageButton(): Locator {
    return this.page.getByRole('button', { name: /^Current page \d+$/ });
  }

  async currentPageNumber(): Promise<number> {
    const label = (await this.currentPageButton().first().innerText()).trim();
    const number = Number(label.replace(/\D/g, ''));
    if (!Number.isInteger(number) || number < 1) {
      throw new Error(`Cannot read the selected page number from "${label}"`);
    }
    return number;
  }

  async lastPageNumber(): Promise<number> {
    const labels = await this.page
      .getByRole('button', { name: /^(Current page |Page )\d+$/ })
      .allInnerTexts();
    const numbers = labels
      .map((label) => Number(label.replace(/\D/g, '')))
      .filter((value) => Number.isInteger(value) && value > 0);
    if (!numbers.length) throw new Error('Pagination page buttons were not found');
    return Math.max(...numbers);
  }

  async totalCount(): Promise<number> {
    const text = await this.page.getByText(/Всего:\s*[\d\s]+/).first().innerText();
    const match = text.match(/Всего:\s*([\d\s]+)/);
    if (!match) throw new Error(`Library total counter was not found in "${text}"`);
    return Number(match[1].replace(/\s/g, ''));
  }

  async pageSize(): Promise<LibraryPageSize> {
    const text = await this.page.locator('main').getByRole('combobox').last().innerText();
    const size = Number(text.replace(/\D/g, ''));
    if (!PAGE_SIZES.includes(size as LibraryPageSize)) {
      throw new Error(`Unexpected page size "${text}"`);
    }
    return size as LibraryPageSize;
  }

  async visibleResultCount(): Promise<number> {
    return this.page.locator('main').getByText(/^\d{2}\.\d{2}\.\d{4}$/).count();
  }

  async goToPage(pageNumber: number): Promise<void> {
    await this.pageButton(pageNumber).click();
    await expect(this.page.getByRole('button', { name: `Current page ${pageNumber}` })).toBeVisible();
  }

  async changePageSize(size: LibraryPageSize): Promise<void> {
    const trigger = this.page.locator('main').getByRole('combobox').last();
    await trigger.click();
    const option = this.page.getByRole('option', { name: String(size), exact: true });
    if (await option.count()) {
      await option.first().click();
    } else {
      await this.page.getByText(String(size), { exact: true }).last().click();
    }
    await expect(trigger).toContainText(String(size));
  }

  async openTab(name: LibraryTab): Promise<void> {
    await this.page.getByRole('tab', { name }).click();
    await expect(this.page.getByRole('tabpanel', { name })).toBeVisible();
  }

  async treeCount(name: string): Promise<number> {
    await this.openTab('Категории');
    const text = await this.page.getByRole('tabpanel', { name: 'Категории' }).innerText();
    const lines = text.split(/\n/).map((line) => line.trim()).filter(Boolean);
    const index = lines.findIndex((line) => line === name);
    if (index < 0 || index + 1 >= lines.length) {
      throw new Error(`Category "${name}" was not found in the category tree`);
    }
    const count = Number(lines[index + 1].replace(/\s/g, ''));
    if (!Number.isInteger(count)) {
      throw new Error(`No numeric counter after category "${name}": "${lines[index + 1]}"`);
    }
    return count;
  }

  async selectCategory(name: string): Promise<void> {
    await this.openTab('Категории');
    const panel = this.page.getByRole('tabpanel', { name: 'Категории' });
    const label = panel.getByText(name, { exact: true }).first();
    await expect(label).toBeVisible();
    await label.scrollIntoViewIfNeeded();
    const checkbox = label.locator('xpath=ancestor::*[.//*[@role="checkbox"]][1]').getByRole('checkbox').first();
    await checkbox.click();
  }

  async selectFilter(name: string): Promise<void> {
    await this.openTab('Фильтры');
    const panel = this.page.getByRole('tabpanel', { name: 'Фильтры' });
    const checkbox = panel.getByRole('checkbox', { name: new RegExp(`^${escapeRegExp(name)}\\b`) });
    await expect(checkbox.first()).toBeVisible();
    await checkbox.first().click();
  }

  async search(query: string): Promise<void> {
    await this.searchBox.fill(query);
    await this.searchBox.press('Enter');
  }

  async clearSearch(): Promise<void> {
    await this.search('');
  }

  async waitForTotal(expected: number): Promise<void> {
    await expect.poll(async () => this.totalCount(), { timeout: 15_000 }).toBe(expected);
  }

  async waitUntilTotalChanges(previous: number): Promise<number> {
    await expect.poll(async () => this.totalCount(), { timeout: 15_000 }).not.toBe(previous);
    return this.totalCount();
  }

  /**
   * Attaches a file through the Library upload button.
   * Does not open the account menu and does not touch users or roles.
   */
  async uploadFile(filePath: string): Promise<void> {
    const chooserPromise = this.page.waitForEvent('filechooser', { timeout: 8_000 }).catch(() => null);
    await this.uploadButton.click();
    let chooser = await chooserPromise;
    if (!chooser) {
      const processItem = this.page.getByText(/Непродуктовый/).last();
      const nextChooser = this.page.waitForEvent('filechooser', { timeout: 8_000 });
      await processItem.click();
      chooser = await nextChooser;
    }
    await chooser.setFiles(filePath);
  }
}

export function expectedPageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

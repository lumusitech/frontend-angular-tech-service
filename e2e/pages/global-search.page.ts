import { Page, expect, Locator } from '@playwright/test';

export class GlobalSearchPage {
  readonly searchInput: Locator;
  readonly dropdown: Locator;
  readonly clearButton: Locator;

  constructor(private page: Page) {
    this.searchInput = page.locator('app-global-search input[placeholder*="globalSearch"], app-global-search input').first();
    this.dropdown = page.locator('app-global-search .shadow-lg');
    this.clearButton = page.locator('app-global-search button:has(mat-icon:has-text("close"))');
  }

  async typeQuery(query: string) {
    await this.searchInput.fill(query);
  }

  async clearQuery() {
    await this.clearButton.click();
  }

  async waitForResults() {
    await this.dropdown.waitFor({ state: 'visible' });
  }

  async getResultCount(): Promise<number> {
    return this.page.locator('app-global-search button[class*="text-left"]').count();
  }

  getResultByText(text: string): Locator {
    return this.page.locator(`app-global-search button:has-text("${text}")`);
  }

  getGroupHeader(type: string): Locator {
    return this.page.locator(`app-global-search >> text=${type}`);
  }

  async clickResultByText(text: string) {
    await this.getResultByText(text).first().click();
  }
}

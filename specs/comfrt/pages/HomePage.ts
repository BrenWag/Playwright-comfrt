import { Page, Locator } from '@playwright/test';

// Expone las áreas principales de la home para que los tests interactúen por nombre accesible.
export class HomePage {
  readonly page: Page;

  readonly banner: Locator;
  readonly heroRegion: Locator;
  readonly heroLinks: Locator;
  readonly categoryLinks: Locator;
  readonly shopNowLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    // Regiones y controles principales que confirman que la página inicial terminó de cargar.
    this.banner = page.getByRole('banner');
    this.heroRegion = page.getByRole('main').getByRole('region').first();
    this.heroLinks = this.heroRegion.getByRole('link');
    this.categoryLinks = page.getByRole('link', {
      name: /Hoodies|Blankets|Loungewear|Athleisure|Travel|Kids/i,
    });
    this.shopNowLinks = page.getByRole('link', { name: /Shop Now|Shop Pink/i });
  }

  // Navega a la página inicial usando la URL base configurada en Playwright.
  async goto() {
    await this.page.goto('/', { waitUntil: 'commit' });
  }

  // Espera a que el encabezado y el contenido destacado estén disponibles.
  async waitForPageToLoad() {
    await this.banner.waitFor({ state: 'visible' });
    await this.heroRegion.waitFor({ state: 'visible' });
    await this.heroLinks.first().waitFor({ state: 'visible' });
  }

  // Abre una categoría desde la navegación accesible del sitio.
  async openCategory(categoryName: RegExp) {
    const link = this.page.getByRole('link', { name: categoryName }).first();
    await link.waitFor({ state: 'visible' });
    await link.click();
  }

}

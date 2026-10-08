import { Page, Locator } from '@playwright/test';

// Expone las áreas principales de la home para que los tests interactúen por nombre accesible.
export class HomePage {
  readonly page: Page;

  readonly banner: Locator;
  readonly heroHeading: Locator;
  readonly categoryLinks: Locator;
  readonly shopNowLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    // Elementos principales que confirman que la página inicial terminó de cargar.
    this.banner = page.getByRole('banner');
    this.heroHeading = page.getByRole('heading', {
      name: /Tracking: New Camo|New Cozy Layers|Pink With Purpose/i,
    }).first();
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
    await this.heroHeading.waitFor({ state: 'visible' });
  }

  // Abre una categoría desde la navegación accesible del sitio.
  async openCategory(categoryName: RegExp) {
    const link = this.page.getByRole('link', { name: categoryName }).first();
    await link.waitFor({ state: 'visible' });
    await link.click();
  }

  // Abre una tarjeta de producto identificada por su nombre visible.
  async openFeaturedProduct(productName: string) {
    const productLink = this.page.getByRole('link', { name: new RegExp(productName, 'i') }).first();
    await productLink.waitFor({ state: 'visible' });
    await productLink.click();
  }
}

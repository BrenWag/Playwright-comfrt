import { Page, Locator, expect } from '@playwright/test';

// Encapsula la información y las acciones principales de la página de producto (PDP).
export class ProductPage {
  readonly page: Page;

  readonly productInfo: Locator;
  readonly productTitle: Locator;
  readonly priceText: Locator;
  readonly sizeLinks: Locator;
  readonly colorLinks: Locator;
  readonly addToCartButton: Locator;
  readonly cartDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    // Limitar los datos a esta región evita coincidencias con menú, drawer o contenido relacionado.
    this.productInfo = page.getByRole('region', { name: 'Product Info' });
    this.productTitle = page.getByRole('heading', { name: 'Teddy Full Zip Jacket', exact: true, level: 1 });
    // El mismo precio también aparece dentro del CTA; usamos la primera coincidencia, que es el precio del producto.
    this.priceText = this.productInfo.getByText('$49', { exact: true }).first();
    this.sizeLinks = this.productInfo.getByRole('link', { name: /^(XS|S|M|L|XL|2X|3X)$/i });
    this.colorLinks = this.productInfo.getByRole('link', { name: /^(Alpine|Espresso|Onyx Black|Houndstooth)$/i });
    this.addToCartButton = this.productInfo.getByRole('button', { name: /^Add to Cart\b/i }).first();
    this.cartDialog = page.getByRole('dialog', { name: /Shopping cart/i });
  }

  // Abre un producto a partir de su identificador de URL.
  async goto(slug: string) {
    await this.page.goto(`/products/${slug}`, { waitUntil: 'commit' });
  }

  // Espera título y precio para evitar validar una PDP que todavía está cargando.
  async waitForProductToLoad() {
    await this.productTitle.waitFor({ state: 'visible' });
    await this.priceText.waitFor({ state: 'visible' });
  }

  // Cierra el popup promocional si aparece y puede interferir con los controles del producto.
  async dismissFloatingPopup() {
    // Comfrt usa overlays promocionales que pueden interceptar clics. Los cerramos antes de interactuar con el CTA.
    const closeButtons = this.page.getByRole('button', { name: /Close popup|Close minimized popup/i });
    const closeButton = closeButtons.first();

    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.scrollIntoViewIfNeeded();
      await closeButton.evaluate((element) => {
        (element as HTMLElement).click();
      });
      await expect(closeButton).toBeHidden({ timeout: 3000 });
    }
  }

  // Deja el CTA visible y habilitado antes de que el test intente usarlo.
  async waitUntilAddToCartIsReady() {
    await this.dismissFloatingPopup();
    await this.addToCartButton.scrollIntoViewIfNeeded();
    await expect(this.addToCartButton).toBeEnabled({ timeout: 15000 });
  }

  // Selecciona la talla solicitada si está disponible para este producto.
  async selectSize(size: string) {
    const sizeGroup = this.productInfo.getByRole('group', { name: /Teddy Full Zip Jacket Size/i });
    const sizeLink = sizeGroup.getByRole('link', { name: size, exact: true });
    await sizeLink.click({ noWaitAfter: true });
    await expect(sizeGroup.getByRole('radio', { name: size, exact: true })).toBeChecked();
  }

  // Selecciona el color solicitado si está disponible para este producto.
  async selectColor(color: string) {
    const colorGroups = this.productInfo.getByRole('group', { name: /Teddy Full Zip Jacket Color/i });

    for (let index = 0; index < await colorGroups.count(); index += 1) {
      const colorGroup = colorGroups.nth(index);
      const colorLink = colorGroup.getByRole('link', { name: color, exact: true });

      if (await colorLink.isVisible().catch(() => false)) {
        await colorLink.click({ noWaitAfter: true });
        await expect(colorGroup.getByRole('radio', { name: color, exact: true })).toBeChecked();
        return;
      }
    }

    throw new Error(`No se encontró el color "${color}" en las opciones del producto.`);
  }

  // Agrega el producto y confirma que el drawer del carrito muestre la línea esperada.
  async addToCart() {
    // Esperamos a que el botón esté habilitado y al overlay ya no bloquee la interacción.
    await this.waitUntilAddToCartIsReady();
    await this.addToCartButton.scrollIntoViewIfNeeded();
    await this.addToCartButton.click({ force: true });
    await expect(this.cartDialog).toContainText(/Teddy Full Zip Jacket/i, { timeout: 15000 });
  }
}

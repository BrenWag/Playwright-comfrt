import { Page, Locator, expect } from '@playwright/test';

// Encapsula la información y las acciones principales de la página de producto (PDP).
export class ProductPage {
  readonly page: Page;

  readonly productInfo: Locator;
  readonly sizeGroup: Locator;
  readonly colorGroups: Locator;
  readonly sizeLinks: Locator;
  readonly colorLinks: Locator;
  readonly addToCartButton: Locator;
  readonly cartCheckoutButton: Locator;
  readonly tryYourLuckDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    // Acota las acciones al componente de compra principal, sin depender del nombre ni del precio del producto.
    this.productInfo = page.getByRole('region', { name: 'Product Info' });
    this.sizeGroup = this.productInfo.getByRole('group', { name: /Size/i }).first();
    this.colorGroups = this.productInfo.getByRole('group', { name: /Color/i });
    this.sizeLinks = this.sizeGroup.getByRole('link');
    this.colorLinks = this.colorGroups.getByRole('link');
    this.addToCartButton = this.productInfo.getByRole('button', { name: /^Add to Cart\b/i }).first();
    this.cartCheckoutButton = page.getByRole('main').getByRole('button', { name: 'Checkout', exact: true });
    this.tryYourLuckDialog = page.getByRole('dialog').filter({ hasText: /Try Your Luck/i });
  }

  // Abre un producto a partir de su identificador de URL.
  async goto(slug: string) {
    await this.page.addLocatorHandler(this.tryYourLuckDialog, async () => {
      await this.closeTryYourLuckDialog();
    });
    await this.page.goto(`/products/${slug}`, { waitUntil: 'commit' });
  }

  // Espera los componentes funcionales de compra, sin depender de contenido comercial variable.
  async waitForProductToLoad() {
    await this.closeTryYourLuckDialogIfVisible();
    await this.productInfo.waitFor({ state: 'visible' });
    await this.sizeLinks.first().waitFor({ state: 'visible' });
    await this.colorLinks.first().waitFor({ state: 'visible' });
    await this.addToCartButton.waitFor({ state: 'visible' });
    await this.closeTryYourLuckDialogIfVisible();
  }

  // Cierra solamente el modal Try Your Luck, sin afectar otros diálogos del storefront.
  async closeTryYourLuckDialogIfVisible() {
    if (await this.tryYourLuckDialog.isVisible().catch(() => false)) {
      await this.closeTryYourLuckDialog();
    }
  }

  private async closeTryYourLuckDialog() {
    const closeButton = this.tryYourLuckDialog.getByRole('button', { name: /Close popup/i });
    await closeButton.click();
    await expect(this.tryYourLuckDialog).toBeHidden({ timeout: 5000 });
  }

  // Deja el CTA visible y habilitado antes de que el test intente usarlo.
  async waitUntilAddToCartIsReady() {
    await this.closeTryYourLuckDialogIfVisible();
    await this.addToCartButton.scrollIntoViewIfNeeded();
    await expect(this.addToCartButton).toBeEnabled({ timeout: 15000 });
  }

  // Elige una opción de talla disponible sin fijar una etiqueta comercial concreta.
  async selectAvailableSize() {
    const selected = await this.selectAvailableOption(this.sizeGroup);
    expect(selected, 'Debe haber al menos una talla disponible').toBe(true);
  }

  // Elige una opción de color disponible en cualquiera de los grupos del producto.
  async selectAvailableColor() {
    for (let index = 0; index < await this.colorGroups.count(); index += 1) {
      if (await this.selectAvailableOption(this.colorGroups.nth(index))) {
        return;
      }
    }

    throw new Error('No se encontró una opción de color disponible en la PDP.');
  }

  // Comprueba la selección con el radio accesible y activa el link asociado si hace falta.
  private async selectAvailableOption(group: Locator) {
    const optionLinks = group.getByRole('link');
    const optionRadios = group.getByRole('radio');
    const optionCount = Math.min(await optionLinks.count(), await optionRadios.count());
    let selectedOption: Locator | undefined;

    for (let index = 0; index < optionCount; index += 1) {
      const optionLink = optionLinks.nth(index);
      const optionRadio = optionRadios.nth(index);

      if (!(await optionRadio.isEnabled().catch(() => false))) {
        continue;
      }

      if (await optionRadio.isChecked()) {
        selectedOption ??= optionRadio;
        continue;
      }

      if (await optionLink.isVisible().catch(() => false)) {
        await optionLink.click({ noWaitAfter: true });
        await expect(optionRadio).toBeChecked();
        return true;
      }
    }

    return Boolean(selectedOption);
  }

  // Activa por teclado una opción de color para validar el flujo accesible sin depender de su nombre.
  async selectColorWithKeyboard() {
    for (let groupIndex = 0; groupIndex < await this.colorGroups.count(); groupIndex += 1) {
      const group = this.colorGroups.nth(groupIndex);
      const optionLinks = group.getByRole('link');
      const optionRadios = group.getByRole('radio');
      const optionCount = Math.min(await optionLinks.count(), await optionRadios.count());

      for (let optionIndex = 0; optionIndex < optionCount; optionIndex += 1) {
        const optionLink = optionLinks.nth(optionIndex);
        const optionRadio = optionRadios.nth(optionIndex);

        if (await optionRadio.isEnabled().catch(() => false) && await optionLink.isVisible().catch(() => false)) {
          await optionLink.focus();
          await this.page.keyboard.press('Enter');
          await expect(optionRadio).toBeChecked();
          return;
        }
      }
    }

    throw new Error('No se encontró una opción de color para validar la navegación por teclado.');
  }

  // Agrega el producto y confirma que el drawer del carrito muestre la línea esperada.
  async addToCart() {
    // Esperamos a que el botón esté habilitado y al overlay ya no bloquee la interacción.
    await this.waitUntilAddToCartIsReady();
    await this.addToCartButton.scrollIntoViewIfNeeded();
    await this.addToCartButton.click();
    await this.closeTryYourLuckDialogIfVisible();
    await this.page.goto('/cart', { waitUntil: 'commit' });
    await expect(this.cartCheckoutButton).toBeEnabled({ timeout: 15000 });
  }
}

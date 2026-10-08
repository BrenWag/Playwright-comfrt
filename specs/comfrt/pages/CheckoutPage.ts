import { Page, Locator, expect } from '@playwright/test';

// Reúne las acciones disponibles para avanzar desde el carrito al checkout.
export class CheckoutPage {
  readonly page: Page;

  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Coincidencia exacta para no tomar botones con nombres parecidos.
    this.checkoutButton = page.getByRole('button', { name: 'Checkout', exact: true });
  }

  // Abre la ruta de checkout para los escenarios que prueban esa navegación.
  async goto() {
    await this.page.goto('/checkout', { waitUntil: 'commit' });
  }

  // Intenta avanzar solo si el botón está disponible en la página actual.
  async continue() {
    if (await this.checkoutButton.isVisible().catch(() => false)) {
      await this.checkoutButton.click();
    }
  }

  // Con carrito vacío, el sitio debe mantener deshabilitado el avance a checkout.
  async expectCheckoutBlocked() {
    await this.checkoutButton.waitFor({ state: 'visible' });
    await expect(this.checkoutButton).toBeDisabled();
  }
}

import { Page, Locator, expect } from '@playwright/test';

// Centraliza las comprobaciones del carrito para reutilizarlas en smoke y regresión.
export class CartPage {
  readonly page: Page;

  readonly emptyCartMessage: Locator;
  readonly emptyCartSubtotal: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Estos dos elementos representan el estado vacío que muestra la página del carrito.
    this.emptyCartMessage = page.getByRole('heading', { name: 'Cart', exact: true });
    this.emptyCartSubtotal = page.getByText('Subtotal (0 item)', { exact: true });
    this.checkoutButton = page.getByRole('main').getByRole('button', { name: 'Checkout', exact: true });
  }

  // Abre la página del carrito para validar su estado actual.
  async goto() {
    await this.page.goto('/cart', { waitUntil: 'commit' });
  }

  // Confirma que el título y el subtotal indiquen que no hay productos cargados.
  async expectEmptyState() {
    await this.emptyCartMessage.waitFor({ state: 'visible' });
    await expect(this.emptyCartSubtotal).toBeVisible();
  }

  // Confirma que el carrito permita continuar cuando ya contiene un producto.
  async expectHasItems() {
    await expect(this.checkoutButton).toBeEnabled();
  }
}

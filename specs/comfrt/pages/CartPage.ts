import { Page, Locator, expect } from '@playwright/test';

// Centraliza las comprobaciones del carrito para reutilizarlas en smoke y regresión.
export class CartPage {
  readonly page: Page;

  readonly cartItem: Locator;
  readonly emptyCartMessage: Locator;
  readonly emptyCartSubtotal: Locator;

  constructor(page: Page) {
    this.page = page;
    // El enlace identifica una línea de producto, sin confundirla con texto de otros componentes.
    this.cartItem = page.getByRole('link', { name: /Teddy Full Zip Jacket/i }).first();
    // Estos dos elementos representan el estado vacío que muestra la página del carrito.
    this.emptyCartMessage = page.getByRole('heading', { name: 'Cart', exact: true });
    this.emptyCartSubtotal = page.getByText('Subtotal (0 item)', { exact: true });
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

  // Confirma que el producto esperado se muestre como una línea del carrito.
  async expectItemVisible() {
    await this.cartItem.waitFor({ state: 'visible' });
  }
}

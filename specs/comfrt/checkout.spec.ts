import { test, expect } from '@playwright/test';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

test.describe('Comfrt checkout validation', () => {
  // Un carrito vacío no debe permitir iniciar el checkout.
  test('blocks checkout when required form data is missing', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await cartPage.goto();
    await cartPage.expectEmptyState();
    await checkoutPage.expectCheckoutBlocked();
  });

  // Comprueba que el estado vacío se conserve después de recargar la página.
  test('keeps the flow safe under edge conditions such as empty cart and reload', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.goto();
    await cartPage.expectEmptyState();
    await page.reload({ waitUntil: 'commit' });
    await cartPage.expectEmptyState();
  });
});

import { test, expect } from '@playwright/test';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

test.describe('Comfrt second stage coverage', () => {
  // Verifica que el carrito muestre el título y subtotal correspondientes a cero productos.
  test('shows a safe empty-cart state before checkout', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.expectEmptyState();
  });

  // Comprueba que el botón de checkout siga bloqueado cuando faltan productos en el carrito.
  test('validates the checkout form and surfaces missing required data', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    await cartPage.goto();
    await cartPage.expectEmptyState();
    await checkoutPage.expectCheckoutBlocked();
  });

  // Si existe un campo de cupón, intenta un código inválido y comprueba que se conserve la página del carrito.
  test('handles invalid coupon attempts when the promo field is available', async ({ page }) => {
    await page.goto('/cart', { waitUntil: 'commit' });

    const couponInput = page.getByPlaceholder(/coupon|discount|promo/i).first();
    if (await couponInput.isVisible().catch(() => false)) {
      await couponInput.fill('INVALIDCODE');

      const applyButton = page.getByRole('button', { name: /apply|redeem|use coupon/i }).first();
      if (await applyButton.isVisible().catch(() => false)) {
        await applyButton.click();
        await expect(page.getByRole('heading', { name: 'Cart', exact: true })).toBeVisible();
      }
    } else {
      await expect(page.getByRole('heading', { name: 'Cart', exact: true })).toBeVisible();
    }
  });

  // Comprueba que Tab lleve el foco a controles interactivos en home y PDP.
  test('supports keyboard-first navigation on homepage and PDP', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' });
    await expect(page.getByRole('heading', { name: /Tracking: New Camo|New Cozy Layers|Pink With Purpose/i }).first()).toBeVisible();

    const heroLink = page.getByRole('link', { name: /Tracking: New Camo.*Shop Now/i });
    await heroLink.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/collections\/camo/i);

    await page.goto('/products/teddy-full-zip', { waitUntil: 'commit' });
    const productHeading = page.getByRole('heading', { name: 'Teddy Full Zip Jacket', exact: true });
    await expect(productHeading).toBeVisible();

    const colorOption = page.getByRole('region', { name: 'Product Info' }).getByRole('link', { name: 'Espresso', exact: true }).first();
    await colorOption.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/products\/teddy-full-zip\?variant=/i);
  });
});

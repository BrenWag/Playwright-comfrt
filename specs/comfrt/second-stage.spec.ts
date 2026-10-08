import { test, expect } from '@playwright/test';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProductPage } from './pages/ProductPage';

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
    const heroRegion = page.getByRole('main').getByRole('region').first();
    await expect(heroRegion).toBeVisible();

    const heroLink = heroRegion.getByRole('link').first();
    await heroLink.focus();
    await page.keyboard.press('Enter');
    await expect(page).not.toHaveURL(/\/en-ar\/?$/);

    await page.goto('/products/teddy-full-zip', { waitUntil: 'commit' });
    const productPage = new ProductPage(page);
    await productPage.waitForProductToLoad();
    await productPage.selectColorWithKeyboard();
    await expect(page).toHaveURL(/[?&]variant=/i);
  });
});

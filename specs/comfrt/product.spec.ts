import { test, expect } from '@playwright/test';
import { ProductPage } from './pages/ProductPage';

test.describe('Comfrt product experience', () => {
  // Comprueba que el panel de compra, las variantes y el CTA estén disponibles.
  test('shows the product purchase controls', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.goto('teddy-full-zip');
    await productPage.waitForProductToLoad();

    await expect(productPage.productInfo).toBeVisible();
    await expect(productPage.colorLinks.first()).toBeVisible();
    await expect(productPage.sizeLinks.first()).toBeVisible();
    await expect(productPage.addToCartButton).toBeVisible();
  });

  // Recorre una compra válida: elige una variante, agrega el producto y verifica el drawer.
  test('allows choosing a valid variant and adding it to the cart', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.goto('teddy-full-zip');
    await productPage.waitForProductToLoad();

    await productPage.selectAvailableSize();
    await productPage.selectAvailableColor();
    await productPage.addToCart();
  });
});

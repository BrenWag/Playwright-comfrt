import { test, expect } from '@playwright/test';
import { ProductPage } from './pages/ProductPage';

test.describe('Comfrt product experience', () => {
  // Comprueba que el nombre, el precio y las opciones de variante estén visibles en la PDP.
  test('shows the product details and variant selection', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.goto('teddy-full-zip');
    await productPage.waitForProductToLoad();

    await expect(productPage.productTitle).toBeVisible();
    await expect(productPage.priceText).toBeVisible();
    await expect(productPage.colorLinks.first()).toBeVisible();
    await expect(productPage.sizeLinks.filter({ hasText: /^M$/i }).first()).toBeVisible();
  });

  // Recorre una compra válida: elige una variante, agrega el producto y verifica el drawer.
  test('allows choosing a valid variant and adding it to the cart', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.goto('teddy-full-zip');
    await productPage.waitForProductToLoad();

    await productPage.selectSize('M');
    await productPage.selectColor('Espresso');
    await productPage.addToCart();
  });
});

import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

test.describe('Smoke de Comfrt', () => {
  test('Smoke: home carga y navegación principal', async ({ page }) => {
    const homePage = new HomePage(page);

    // Paso 1: abrir la home y dejarla lista para validar contenido visible.
    await test.step('Abrir la home de Comfrt', async () => {
      await homePage.goto();
    });

    // Paso 2: confirmar que la interfaz principal está presente y operativa.
    await test.step('Validar banner, hero y categorías principales', async () => {
      await homePage.waitForPageToLoad();
      await expect(homePage.banner).toBeVisible();
      await expect(homePage.heroHeading).toBeVisible();
      await expect(homePage.categoryLinks.first()).toBeVisible();
    });

    // Paso 3: comprobar que la navegación desde la home lleva a una categoría real.
    await test.step('Entrar a una categoría desde la home', async () => {
      await homePage.openCategory(/Hoodies/i);
      await expect(page).not.toHaveURL(/\/en-ar\/?$/);
    });
  });

  test('Smoke: PDP carga producto y el CTA queda habilitado', async ({ page }) => {
    const productPage = new ProductPage(page);

    // Paso 1: abrir la PDP del producto destacado.
    await test.step('Abrir la PDP del producto destacado', async () => {
      await productPage.goto('teddy-full-zip');
    });

    // Paso 2: validar que la información del producto está disponible.
    await test.step('Confirmar que la página carga con nombre, precio y variantes', async () => {
      await productPage.waitForProductToLoad();
      await expect(productPage.productTitle).toBeVisible();
      await expect(productPage.priceText).toBeVisible();
    });

    // Paso 3: elegir una combinación válida para asegurar que la compra queda habilitada.
    await test.step('Seleccionar talla y color válidos', async () => {
      await productPage.selectSize('M');
      await productPage.selectColor('Alpine');
      await productPage.waitUntilAddToCartIsReady();
      await expect(productPage.addToCartButton).toBeEnabled({ timeout: 15000 });
    });

    // Paso 4: validar la intención de compra sin depender del drawer del carrito, que aplica overlays promocionales y puede ser inestable en smoke.
    await test.step('Validar que el botón de compra está listo para el flujo principal', async () => {
      await expect(productPage.addToCartButton).toContainText(/Add to Cart/i);
    });
  });

  test('Smoke: carrito vacío y checkout bloquea errores', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Paso 1: abrir la vista del carrito.
    await test.step('Abrir el carrito', async () => {
      await cartPage.goto();
    });

    // Paso 2: validar que el estado del carrito es seguro y no rompe la compra.
    await test.step('Verificar el estado vacío del carrito', async () => {
      await cartPage.expectEmptyState();
    });

    // Paso 3: confirmar que el checkout no se habilita mientras el carrito está vacío.
    await test.step('Confirmar que el checkout está bloqueado con el carrito vacío', async () => {
      await cartPage.goto();
      await cartPage.expectEmptyState();
      await checkoutPage.expectCheckoutBlocked();
    });
  });
});

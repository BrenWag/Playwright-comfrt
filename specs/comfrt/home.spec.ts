import { test, expect } from '@playwright/test';

test.describe('Comfrt home flow', () => {
  // Verifica título, banner, contenido destacado y enlaces de categorías de la página inicial.
  test('loads the home page and renders the main sections', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' });

    await expect(page).toHaveTitle(/Comfrt/i);
    await expect(page.getByRole('banner')).toBeVisible();

    await expect(
      page.getByRole('heading', { name: /Tracking: New Camo|New Cozy Layers|Pink With Purpose/i }).first(),
    ).toBeVisible();

    const categoryLinks = page.getByRole('link', {
      name: /Hoodies|Blankets|Loungewear|Athleisure|Travel|Kids/i,
    });

    await expect(categoryLinks.first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Shop Now|Shop Pink/i }).first()).toBeVisible();
  });

  // Comprueba que una categoría accesible lleva a su colección, no que el clic solo haya ocurrido.
  test('allows browsing product categories from the home page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' });

    const categoryLink = page.getByRole('link', { name: /Hoodies|Blankets|Loungewear|Athleisure|Travel|Kids/i }).first();
    await expect(categoryLink).toBeVisible();
    await categoryLink.click();

    await expect(page).toHaveURL(/\/collections\/(hoodies|blankets|loungewear|athleisure|travel|kids)/i);
  });
});

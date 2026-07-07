import { test, expect } from '@playwright/test';

test.describe('UI/UX Audit for Frontend Web App (Port 3000)', () => {
  test('Audit Homepage for broken images and console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const brokenImages: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('load');

    // Check all images
    const images = page.locator('img');
    const imgCount = await images.count();
    for (let i = 0; i < imgCount; i++) {
      const img = images.nth(i);
      const isLoaded = await img.evaluate((el: HTMLImageElement) => {
        return el.complete && typeof el.naturalWidth !== 'undefined' && el.naturalWidth > 0;
      });
      if (!isLoaded) {
        const src = await img.getAttribute('src');
        brokenImages.push(src || `Index: ${i}`);
      }
    }

    console.log('--- HOMEPAGE AUDIT RESULT ---');
    console.log('Console Errors:', consoleErrors);
    console.log('Broken Images:', brokenImages);

    expect(consoleErrors).toEqual([]);
    expect(brokenImages).toEqual([]);
  });

  test('Audit Doctors Page for broken images and filters', async ({ page }) => {
    const consoleErrors: string[] = [];
    const brokenImages: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });
    page.on('response', response => {
      if (response.status() >= 400) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('http://localhost:3000/doctors');
    await page.waitForTimeout(2000); // Allow doctors to load from API

    // Check all images
    const images = page.locator('img');
    const imgCount = await images.count();
    for (let i = 0; i < imgCount; i++) {
      const img = images.nth(i);
      const isLoaded = await img.evaluate((el: HTMLImageElement) => {
        return el.complete && typeof el.naturalWidth !== 'undefined' && el.naturalWidth > 0;
      });
      if (!isLoaded) {
        const src = await img.getAttribute('src');
        brokenImages.push(src || `Index: ${i}`);
      }
    }

    console.log('--- DOCTORS PAGE AUDIT RESULT ---');
    console.log('Console Errors:', consoleErrors);
    console.log('Failed Requests:', failedRequests);
    console.log('Broken Images:', brokenImages);

    expect(failedRequests).toEqual([]);
    expect(consoleErrors).toEqual([]);
    expect(brokenImages).toEqual([]);
  });
});

test.describe('UI/UX Audit for Admin App (Port 3001)', () => {
  test('Audit Admin Login & Dashboard access', async ({ page }) => {
    const consoleErrors: string[] = [];
    const brokenImages: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    await page.goto('http://localhost:3001/');
    await page.waitForLoadState('load');

    // Check images on Login page
    const images = page.locator('img');
    const imgCount = await images.count();
    for (let i = 0; i < imgCount; i++) {
      const img = images.nth(i);
      const isLoaded = await img.evaluate((el: HTMLImageElement) => {
        return el.complete && typeof el.naturalWidth !== 'undefined' && el.naturalWidth > 0;
      });
      if (!isLoaded) {
        const src = await img.getAttribute('src');
        brokenImages.push(src || `Index: ${i}`);
      }
    }

    console.log('--- ADMIN LOGIN AUDIT RESULT ---');
    console.log('Console Errors:', consoleErrors);
    console.log('Broken Images:', brokenImages);

    expect(consoleErrors).toEqual([]);
    expect(brokenImages).toEqual([]);
  });
});

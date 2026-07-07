import { test, expect } from '@playwright/test';

test('Frontend homepage loads successfully', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/NewCare/);
});

test('Doctors page loads successfully', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  await page.goto('/doctors');
  // Wait for loading to finish
  await page.waitForTimeout(2000);
  await expect(page.locator('h1:has-text("Find Your Doctor")')).toBeVisible();
  
  // Verify that we have loaded actual doctors (filtered count should not be 0)
  const countText = await page.locator('p:has-text("Showing") strong').innerText();
  console.log('Seeded doctors count displayed on page:', countText);
  expect(Number(countText)).toBeGreaterThan(0);
});

test('Admin dashboard loads successfully', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  await page.goto('http://localhost:3001');
  await expect(page).toHaveTitle(/Admin/);
});

test('Backend API returns doctor list', async ({ request }) => {
  const response = await request.get('http://localhost:8000/api/doctor/list');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.success).toBeTruthy();
  expect(data.doctors).toBeDefined();
  expect(data.doctors.length).toBeGreaterThan(0);
});


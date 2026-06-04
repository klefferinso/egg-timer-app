import { expect, test } from '@playwright/test';

// 🥚 Egg Timer App Tests

test.describe('Welcome Screen', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the welcome title', async ({ page }) => {
    await expect(page.getByText('What do you wanna cook today?')).toBeVisible();
  });

  test('shows all 4 egg options', async ({ page }) => {
    await expect(page.getByText('Hard Boiled').first()).toBeVisible();
    await expect(page.getByText('Soft Boiled').first()).toBeVisible();
    await expect(page.getByText('Sunny Side Up').first()).toBeVisible();
    await expect(page.getByText('Scrambled').first()).toBeVisible();
  });

  test('shows correct cook times', async ({ page }) => {
    await expect(page.getByText('10 min')).toBeVisible();
    await expect(page.getByText('6 min')).toBeVisible();
    await expect(page.getByText('3 min')).toBeVisible();
    await expect(page.getByText('4 min')).toBeVisible();
  });

});

test.describe('Timer Screen', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText('Hard Boiled').first().click();
  });

  test('shows correct egg name on timer screen', async ({ page }) => {
    await expect(page.getByText('Hard Boiled').nth(1)).toBeVisible();
  });

  test('shows 10:00 as starting time for hard boiled', async ({ page }) => {
    await expect(page.getByText('10:00')).toBeVisible();
  });

  test('shows Start button', async ({ page }) => {
    await expect(page.getByText('Start', { exact: true })).toBeVisible();
  });

  test('shows Reset button', async ({ page }) => {
    await expect(page.getByText('Reset', { exact: true })).toBeVisible();
  });

  test('timer changes to Resume after clicking Pause', async ({ page }) => {
    await page.goto('http://localhost:8081/timer?name=Hard%20Boiled&seconds=600&icon=hard&tip=Drop%20egg%20in%20boiling%20water');
    await expect(page.getByText('10:00')).toBeVisible();

    await page.waitForTimeout(1000);
    await page.getByText('Start', { exact: true }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Pause', { exact: true }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText('Resume', { exact: true })).toBeVisible({ timeout: 10000 });
  });

});

test.describe('Each Egg Type', () => {

  test('Soft Boiled shows 6:00', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Soft Boiled').first().click();
    await expect(page.getByText('6:00')).toBeVisible();
  });

  test('Sunny Side Up shows 3:00', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Sunny Side Up').first().click();
    await expect(page.getByText('3:00')).toBeVisible();
  });

  test('Scrambled shows 4:00', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Scrambled').first().click();
    await expect(page.getByText('4:00')).toBeVisible();
  });

});
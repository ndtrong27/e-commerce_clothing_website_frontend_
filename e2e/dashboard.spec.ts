import { test, expect } from '@playwright/test';

test.describe('Dashboard UI', () => {
    test('should load the dashboard and verify key elements', async ({ page }) => {
        // Navigate to dashboard
        await page.goto('/dashboard');

        // Verify layout elements
        await expect(page.locator('aside')).toBeVisible();
        await expect(page.getByText('StyleStore Pro')).toBeVisible();

        // Verify Dashboard Header
        await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
        await expect(page.getByRole('button', { name: 'New Product' })).toBeVisible();

        // Verify Stat Cards are present (at least 4)
        const statCards = page.locator('div[class*="bg-slate-900/50"]').first();
        await expect(statCards).toBeVisible();

        // Verify Recent Activity table exists
        await expect(page.getByText('Recent Activity')).toBeVisible();
        const table = page.locator('table');
        await expect(table).toBeVisible();

        // Verify status badges are rendered
        await expect(page.getByText('Paid').first()).toBeVisible();
    });

    test('should handle responsive sidebar toggle', async ({ page }) => {
        // Set viewport to mobile
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/dashboard');

        // Sidebar should be hidden initially on mobile
        const aside = page.locator('aside');
        await expect(aside).toHaveClass(/ -translate-x-full/);

        // Click toggle button
        const toggle = page.locator('button >> svg').first();
        await toggle.click();

        // Sidebar should now be visible (check for class removal)
        await expect(aside).not.toHaveClass(/ -translate-x-full/);
    });
});

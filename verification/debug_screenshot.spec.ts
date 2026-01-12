
import { test, expect } from '@playwright/test';

test.describe('Super Business Flow', () => {

  test('Capture Dashboard State', async ({ page }) => {
    // Console logs
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));

    // Mocks
    await page.context().addCookies([
        { name: 'access', value: 'mock-access-token', domain: 'localhost', path: '/' },
        { name: 'refresh', value: 'mock-refresh-token', domain: 'localhost', path: '/' }
    ]);

    await page.route('**/api/v1/**', async (route) => {
        const url = route.request().url();
        console.log('MOCK REQUEST:', url);
        if (url.includes('/auth/login')) return route.continue();

        // Profile
        if (url.includes('/business/profile')) {
             return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 'super-biz-id',
                    name: 'Super Biz',
                    role: 'BUSINESS',
                    isSuperBusiness: true
                })
            });
        }

        // Subscription
        if (url.includes('/business/subscription')) {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    tier: 'Free',
                    status: 'active'
                })
            });
        }

        if (url.includes('/membership/my-membership')) {
             return route.fulfill({ status: 200, body: JSON.stringify({}) });
        }

        // Generic
        await route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) });
    });

    try {
        await page.goto('http://localhost:3000/dashboard', { timeout: 10000 });
        await page.waitForTimeout(3000);

        // Take screenshot
        await page.screenshot({ path: 'verification/dashboard_debug.png', fullPage: true });
        console.log('Screenshot taken: verification/dashboard_debug.png');

        const content = await page.content();
        console.log('Page Content Length:', content.length);

        // Basic assertion
        await expect(page).toHaveURL('http://localhost:3000/dashboard');
        await expect(page.locator('text=Overview')).toBeVisible();
    } catch (e) {
        console.error('Test failed:', e);
        // Take failure screenshot
        await page.screenshot({ path: 'verification/dashboard_fail.png', fullPage: true });
        throw e;
    }
  });
});

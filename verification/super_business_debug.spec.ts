
import { test, expect } from '@playwright/test';

test.describe('Super Business Flow', () => {

  test.beforeEach(async ({ page }) => {
    // Console logs to debug client-side errors
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));
  });

  test('Super Business can access dashboard without subscription redirect', async ({ page }) => {
    // Manually set the cookie so the client side code picks it up
    await page.context().addCookies([
        { name: 'access', value: 'mock-access-token', domain: 'localhost', path: '/' },
        { name: 'refresh', value: 'mock-refresh-token', domain: 'localhost', path: '/' }
    ]);

    // Catch-all for other endpoints
    await page.route('**/api/v1/**', async (route) => {
        const url = route.request().url();
        console.log('MOCK REQUEST:', url);
        if (url.includes('/auth/login')) return route.continue();
        if (url.includes('/business/profile')) return; // handled below
        if (url.includes('/business/subscription')) return; // handled below
        if (url.includes('/membership/my-membership')) return;

        // Return Generic Success for others
        await route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) });
    });

    // 1. Mock Login & Profile
    await page.route('**/api/v1/auth/login', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                user: {
                    id: 'super-biz-id',
                    name: 'Super Biz',
                    role: 'BUSINESS',
                    isOnboarded: true,
                    isEmailVerified: true,
                    isSuperBusiness: true
                },
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token'
            })
        });
    });

    await page.route('**/api/v1/business/profile', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: 'super-biz-id',
                name: 'Super Biz',
                isSuperBusiness: true,
                role: 'BUSINESS',
                // other fields...
            })
        });
    });

    await page.route('**/api/v1/business/subscription', async (route) => {
        // Return Free tier to test bypass
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                tier: 'Free',
                status: 'active'
            })
        });
    });

    await page.route('**/api/v1/membership/my-membership', async route => route.fulfill({ status: 200, body: JSON.stringify({}) }));

    // 3. Verify Dashboard Access (Should NOT redirect to subscription)
    await page.goto('http://localhost:3000/dashboard');
    // Wait for potential redirect or load
    await page.waitForTimeout(2000);

    // Should stay on dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');

    try {
        await expect(page.locator('text=Overview')).toBeVisible();
    } catch (e) {
        console.log('Overview NOT FOUND. Dumping Body:');
        const content = await page.content();
        console.log(content);
        throw e;
    }

    // 4. Verify Sidebar Links are not disabled
    // Check if a link that would normally be disabled (e.g., Campaigns) is clickable
    const campaignsLink = page.locator('a[href="/dashboard/campaigns/list"]').first();
    await expect(campaignsLink).not.toHaveClass(/pointer-events-none/);
  });
});

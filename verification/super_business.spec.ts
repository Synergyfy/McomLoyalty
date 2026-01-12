
import { test, expect } from '@playwright/test';

test.describe('Super Business Flow', () => {

  test('Super Business can access dashboard without subscription redirect', async ({ page }) => {
    // Manually set the cookie so the client side code picks it up
    await page.context().addCookies([
        { name: 'access', value: 'mock-access-token', domain: 'localhost', path: '/' },
        { name: 'refresh', value: 'mock-refresh-token', domain: 'localhost', path: '/' }
    ]);

    // Catch-all for other endpoints
    await page.route('**/api/v1/**', async (route) => {
        const url = route.request().url();
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
    await expect(page.locator('text=Overview')).toBeVisible();

    // 4. Verify Sidebar Links are not disabled
    // Check if a link that would normally be disabled (e.g., Campaigns) is clickable
    const campaignsLink = page.locator('a[href="/dashboard/campaigns/list"]').first();
    await expect(campaignsLink).not.toHaveClass(/pointer-events-none/);
  });

  test('Super Business can create matching campaign', async ({ page }) => {
     // Manually set the cookie so the client side code picks it up
    await page.context().addCookies([
        { name: 'access', value: 'mock-access-token', domain: 'localhost', path: '/' },
        { name: 'refresh', value: 'mock-refresh-token', domain: 'localhost', path: '/' }
    ]);

    // Catch-all
    await page.route('**/api/v1/**', async (route) => {
         const url = route.request().url();
         if (url.includes('/business/profile')) return;
         if (url.includes('/business/subscription')) return;
         if (url.includes('/membership/my-membership')) return;
         await route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) });
    });

     // Setup same mocks as above + specific campaign mocks
     await page.route('**/api/v1/business/profile', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: 'super-biz-id',
                name: 'Super Biz',
                isSuperBusiness: true,
                role: 'BUSINESS'
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

    await page.goto('http://localhost:3000/dashboard/campaigns/create');
    await page.waitForTimeout(1000);

    // 1. Choose Campaign Type
    // Should see "Matching Point System"
    await expect(page.locator('text=Matching Point System')).toBeVisible();
    await page.click('text=Matching Point System');
    await page.click('button:has-text("Next")');

    // 2. Set Details
    // Verify Rewards section is hidden
    await expect(page.locator('text=Rewards to Attach')).not.toBeVisible();

    // Fill required fields
    await page.fill('input[id="campaignName"]', 'Test Matching Campaign');
    await page.fill('input[id="totalSlots"]', '1000');
  });

  test('Super Business sees matching dashboard', async ({ page }) => {
      // Manually set the cookie so the client side code picks it up
        await page.context().addCookies([
            { name: 'access', value: 'mock-access-token', domain: 'localhost', path: '/' },
            { name: 'refresh', value: 'mock-refresh-token', domain: 'localhost', path: '/' }
        ]);

      // Catch-all
        await page.route('**/api/v1/**', async (route) => {
            const url = route.request().url();
            if (url.includes('/business/profile')) return;
            if (url.includes('/business/subscription')) return;
            if (url.includes('/business/campaigns/my-created-campaigns')) return;
            await route.fulfill({ status: 200, body: JSON.stringify({ data: [], monthlyLimit: 1000 }) });
        });

      // Mock profile
      await page.route('**/api/v1/business/profile', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: 'super-biz-id',
                name: 'Super Biz',
                isSuperBusiness: true
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

      // Mock campaigns
      await page.route('**/api/v1/business/campaigns/my-created-campaigns*', async (route) => {
          await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                  data: [
                      {
                          id: 'camp-1',
                          name: 'Matching Campaign A',
                          campaignType: 'matching_point',
                          totalMatchingPointsEarned: 500,
                          startDate: new Date().toISOString(),
                          quantity: 100,
                          disabled: false
                      }
                  ]
              })
          });
      });

      await page.goto('http://localhost:3000/dashboard/matching-points');
      await page.waitForTimeout(1000);

      // Verify View
      await expect(page.locator('h2:has-text("My Matching Campaigns")')).toBeVisible();
      await expect(page.locator('text=Matching Campaign A')).toBeVisible();
      await expect(page.locator('button:has-text("Award Points")')).toBeVisible();

      // Click Award Points
      await page.click('button:has-text("Award Points")');

      // Verify Modal
      await expect(page.locator('text=Award Points')).toBeVisible();
      // Verify input for points is present
      await expect(page.locator('input[id="points-a"]')).toBeVisible();
  });

});

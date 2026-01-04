
import json
from playwright.sync_api import sync_playwright

def verify_campaign_status_and_rewards():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # Set cookies for localhost:3000
        context.add_cookies([
            {"name": "access", "value": "mock_access_token", "domain": "localhost", "path": "/"},
            {"name": "refresh", "value": "mock_refresh_token", "domain": "localhost", "path": "/"},
            {"name": "access", "value": "mock_access_token", "url": "http://localhost:3000"},
            {"name": "refresh", "value": "mock_refresh_token", "url": "http://localhost:3000"}
        ])

        page = context.new_page()

        # Catch-all to prevent 401s
        page.route("**/api/v1/**", lambda route: route.fulfill(status=200, body="{}"))

        # Mock Auth
        page.route("**/api/v1/auth/me", lambda route: route.fulfill(status=200, body=json.dumps({"id": "user1", "role": "business"})))
        page.route("**/api/v1/business/setup/status", lambda route: route.fulfill(status=200, body=json.dumps({"hasCampaign": True})))

        # Mock Business Subscription
        page.route("**/api/v1/business/subscription", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({
                "tier": "Pro",
                "isTrial": False,
                "expiresAt": "2099-12-31T23:59:59Z"
            })
        ))

        page.route("**/api/v1/tiers/my-subscription", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({
                "tier": {"name": "Pro", "configuration": {"quotas": {"maxActiveCampaigns": 100}}},
                "isTrial": False,
                "expiresAt": "2099-12-31T23:59:59Z"
            })
        ))

        # Mock Campaigns List
        page.route("**/api/v1/business/campaigns/my-created-campaigns**", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({
                "data": [
                    {
                        "id": "camp_disabled",
                        "name": "Disabled Campaign",
                        "campaign_type": "qr_code",
                        "campaign_message": "Disabled",
                        "start_date": "2024-01-01T00:00:00Z",
                        "end_date": "2025-01-01T00:00:00Z",
                        "quantity": 100,
                        "audience_type": "all",
                        "disabled": True,
                        "banner_url": "",
                        "logo_url": "",
                        "businessRewards": []
                    },
                     {
                        "id": "camp_sold_out",
                        "name": "Sold Out Campaign",
                        "campaign_type": "qr_code",
                        "campaign_message": "Sold Out",
                        "start_date": "2024-01-01T00:00:00Z",
                        "end_date": "2025-01-01T00:00:00Z",
                        "quantity": 0,
                        "audience_type": "all",
                        "disabled": False,
                        "banner_url": "",
                        "logo_url": "",
                        "businessRewards": []
                    },
                    {
                        "id": "camp_scheduled",
                        "name": "Scheduled Campaign",
                        "campaign_type": "qr_code",
                        "campaign_message": "Scheduled",
                        "start_date": "2099-01-01T00:00:00Z",
                        "end_date": "2099-12-31T00:00:00Z",
                        "quantity": 100,
                        "audience_type": "all",
                        "disabled": False,
                        "banner_url": "",
                        "logo_url": "",
                        "businessRewards": []
                    },
                    {
                        "id": "camp_expired",
                        "name": "Expired Campaign",
                        "campaign_type": "qr_code",
                        "campaign_message": "Expired",
                        "start_date": "2023-01-01T00:00:00Z",
                        "end_date": "2023-12-31T00:00:00Z",
                        "quantity": 100,
                        "audience_type": "all",
                        "disabled": False,
                        "banner_url": "",
                        "logo_url": "",
                        "businessRewards": []
                    },
                     {
                        "id": "camp_active",
                        "name": "Active Campaign",
                        "campaign_type": "qr_code",
                        "campaign_message": "Active",
                        "start_date": "2024-01-01T00:00:00Z",
                        "end_date": "2025-12-31T00:00:00Z",
                        "quantity": 100,
                        "audience_type": "all",
                        "disabled": False,
                        "banner_url": "",
                        "logo_url": "",
                        "businessRewards": []
                    }
                ],
                "total": 5,
                "page": 1,
                "limit": 10,
                "totalPages": 1
            })
        ))

        # Mock Single Campaign for Edit
        page.route("**/api/v1/campaigns/camp_edit_target**", lambda route: route.fulfill(
             status=200,
             content_type="application/json",
             body=json.dumps({
                "id": "camp_edit_target",
                "name": "Edit Target Campaign",
                "campaign_type": "qr_code",
                "campaign_message": "Target for Edit",
                "start_date": "2024-01-01T00:00:00Z",
                "end_date": "2025-12-31T00:00:00Z",
                "quantity": 100,
                "audience_type": "all",
                "disabled": False,
                "banner_url": "",
                "logo_url": "",
                "businessRewards": [{"id": "reward_hidden", "title": "Hidden Reward"}]
             })
        ))

        # Mock Business Rewards (Empty to prove the merge works)
        page.route("**/api/v1/rewards/business/my-added-rewards**", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({
                "data": [{"id": "reward_visible", "title": "Visible Reward"}],
                "total": 1,
                "page": 1,
                "limit": 100,
                "totalPages": 1
            })
        ))

        # Additional Mocks
        page.route("**/api/v1/business/tiers/usage", lambda route: route.fulfill(status=200, body=json.dumps({"features": {"campaigns": {"used": 0}}})))
        page.route("**/api/v1/business/campaigns/claimable", lambda route: route.fulfill(status=200, body=json.dumps({"data": []})))
        page.route("**/api/v1/business/campaigns/my-claimed-campaigns", lambda route: route.fulfill(status=200, body=json.dumps({"data": [], "total": 0})))


        try:
            # 1. Verify List Page Statuses
            print("Navigating to Campaign List...")
            page.goto("http://localhost:3000/dashboard/campaigns/list", wait_until="domcontentloaded")

            # Wait for any status badge
            try:
                page.wait_for_selector("text=Disabled", timeout=10000)
                page.wait_for_selector("text=Sold Out", timeout=1000)
                page.wait_for_selector("text=Scheduled", timeout=1000)
                page.wait_for_selector("text=Expired", timeout=1000)
                page.wait_for_selector("text=Active", timeout=1000)
                print("All statuses found!")
            except Exception as e:
                print(f"Status check incomplete: {e}")

            page.screenshot(path="verification/campaign_list_status.png")
            print("Screenshot saved: verification/campaign_list_status.png")

            # 2. Verify Edit Page Rewards
            print("Navigating to Edit Campaign...")
            page.goto("http://localhost:3000/dashboard/campaigns/edit/camp_edit_target", wait_until="domcontentloaded")

            # Click Next to go to Step 2
            # Wait for button
            page.wait_for_selector("button:has-text('Next')", timeout=10000)
            page.click("button:has-text('Next')")

            # Wait for Step 2 to load
            page.wait_for_selector("text=Step 2: Set Campaign Details", timeout=10000)

            # Open dropdown
            # Use label locator
            page.click("label:has-text('Rewards to Attach')")
            page.keyboard.press("Tab") # Move to Select
            page.keyboard.press("Space") # Open Select

            # Wait for dropdown options
            # Check if "Hidden Reward" is visible in the dropdown menu
            try:
                page.wait_for_selector("div[id^='react-select']", timeout=5000)
                # Or just check for text in the page
                page.wait_for_selector("text=Hidden Reward", timeout=5000)
                print("Hidden Reward found in dropdown!")
            except Exception as e:
                 print(f"Dropdown check failed: {e}")

            page.screenshot(path="verification/campaign_edit_rewards.png")
            print("Screenshot saved: verification/campaign_edit_rewards.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_campaign_status_and_rewards()

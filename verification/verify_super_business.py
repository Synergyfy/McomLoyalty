from playwright.sync_api import sync_playwright, Page, Route
import json
import sys

# Mock Data (Same as before)
MOCK_PROFILE = {
    "id": "business-123",
    "name": "Super Corp",
    "role": "BUSINESS",
    "isSuperBusiness": True,
    "email": "super@example.com",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z",
    "deletedAt": None,
    "phone": "1234567890",
    "address": "123 Super St",
    "website": "https://super.example.com",
    "socialMedia": [],
    "uniqueCode": "SUPER123",
    "referralCapacity": 100,
    "affiliateCode": "AFF123",
    "referralPoints": "0",
    "reputationPoints": "0",
    "isDisabled": False,
    "stripeCustomerId": None,
    "totalPointsEarned": 0,
    "totalPointsRedeemed": 0,
}
MOCK_CAMPAIGNS = {
    "data": [
        {
            "id": "camp-1",
            "name": "Super Match Campaign",
            "campaignType": "matching_point",
            "campaignMessage": "Earn double points",
            "bannerUrl": "",
            "disabled": False,
            "totalMatchingPointsEarned": 500,
            "createdAt": "2023-01-01T00:00:00Z",
        }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
}

def log_request(route: Route):
    req = route.request
    print(f"NETWORK: {req.method} {req.url}", flush=True)

    # Check if it matches our API patterns
    if "/api/v1/business/profile" in req.url:
        print("  -> MATCHED PROFILE MOCK", flush=True)
        route.fulfill(status=200, content_type="application/json", body=json.dumps(MOCK_PROFILE))
        return

    if "/api/v1/business/campaigns/my-created-campaigns" in req.url:
         print("  -> MATCHED CAMPAIGNS MOCK", flush=True)
         route.fulfill(status=200, content_type="application/json", body=json.dumps(MOCK_CAMPAIGNS))
         return

    if "/api/v1/matching-points/balance" in req.url:
        print("  -> MATCHED BALANCE MOCK", flush=True)
        route.fulfill(status=200, content_type="application/json", body=json.dumps({"matching_points": 1000}))
        return

    # Fallback for other API calls to avoid 404/500
    if "/api/v1/" in req.url:
         print("  -> FALLBACK MOCK", flush=True)
         route.fulfill(status=200, content_type="application/json", body="{}")
         return

    route.continue_()

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # Add auth cookies
        context.add_cookies([
            {"name": "access", "value": "mock-token", "domain": "localhost", "path": "/"},
            {"name": "refresh", "value": "mock-refresh", "domain": "localhost", "path": "/"},
        ])

        page = context.new_page()

        # Route ALL requests through our logger/handler
        page.route("**/*", log_request)

        try:
            print("Navigating to dashboard...", flush=True)
            page.goto("http://localhost:3000/dashboard")
            page.wait_for_timeout(2000)

            print("Navigating to Matching Points page...", flush=True)
            page.goto("http://localhost:3000/dashboard/matching-points")

            try:
                page.wait_for_selector("text=Matching Point Campaigns", timeout=5000)
                print("SUCCESS: Header verified.", flush=True)
            except:
                print("FAILURE: Header NOT found.", flush=True)

            page.screenshot(path="verification_debug_2.png", full_page=True)

        except Exception as e:
            print(f"Verification Script Error: {e}", flush=True)
        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()

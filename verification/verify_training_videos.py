import re
from playwright.sync_api import sync_playwright, expect

def test_training_videos(page):
    # Mock GET /training-videos for admin
    page.route("**/api/v1/training-videos?*", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='''{
            "items": [
                {
                    "id": "vid-1",
                    "title": "Mock Business Video",
                    "description": "A video for business owners.",
                    "video_url": "https://example.com/video1",
                    "target_audience": "business",
                    "target_tier_ids": ["tier-1"],
                    "created_at": "2023-01-01T00:00:00Z"
                },
                {
                    "id": "vid-2",
                    "title": "Mock Consumer Video",
                    "description": "A video for consumers.",
                    "video_url": "https://example.com/video2",
                    "target_audience": "participant",
                    "target_tier_ids": [],
                    "created_at": "2023-01-02T00:00:00Z"
                }
            ],
            "meta": {
                "itemCount": 2,
                "totalItems": 2,
                "itemsPerPage": 100,
                "totalPages": 1,
                "currentPage": 1
            }
        }'''
    ))

    # Mock Tiers
    page.route("**/api/v1/tier", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='[{"id": "tier-1", "name": "Gold Tier"}]'
    ))

    # Go to Admin Page
    print("Navigating to Admin Resources Page...")
    page.goto("http://localhost:3000/admin/resources")
    page.wait_for_load_state("networkidle")

    # Verify Admin List shows both videos
    expect(page.get_by_text("Mock Business Video")).to_be_visible()
    expect(page.get_by_text("Mock Consumer Video")).to_be_visible()
    page.screenshot(path="verification/admin_videos_list.png")
    print("Admin List Verified.")

    # Go to Business Dashboard Support Page
    # Note: Authentication bypass might be needed or mocking specific endpoints.
    # For now, let's just mock the filtered response the dashboard would request.

    page.route("**/api/v1/training-videos?*target_audience=business*", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='''{
            "items": [
                {
                    "id": "vid-1",
                    "title": "Mock Business Video",
                    "description": "A video for business owners.",
                    "video_url": "https://example.com/video1",
                    "target_audience": "business",
                    "target_tier_ids": ["tier-1"],
                    "created_at": "2023-01-01T00:00:00Z"
                }
            ],
            "meta": {
                "itemCount": 1,
                "totalItems": 1,
                "itemsPerPage": 100,
                "totalPages": 1,
                "currentPage": 1
            }
        }'''
    ))

    # We need to set cookies to access dashboard
    page.context.add_cookies([
        {"name": "access", "value": "mock_token", "domain": "localhost", "path": "/"},
        {"name": "refresh", "value": "mock_refresh", "domain": "localhost", "path": "/"}
    ])

    # Mock auth/me and subscription to bypass checks
    page.route("**/api/v1/auth/me", lambda route: route.fulfill(status=200, body='{"id": "user1", "role": "business"}'))
    page.route("**/api/v1/business/subscription", lambda route: route.fulfill(status=200, body='{"tier": "Gold"}'))

    print("Navigating to Business Dashboard Support Page...")
    page.goto("http://localhost:3000/dashboard/support")

    # Verify Dashboard only shows Business Video
    expect(page.get_by_text("Mock Business Video")).to_be_visible()
    # Ensure Consumer Video is NOT visible (since we mocked the filtered response)
    expect(page.get_by_text("Mock Consumer Video")).not_to_be_visible()

    page.screenshot(path="verification/business_dashboard_videos.png")
    print("Business Dashboard Verified.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_training_videos(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

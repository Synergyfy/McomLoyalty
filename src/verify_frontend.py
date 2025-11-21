from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_frontend(page: Page):
    # 1. Verify Campaign Page -> Join Redirect
    print("Navigating to campaign page...")
    page.goto("http://localhost:3000/campaigns/1")

    # Wait for page load
    page.wait_for_timeout(3000)

    print("Checking for Join button...")
    # Pick the first one if multiple exist (Desktop vs Sticky Mobile often duplicate)
    join_button = page.get_by_role("button", name="Join Campaign & Get Reward").first
    expect(join_button).to_be_visible()

    print("Clicking Join button...")
    join_button.click()

    # Should redirect to signup
    print("Verifying redirect to signup...")

    # Instead of wait_for_url which seems to timeout waiting for 'load' event if page is complex or something
    # We just check URL after a short delay
    page.wait_for_timeout(2000)

    current_url = page.url
    print(f"Current URL: {current_url}")

    if "signup" not in current_url:
        print("URL did not change to signup yet, waiting more...")
        page.wait_for_timeout(3000)
        current_url = page.url

    assert "signup" in current_url
    assert "returnUrl" in current_url

    # Screenshot Signup Page
    page.screenshot(path="/home/jules/verification/signup_redirect.png")
    print("Signup redirect verified.")

    # 2. Verify Login Page Toggle
    print("Navigating to Login page...")
    page.goto("http://localhost:3000/login")

    print("Checking for User/Business toggle...")
    customer_btn = page.get_by_text("Customer")
    business_btn = page.get_by_text("Business")

    expect(customer_btn).to_be_visible()
    expect(business_btn).to_be_visible()

    # Screenshot Login Page
    page.screenshot(path="/home/jules/verification/login_toggle.png")
    print("Login toggle verified.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_frontend(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="/home/jules/verification/error.png")
        finally:
            browser.close()

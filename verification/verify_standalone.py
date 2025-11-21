from playwright.sync_api import Page, expect, sync_playwright

def verify_standalone_login_signup(page: Page):
    # 1. Verify Login Page
    page.goto("http://localhost:3000/customer/login")
    page.wait_for_load_state("networkidle")

    # Check elements exist
    expect(page.get_by_role("heading", name="Welcome Back to MCOM Rewards")).to_be_visible()
    expect(page.get_by_label("Email")).to_be_visible()
    expect(page.get_by_label("Password")).to_be_visible()
    expect(page.get_by_role("button", name="Log In")).to_be_visible()

    page.screenshot(path="verification/customer_login.png")

    # 2. Verify Signup Page
    page.goto("http://localhost:3000/customer/signup")
    page.wait_for_load_state("networkidle")

    # Check elements exist
    expect(page.get_by_role("heading", name="Join MCOM Rewards")).to_be_visible()
    expect(page.get_by_label("Full Name")).to_be_visible()
    expect(page.get_by_label("Email")).to_be_visible()
    expect(page.get_by_label("Password")).to_be_visible()
    # Note: "I agree to the Terms & Conditions" check
    expect(page.get_by_role("checkbox", name="I agree to the Terms & Conditions")).to_be_visible()

    page.screenshot(path="verification/customer_signup.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_standalone_login_signup(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/standalone_error.png")
            raise e
        finally:
            browser.close()

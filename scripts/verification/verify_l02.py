from playwright.sync_api import sync_playwright, Page, expect
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Go to the local server
            page.goto("http://localhost:8000/topics/02-convex-sets/index.html")

            # Wait for content to load
            page.wait_for_selector("#section-9")

            # Scroll to Section 9 (Exercises)
            section = page.locator("#section-9")
            section.scroll_into_view_if_needed()

            # Wait a bit for layout
            page.wait_for_timeout(1000)

            # Take screenshot of the Exercises section
            # We might need to take multiple or a tall one.
            # Let's take one of the whole section.

            # Ensure the directory exists
            os.makedirs("/home/jules/verification", exist_ok=True)

            # Capture specific exercises to verify content
            # P2.3 (Quadratic)
            p2_3 = page.locator("h3:has-text('P2.3')").locator("..")
            p2_3.screenshot(path="/home/jules/verification/p2_3.png")

            # P2.11 (Convex Hull)
            p2_11 = page.locator("h3:has-text('P2.11')").locator("..")
            p2_11.screenshot(path="/home/jules/verification/p2_11.png")

            # New Exercise P2.16
            p2_16 = page.locator("h3:has-text('P2.16')").locator("..")
            p2_16.screenshot(path="/home/jules/verification/p2_16.png")

            print("Screenshots taken successfully.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()

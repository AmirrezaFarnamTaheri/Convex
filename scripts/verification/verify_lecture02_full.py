from playwright.sync_api import sync_playwright
import time

def verify_lecture():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8000/topics/02-convex-sets/index.html")

        # Check title
        print(f"Title: {page.title()}")
        assert "Convex Sets" in page.title()

        # Check images
        images = page.query_selector_all("img")
        print(f"Found {len(images)} images")

        # Check widgets
        widgets = page.query_selector_all(".widget-container")
        print(f"Found {len(widgets)} widgets")

        # Take screenshot
        page.screenshot(path="verification_screenshots/lecture02_full.png", full_page=True)
        print("Screenshot saved to verification_screenshots/lecture02_full.png")

        browser.close()

if __name__ == "__main__":
    verify_lecture()

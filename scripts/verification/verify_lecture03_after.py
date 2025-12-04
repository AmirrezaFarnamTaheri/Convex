from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Increase viewport height to capture full section
        page = browser.new_page(viewport={'width': 1280, 'height': 3000})

        try:
            page.goto("http://localhost:8000/topics/03-convex-functions/index.html")
            # Wait for content to load
            page.wait_for_selector("#section-7")
            time.sleep(2) # Allow images to load

            # Screenshot Section 7
            element = page.locator("#section-7")
            element.screenshot(path="lecture03_section7_after.png")
            print("Screenshot saved to lecture03_section7_after.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()

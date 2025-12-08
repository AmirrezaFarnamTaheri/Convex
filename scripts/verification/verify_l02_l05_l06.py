
import os
import time
from playwright.sync_api import sync_playwright

def verify_pages():
    pages_to_check = [
        "topics/02-introduction/index.html",
        "topics/05-convex-functions-basics/index.html",
        "topics/06-convex-functions-advanced/index.html"
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch()
        for page_path in pages_to_check:
            print(f"Verifying {page_path}...")
            page = browser.new_page()
            url = f"http://localhost:8000/{page_path}"
            try:
                page.goto(url, timeout=30000)
                # Wait for MathJax/KaTeX if needed (simple wait)
                time.sleep(2)

                # Check for specific elements that indicate success
                # e.g., the last exercise
                if "02" in page_path:
                    selector = "h3:has-text('P2.31')"
                elif "05" in page_path:
                    selector = "h3:has-text('P5.12')"
                elif "06" in page_path:
                    selector = "h3:has-text('P6.10')"

                if page.query_selector(selector):
                    print(f"  SUCCESS: Found {selector}")
                else:
                    print(f"  FAILURE: Could not find {selector}")

                # Take a screenshot of the bottom of the page
                output_name = os.path.basename(os.path.dirname(page_path)) + "_exercises.png"
                save_path = f"/home/jules/verification/{output_name}"

                # Scroll to bottom
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                time.sleep(1)
                page.screenshot(path=save_path)
                print(f"  Screenshot saved to {save_path}")

            except Exception as e:
                print(f"  ERROR verifying {page_path}: {e}")

            page.close()
        browser.close()

if __name__ == "__main__":
    # Ensure verification directory exists
    os.makedirs("/home/jules/verification", exist_ok=True)
    verify_pages()

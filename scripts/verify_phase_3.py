from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Verify Lecture 02
        url = "http://localhost:8000/topics/02-convex-sets/index.html"
        try:
            page.goto(url, timeout=60000)

            # Take screenshots of key sections
            page.screenshot(path="verification_lecture_02_top.png")

            # Scroll to Section 2
            page.eval_on_selector("#section-2", "el => el.scrollIntoView()")
            page.wait_for_timeout(500)
            page.screenshot(path="verification_lecture_02_sec2.png")

            # Scroll to Section 5
            page.eval_on_selector("#section-5", "el => el.scrollIntoView()")
            page.wait_for_timeout(500)
            page.screenshot(path="verification_lecture_02_sec5.png")

            print("Screenshots taken for Lecture 02")

        except Exception as e:
            print(f"Error visiting {url}: {e}")

        browser.close()

if __name__ == "__main__":
    run()

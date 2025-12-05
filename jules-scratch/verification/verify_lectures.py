from playwright.sync_api import sync_playwright
import time

def verify_lectures():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Define lectures to check
        lectures = [
            "00-linear-algebra-primer",
            "01-introduction",
            "02-convex-sets",
            "03-convex-functions",
            "04-convex-opt-problems",
            "05-duality"
        ]

        for lecture in lectures:
            url = f"http://localhost:8000/topics/{lecture}/index.html"
            print(f"Navigating to {url}")
            page.goto(url)

            # Wait for content to load (math rendering etc)
            time.sleep(2)

            # Take screenshot of the top part (header and intro)
            screenshot_path = f"jules-scratch/verification/{lecture}.png"
            page.screenshot(path=screenshot_path)
            print(f"Saved screenshot to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_lectures()

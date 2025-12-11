from playwright.sync_api import sync_playwright
import time

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify Lecture 04
        page.goto("http://localhost:8000/topics/04-convex-sets-cones/index.html")
        page.screenshot(path="verification/lecture_04.png", full_page=True)

        # Verify Lecture 05
        page.goto("http://localhost:8000/topics/05-convex-functions-basics/index.html")
        page.screenshot(path="verification/lecture_05.png", full_page=True)

        # Verify Lecture 06
        page.goto("http://localhost:8000/topics/06-convex-functions-advanced/index.html")
        page.screenshot(path="verification/lecture_06.png", full_page=True)

        # Verify Lecture 07
        page.goto("http://localhost:8000/topics/07-convex-problems-standard/index.html")
        page.screenshot(path="verification/lecture_07.png", full_page=True)

        # Verify Lecture 08
        page.goto("http://localhost:8000/topics/08-convex-problems-conic/index.html")
        page.screenshot(path="verification/lecture_08.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    verify_changes()

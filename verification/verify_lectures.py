from playwright.sync_api import sync_playwright
import time

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify Lecture 00
        page.goto("http://localhost:8000/topics/00-linear-algebra-basics/index.html")
        page.screenshot(path="verification/lecture_00.png", full_page=True)

        # Verify Lecture 01
        page.goto("http://localhost:8000/topics/01-linear-algebra-advanced/index.html")
        page.screenshot(path="verification/lecture_01.png", full_page=True)

        # Verify Lecture 02
        page.goto("http://localhost:8000/topics/02-introduction/index.html")
        page.screenshot(path="verification/lecture_02.png", full_page=True)

        # Verify Lecture 03
        page.goto("http://localhost:8000/topics/03-convex-sets-geometry/index.html")
        page.screenshot(path="verification/lecture_03.png", full_page=True)

        # Verify Lecture 09
        page.goto("http://localhost:8000/topics/09-duality/index.html")
        page.screenshot(path="verification/lecture_09.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    verify_changes()

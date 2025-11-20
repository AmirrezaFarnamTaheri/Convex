
from playwright.sync_api import sync_playwright, expect
import time
import os

def verify_lectures():
    os.makedirs('verification_screenshots', exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # --- Lecture 00 ---
        page.goto("http://localhost:8000/topics/00-linear-algebra-primer/index.html")
        page.wait_for_selector('h1')
        time.sleep(2)
        # Take viewport screenshot instead of full page
        page.screenshot(path="verification_screenshots/lecture_00_top.png")
        print("Captured Lecture 00 (Top)")

        # --- Lecture 01 ---
        page.goto("http://localhost:8000/topics/01-introduction/index.html")
        page.wait_for_selector('h1')
        time.sleep(2)
        page.screenshot(path="verification_screenshots/lecture_01_top.png")
        print("Captured Lecture 01 (Top)")

        # --- Lecture 02 ---
        page.goto("http://localhost:8000/topics/02-convex-sets/index.html")
        page.wait_for_selector('h1')
        time.sleep(2)
        page.screenshot(path="verification_screenshots/lecture_02_top.png")
        print("Captured Lecture 02 (Top)")

        # --- Lecture 03 ---
        page.goto("http://localhost:8000/topics/03-convex-functions/index.html")
        page.wait_for_selector('h1')
        time.sleep(2)
        page.screenshot(path="verification_screenshots/lecture_03_top.png")
        print("Captured Lecture 03 (Top)")

        browser.close()

if __name__ == "__main__":
    verify_lectures()

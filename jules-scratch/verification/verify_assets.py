from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Verify Lecture 03 asset
    page.goto("http://localhost:8010/topics/03-convex-functions/")
    page.screenshot(path="jules-scratch/verification/lecture-03-verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

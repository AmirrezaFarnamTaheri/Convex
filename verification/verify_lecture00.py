from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:8000/topics/00-linear-algebra-basics/index.html")
    # Wait for a widget to ensure assets are loaded
    page.wait_for_selector(".widget-container")
    page.screenshot(path="verification/lecture00.png", full_page=True)
    browser.close()

with sync_playwright() as playwright:
    run(playwright)

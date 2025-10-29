
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Lecture 00
    page.goto("http://localhost:8000/topics/00-linear-algebra-primer/")
    page.screenshot(path="jules-scratch/verification/lecture-00-deep.png", full_page=True)

    # Lecture 01
    page.goto("http://localhost:8000/topics/01-introduction/")
    page.screenshot(path="jules-scratch/verification/lecture-01-deep.png", full_page=True)

    # Lecture 02
    page.goto("http://localhost:8000/topics/02-convex-sets/")
    page.screenshot(path="jules-scratch/verification/lecture-02-deep.png", full_page=True)

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

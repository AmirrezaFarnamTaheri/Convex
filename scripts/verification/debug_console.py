
from playwright.sync_api import Page, expect, sync_playwright
import time

def debug_page(page: Page, url: str):
    print(f"Navigating to {url}")
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))
    page.goto(url)
    time.sleep(10) # Wait for stuff to happen

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            debug_page(page, "http://localhost:8000/topics/00-linear-algebra-primer/index.html")
        finally:
            browser.close()

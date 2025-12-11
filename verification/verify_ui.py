from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8000/topics/00-linear-algebra-basics/index.html")

        # Verify Recaps
        recap = page.locator(".recap-box").first
        if recap.is_visible():
            print("Recap box visible")

        # Verify Keyboard Shortcut for Highlighting
        # Select some text
        page.evaluate("window.getSelection().selectAllChildren(document.querySelector('p'))")
        # Press Alt+1
        page.keyboard.press("Alt+1")

        # Check if highlight was applied
        highlight = page.locator(".kw-highlight-yellow").first
        if highlight.is_visible():
             print("Highlight applied via shortcut")

        page.screenshot(path="verification/screenshot.png")
        browser.close()

if __name__ == "__main__":
    run()

from playwright.sync_api import sync_playwright

def verify_site_structure():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

        # Verify Homepage
        print("Checking homepage...")
        page.goto("http://localhost:8000/index.html")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="homepage_verification.png")

        # Verify Syllabus
        print("Checking syllabus...")
        page.goto("http://localhost:8000/syllabus.html")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="syllabus_verification.png")

        # Verify Lecture 00
        print("Checking Lecture 00...")
        page.goto("http://localhost:8000/topics/00-linear-algebra-primer/index.html")
        page.wait_for_load_state("networkidle")
        # Wait for KaTeX to render math
        page.wait_for_selector(".katex")
        page.screenshot(path="lecture00_verification.png")

        # Verify Lecture 01
        print("Checking Lecture 01...")
        page.goto("http://localhost:8000/topics/01-introduction/index.html")
        page.wait_for_load_state("networkidle")
        page.wait_for_selector(".katex")
        page.screenshot(path="lecture01_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_site_structure()

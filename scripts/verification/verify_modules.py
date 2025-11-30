from playwright.sync_api import sync_playwright
import time

def verify_modules():
    modules = [
        ("Module 00", "topics/00-linear-algebra-primer/index.html", "#section-17"),
        ("Module 01", "topics/01-introduction/index.html", "#section-10"),
        ("Module 02", "topics/02-convex-sets/index.html", "#section-7"),
        ("Module 03", "topics/03-convex-functions/index.html", "#section-10"),
        ("Module 04", "topics/04-convex-opt-problems/index.html", "#section-11"),
        ("Module 05", "topics/05-duality/index.html", "#section-10"),
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for name, path, section_id in modules:
            try:
                page = browser.new_page()
                url = f"http://localhost:8000/{path}"
                print(f"Verifying {name} at {url}")

                page.goto(url)

                # Wait for the specific section to ensure content is loaded
                try:
                    page.wait_for_selector(section_id, timeout=5000)
                    section = page.locator(section_id)
                    section.scroll_into_view_if_needed()

                    # Small wait to ensure smooth scroll rendering if any
                    time.sleep(0.5)

                    filename = f"scripts/verification/{name.lower().replace(' ', '')}_exercises.png"
                    page.screenshot(path=filename)
                    print(f"{name} screenshot captured at {filename}")

                except Exception as e:
                    print(f"Error finding section {section_id} in {name}: {e}")
                    # Fallback screenshot of the bottom of the page
                    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    time.sleep(0.5)
                    filename = f"scripts/verification/{name.lower().replace(' ', '')}_bottom.png"
                    page.screenshot(path=filename)
                    print(f"{name} fallback screenshot captured at {filename}")

                page.close()

            except Exception as e:
                print(f"Failed to verify {name}: {e}")

        browser.close()

if __name__ == "__main__":
    verify_modules()

from playwright.sync_api import sync_playwright
import time

def verify_solutions():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Verify L00
        print("Verifying L00 Solutions...")
        page_00 = browser.new_page()
        page_00.goto("http://localhost:8000/topics/00-linear-algebra-basics/index.html")

        try:
            # Wait for content
            page_00.wait_for_selector("#section-exercises")

            # Screenshot the entire exercises section
            # This allows us to visually verify that solution boxes are present and formatted correctly
            exercises_section = page_00.locator("#section-exercises")
            exercises_section.scroll_into_view_if_needed()
            time.sleep(2) # Allow for layout stability

            exercises_section.screenshot(path="/home/jules/verification/l00_exercises_full.png")
            print("L00 Exercises screenshot taken.")

        except Exception as e:
            print(f"Error checking L00: {e}")
            page_00.screenshot(path="/home/jules/verification/l00_error.png")

        page_00.close()

        # Verify L01
        print("Verifying L01 Solutions...")
        page_01 = browser.new_page()
        page_01.goto("http://localhost:8000/topics/01-linear-algebra-advanced/index.html")

        try:
            page_01.wait_for_selector("#section-exercises")

            exercises_section = page_01.locator("#section-exercises")
            exercises_section.scroll_into_view_if_needed()
            time.sleep(2)

            exercises_section.screenshot(path="/home/jules/verification/l01_exercises_full.png")
            print("L01 Exercises screenshot taken.")

        except Exception as e:
            print(f"Error checking L01: {e}")
            page_01.screenshot(path="/home/jules/verification/l01_error.png")

        page_01.close()
        browser.close()

if __name__ == "__main__":
    verify_solutions()

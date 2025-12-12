from playwright.sync_api import sync_playwright

def verify_search():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # 1. Verify Search Bar exists
        search_input = page.locator("#global-search-input")
        search_input.wait_for()
        print("Search input found.")

        # 2. Perform Search
        search_input.fill("convex")

        # 3. Verify Results Dropdown appears
        results = page.locator(".search-results-dropdown")
        results.wait_for()
        print("Results dropdown appeared.")

        # Check if items are populated
        items = results.locator(".search-result-item")
        count = items.count()
        if count > 0:
            print(f"Found {count} search results.")
        else:
            print("No search results found.")

        # 4. Take Screenshot
        page.screenshot(path="verification/search_verification.png")
        browser.close()

if __name__ == "__main__":
    try:
        verify_search()
    except Exception as e:
        print(f"Error: {e}")

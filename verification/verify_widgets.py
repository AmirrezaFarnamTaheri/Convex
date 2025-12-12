from playwright.sync_api import sync_playwright

def verify_widgets():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # 1. Verify Pomodoro Widget is present and resizable handles exist
        pomodoro = page.locator(".pomodoro-widget")
        pomodoro.wait_for()

        # Check for handles
        handles = pomodoro.locator(".resize-handle")
        if handles.count() > 0:
            print("Pomodoro resize handles found.")
        else:
            print("Pomodoro resize handles NOT found.")

        # 2. Verify Notes Widget (toggle it first)
        page.click(".kw-nav-toggle") # Or whatever selector we used

        panel = page.locator(".kw-panel")
        panel.wait_for()

        # Check for handles on notes widget
        panel_handles = panel.locator(".resize-handle")
        if panel_handles.count() > 0:
            print("Notes panel resize handles found.")
        else:
            print("Notes panel resize handles NOT found.")

        # 3. Verify Page Settings (toggle it first)
        page.click("button[title='Page Settings']")

        settings = page.locator(".page-settings-panel")
        settings.wait_for()

        settings_handles = settings.locator(".resize-handle")
        if settings_handles.count() > 0:
            print("Settings panel resize handles found.")
        else:
             print("Settings panel resize handles NOT found.")

        # Take screenshot of everything
        page.screenshot(path="verification/widgets_verification.png")
        browser.close()

if __name__ == "__main__":
    try:
        verify_widgets()
    except Exception as e:
        print(f"Error: {e}")

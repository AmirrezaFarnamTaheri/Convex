
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        urls = [
            "http://localhost:8000/topics/00-linear-algebra-primer/",
            "http://localhost:8000/topics/01-introduction/",
            "http://localhost:8000/topics/02-convex-sets/"
        ]

        for url in urls:
            console_errors = []
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

            await page.goto(url)
            await page.wait_for_load_state("networkidle")

            if console_errors:
                print(f"Console errors on {url}:")
                for error in console_errors:
                    print(error)
            else:
                print(f"No console errors on {url}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

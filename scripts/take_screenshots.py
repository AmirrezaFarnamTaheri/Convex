
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

        for i, url in enumerate(urls):
            await page.goto(url)
            await page.wait_for_load_state("networkidle")
            await page.screenshot(path=f"screenshot_{i}.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

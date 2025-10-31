import os
import re

def check_assets():
    for root, _, files in os.walk('topics'):
        for file in files:
            if file == 'index.html':
                html_path = os.path.join(root, file)
                html_dir = os.path.dirname(html_path)
                with open(html_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    for match in re.finditer(r'src="([^"]*)"', content):
                        asset_path = match.group(1)
                        if asset_path.startswith(('http', '//')):
                            continue

                        full_asset_path = os.path.normpath(os.path.join(html_dir, asset_path))

                        if not os.path.exists(full_asset_path):
                            print(f"Broken link in {html_path}: {asset_path} (resolved to {full_asset_path})")

if __name__ == "__main__":
    check_assets()

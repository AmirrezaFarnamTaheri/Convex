#!/usr/bin/env python3
"""
Script to complete Lectures 00 and 01 HTML files with all widgets
"""
import re

# Lecture 00 updates
html_00 = '/home/user/Convex/topics/00-linear-algebra-primer/index.html'
with open(html_00, 'r') as f:
    content_00 = f.read()

# Add modern-widgets.css if not present
if '/static/css/modern-widgets.css' not in content_00:
    content_00 = content_00.replace(
        '<link rel="stylesheet" href="../../static/css/styles.css" />',
        '<link rel="stylesheet" href="../../static/css/styles.css" />\n  <link rel="stylesheet" href="/static/css/modern-widgets.css" />'
    )
    print("✓ Added modern-widgets.css to Lecture 00")

# Add missing widget scripts before </body>
missing_widgets_00 = [
    ('condition-number', 'initConditionNumber'),
    ('eigen-psd', 'initEigenPsd'),
    ('svd-approximator', 'initSvdApproximator')
]

widget_scripts = ""
for widget_file, init_func in missing_widgets_00:
    widget_scripts += f"""  <script type="module">
    import {{ {init_func} }} from './widgets/js/{widget_file}.js';
    {init_func}('widget-{widget_file}');
  </script>
"""

# Insert before </body>
content_00 = content_00.replace('</body>', widget_scripts + '</body>')
print(f"✓ Added {len(missing_widgets_00)} widget initializations to Lecture 00")

with open(html_00, 'w') as f:
    f.write(content_00)

# Lecture 01 updates
html_01 = '/home/user/Convex/topics/01-introduction/index.html'
with open(html_01, 'r') as f:
    content_01 = f.read()

# Add modern-widgets.css if not present
if '/static/css/modern-widgets.css' not in content_01:
    content_01 = content_01.replace(
        '<link rel="stylesheet" href="../../static/css/styles.css" />',
        '<link rel="stylesheet" href="../../static/css/styles.css" />\n  <link rel="stylesheet" href="/static/css/modern-widgets.css" />'
    )
    print("✓ Added modern-widgets.css to Lecture 01")

# Add missing widget scripts
missing_widgets_01 = [
    ('problem-gallery', 'initProblemGallery'),
    ('convergence-comparison', 'initConvergenceComparison')
]

widget_scripts_01 = ""
for widget_file, init_func in missing_widgets_01:
    widget_scripts_01 += f"""  <script type="module">
    import {{ {init_func} }} from './widgets/js/{widget_file}.js';
    {init_func}('widget-{widget_file}');
  </script>
"""

# Insert before </body>
content_01 = content_01.replace('</body>', widget_scripts_01 + '</body>')
print(f"✓ Added {len(missing_widgets_01)} widget initializations to Lecture 01")

with open(html_01, 'w') as f:
    f.write(content_01)

print("\n✅ Lectures 00 and 01 HTML files updated successfully!")
print(f"   Lecture 00: Added CSS + {len(missing_widgets_00)} widgets")
print(f"   Lecture 01: Added CSS + {len(missing_widgets_01)} widgets")

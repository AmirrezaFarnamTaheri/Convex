# Content Data Files

This directory contains JSON data files that drive the course structure.

## Files

### lectures.json
- Purpose: Master list of all 11 lectures
- Schema: See `/docs/DATA_SCHEMA.md`
- Updated: When adding a new lecture or changing metadata
- Size: ~2KB (should stay small)

### resources.json
- Purpose: External links to textbooks, tools, papers
- Schema: Array of {title, href} objects
- Updated: When course recommends new resources
- Size: ~1KB

### prerequisites.json (Optional)
- Purpose: Define prerequisite relationships between lectures
- Alternative: Include prerequisites directly in lectures.json
- Status: To be decided

## Adding New Data

Before creating a new JSON file, consider:
1. Could this data be merged into an existing file?
2. Will this file be queried frequently?
3. Is this data lecture-specific or site-wide?

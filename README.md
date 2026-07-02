# WP → Sanity Migrator

Template for pulling content out of a WordPress site and turning it into a Sanity dataset import (`.ndjson`). Works against both a self-hosted WordPress REST API (`wp-json/wp/v2`) and the WordPress.com `v1.1` API — `utils/fetch.js` detects which shape a response is in automatically.

To spin out a new exporter from this template for a new site: copy the repo, then follow Setup below.

## Setup

1. **Config file.** Copy [data/config.example.js](data/config.example.js) to `data/config.js` and fill in the real values (domain, WooCommerce keys, event/venue endpoints — see the comments in the example file). `data/config.js` is gitignored — every script that talks to WordPress imports it from that same fixed path, so there's nothing else to wire up.
   - Not sure what `domain` should be, or what post types/endpoints a given site exposes? Run `node listPostTypes.js` once the domain is set (see Scripts below).
2. **Sanity env vars.** Create a `.env` (gitignored) with:
   ```
   SANITY_STUDIO_PROJECT_ID=
   SANITY_STUDIO_DATASET=
   SANITY_STUDIO_API_VERSION=
   ```
   Used by [sanity.cli.ts](sanity.cli.ts) for the `sanity dataset` commands below.
3. **`json2nd`.** The `gen` script pipes through the [json2nd](https://github.com/bcicen/json2nd) CLI to convert the export to newline-delimited JSON. Install it separately (it's not an npm dependency of this project).

## How a migration is defined

[data/collections.js](data/collections.js) is the source of truth for what gets migrated: it lists each content type (`post`, `page`, `event`, `venue`, `book`, `review`, taxonomies, etc.), which WordPress endpoint(s) to pull from, and which `transformers/*.js` function turns a raw WP entry into a Sanity document. Only the entries left uncommented in the exported `collections` array at the bottom of the file actually run — comment/uncomment types there to control scope for a given migration.

## Scripts

| Command | File | What it does |
| --- | --- | --- |
| `npm run gen` | `export.js` | Runs the full migration: walks every enabled collection in `data/collections.js`, transforms entries, writes `sanity_export.json` (and a `sanity_export_readable.json` pretty-printed copy), then converts it to `sanity_export.ndjson` via `json2nd`. This is the main entry point. |
| `npm run export:output` | `output.js` | A small ad-hoc/debug script — currently just runs a WP post title through `getTitle()` and logs the result. Useful for testing title-cleanup logic in isolation, not a full export despite the name. |
| `npm run export:test` | `test.js` | Sanity-checks an already-generated `sanity_export.json`: flags duplicate `_id`s and broken `_ref` relationships (including nested `production_credits.staffMembers` refs). Run this after `npm run gen` and before importing. |
| `npm run export` | — | Imports `sanity_export.ndjson` into the Sanity dataset named in the script (`staging` by default) via `sanity dataset import --allow-failing-assets --replace`. Adjust the dataset name in `package.json` per project/environment. |
| `npm run dataset:delete` | — | **Destructive.** Deletes the `production` dataset via the Sanity CLI. Confirm the dataset name before running. |
| `node storeMedia.js` | `storeMedia.js` | Pages through the WP `media` endpoint (100/page) and writes each page to `data/media/store_N.json`, stopping automatically once a page comes back short. Run this periodically to refresh the media snapshot that [utils/getMedia.js](utils/getMedia.js) resolves `id → Sanity asset ref` from. |
| `node storeReviews.js` | `storeReviews.js` | Same pattern as `storeMedia.js`, but for the `sm_reviews` custom post type, writing to `data/reviews/store_N.json`. Backs [utils/getReviews.js](utils/getReviews.js), which looks up reviews related to a given author/book id. |
| `node listPostTypes.js` | `listPostTypes.js` | Diagnostic script for spinning out a new project: lists every post type registered on the site pointed to by `data/config.js`'s `domain`, with the actual REST endpoint slug to use for each (which can differ from the type name, e.g. `nav_menu_item` → `menu-items`). Works against both self-hosted and wp.com sites. Run this first when wiring up `data/collections.js` for a new site. |

`storeMedia.js`, `storeReviews.js`, and `listPostTypes.js` aren't wrapped in npm scripts — run them directly with `node`.

### Typical flow

```
node listPostTypes.js     # (new project) discover available post types/endpoints
node storeMedia.js        # refresh media snapshot (occasionally)
node storeReviews.js      # refresh reviews snapshot (occasionally)
npm run gen                # produce sanity_export.json / .ndjson
npm run export:test        # sanity-check the export
npm run export              # import into Sanity
```

## Known limitations

- `sanity dataset import` (`npm run export`) targets `staging` while `dataset:delete` targets `production` — these are independent, hardcoded dataset names in `package.json`, not derived from `.env`. Double-check before running either.
- WooCommerce (`/wc/*`) and Tribe Events (`tribe/events`, venues) endpoints currently 404 against the configured `domain` — `utils/fetch.js` has dead code that was meant to route those to a different base URL but never does. `event`, `venue`, `book`, `bookEdition`, and taxonomy collections, plus anything hitting those endpoints, won't work until that's fixed.

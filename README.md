# WP → Sanity Migrator

Template for pulling content out of a WordPress site and turning it into a Sanity dataset import (`.ndjson`). Works against both a self-hosted WordPress REST API (`wp-json/wp/v2`) and the WordPress.com `v1.1` API — `utils/fetch.js` detects which shape a response is in automatically.

To spin out a new exporter from this template for a new site: copy the repo, then follow Setup below.

Cross-directory imports (config, `utils/*`, `transformers/*`, `pt/*`) use Node's native subpath imports rather than deep relative paths — see the `imports` map in [package.json](package.json). Import them as `#config`, `#utils/getMedia.js`, `#transformers/base.js`, `#pt/generatePortableText.js`, etc., regardless of which directory the importing file lives in. This works with plain `node`, no bundler or loader required.

## Setup

1. **Config file.** Copy [config.example.js](config.example.js) to `config.js` and fill in the real values (domain, WooCommerce keys, event/venue endpoints — see the comments in the example file). `config.js` is gitignored — every script that talks to WordPress imports it from that same fixed path, so there's nothing else to wire up.
   - Not sure what `domain` should be, or what post types/endpoints a given site exposes? Run `node scripts/listPostTypes.js` once the domain is set (see Scripts below).
2. **Sanity env vars.** Create a `.env` (gitignored) with:
   ```
   SANITY_STUDIO_PROJECT_ID=
   SANITY_STUDIO_DATASET=
   SANITY_STUDIO_API_VERSION=
   ```
   Used by [sanity.cli.ts](sanity.cli.ts) for the `sanity dataset` commands below.
3. **`json2nd`.** The `gen` script pipes through the [json2nd](https://github.com/bcicen/json2nd) CLI to convert the export to newline-delimited JSON. Install it separately (it's not an npm dependency of this project).

## How a migration is defined

Each content type the template knows how to migrate (`post`, `page`, `event`, `venue`, `book`, `review`, taxonomies, etc.) is its own self-contained file under [data/collections/](data/collections/): which WordPress endpoint(s) to pull from, and the transform function that turns a raw WP entry into a Sanity document, live together in that one file. [data/collections/index.js](data/collections/index.js) registers all of them by name — that file is template code and shouldn't need editing per project.

The five taxonomy-term collections (`taxonomyCategory`, `taxonomyTag`, `taxonomyGenre`, `taxonomyBookCategory`, `taxonomyBookTag`) share one transform function, kept separately at [transformers/term.js](transformers/term.js) rather than duplicated across files. [transformers/base.js](transformers/base.js), [transformers/rel.js](transformers/rel.js) and [transformers/rels.js](transformers/rels.js) are low-level helpers (shared field defaults, Sanity `_ref` builders) composed inside several collection files' transform functions — not full transformers themselves, so they also stay put.

What actually runs for a given project is controlled by `enabled_collections` in `config.js` (a list of names from the registry), not by editing code. Project-specific knobs that individual collection files read — WP page IDs to exclude, a post date cutoff, taxonomy term IDs, etc. — also live in `config.js`, alongside the other per-project values; see the commented-out examples in [config.example.js](config.example.js).

Adding a genuinely new content type (not just enabling an existing one) means adding a new file to `data/collections/` and registering it in `index.js` — that's the one case that touches template code rather than just config.

## Scripts

| Command | File | What it does |
| --- | --- | --- |
| `npm run gen` | `export.js` | Runs the full migration: walks every collection listed in `config.enabled_collections`, transforms entries, writes `sanity_export.json` (and a `sanity_export_readable.json` pretty-printed copy), then converts it to `sanity_export.ndjson` via `json2nd`. This is the main entry point — the only script that lives at the repo root rather than in `scripts/`. |
| `npm run export:output` | `scripts/output.js` | A small ad-hoc/debug script — currently just runs a WP post title through `getTitle()` and logs the result. Useful for testing title-cleanup logic in isolation, not a full export despite the name. |
| `npm run export:test` | `scripts/test.js` | Sanity-checks an already-generated `sanity_export.json`: flags duplicate `_id`s and broken `_ref` relationships (including nested `production_credits.staffMembers` refs). Run this after `npm run gen` and before importing. |
| `npm run export` | — | Imports `sanity_export.ndjson` into the Sanity dataset named in the script (`staging` by default) via `sanity dataset import --allow-failing-assets --replace`. Adjust the dataset name in `package.json` per project/environment. |
| `npm run dataset:delete` | — | **Destructive.** Deletes the `production` dataset via the Sanity CLI. Confirm the dataset name before running. |
| `node scripts/storeMedia.js` | `scripts/storeMedia.js` | Pages through the WP `media` endpoint (100/page) and writes each page to `data/media/store_N.json`, stopping automatically once a page comes back short. Run this periodically to refresh the media snapshot that [utils/getMedia.js](utils/getMedia.js) resolves `id → Sanity asset ref` from. |
| `node scripts/storeReviews.js` | `scripts/storeReviews.js` | Same pattern as `storeMedia.js`, but for the `sm_reviews` custom post type, writing to `data/reviews/store_N.json`. Backs [utils/getReviews.js](utils/getReviews.js), which looks up reviews related to a given author/book id. |
| `node scripts/storeBooks.js` | `scripts/storeBooks.js` | Same pattern again, but for the WooCommerce `products` endpoint, writing to `data/books/store_N.json`. Backs [utils/getWPBook.js](utils/getWPBook.js), which the `book` and `bookEdition` transformers use to look up a book's WP data by id. |
| `node scripts/listPostTypes.js` | `scripts/listPostTypes.js` | Diagnostic script for spinning out a new project: lists every post type registered on the site pointed to by `config.js`'s `domain`, with the actual REST endpoint slug to use for each (which can differ from the type name, e.g. `nav_menu_item` → `menu-items`). Works against both self-hosted and wp.com sites. Run this first when wiring up `config.js` for a new site. |

`storeMedia.js`, `storeReviews.js`, `storeBooks.js`, and `listPostTypes.js` aren't wrapped in npm scripts — run them directly with `node scripts/<name>.js`. All three `store*.js` scripts, and the `utils/getMedia.js` / `getReviews.js` / `getWPBook.js` lookups behind them, share one mechanism: [utils/loadStoreFiles.js](utils/loadStoreFiles.js) reads every `data/<category>/store_N.json` file present, in order. The directories are gitignored (`.keep`d empty) so each project's snapshots stay local.

### Typical flow

```
node scripts/listPostTypes.js   # (new project) discover available post types/endpoints
node scripts/storeMedia.js      # refresh media snapshot (occasionally)
node scripts/storeReviews.js    # refresh reviews snapshot (occasionally)
node scripts/storeBooks.js      # refresh book snapshot (occasionally, if migrating books)
npm run gen                     # produce sanity_export.json / .ndjson
npm run export:test             # sanity-check the export
npm run export                  # import into Sanity
```

## Known limitations

- `sanity dataset import` (`npm run export`) targets `staging` while `dataset:delete` targets `production` — these are independent, hardcoded dataset names in `package.json`, not derived from `.env`. Double-check before running either.
- WooCommerce (`/wc/*`) and Tribe Events (`tribe/events`, venues) endpoints currently 404 against the configured `domain` — `utils/fetch.js` has dead code that was meant to route those to a different base URL but never does. `event`, `venue`, `book`, `bookEdition`, and taxonomy collections, plus anything hitting those endpoints, won't work until that's fixed.

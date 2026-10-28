# Shared site navigation

The public site links Resume (/), Bell Collection (/#/bells), Learning Reader (/learning-reader/), and Fantasy Football (/fantasy/).

public/site-nav.mjs is a self-contained navigation component. Keep its versioned module script in the portfolio HTML, the published learning-reader/index.html, and the fantasy export. The component reserves 48px above the reader's fixed shelf and reading panels. It provides a Projects menu on phones and active links across the portfolio's hash routes.

The fantasy frontend uses the existing cloud report API and Tuesday 6 a.m. America/Toronto refresh through Week 14. Routine updates change the saved report, without rebuilding GitHub Pages. Source and public assets originate in the WG Site checkout; scripts/export-pages.mjs prepares the public/fantasy files. Keep the root navigation module synchronized when updating them.

The old /wang-gang/ index redirects to /fantasy/ and preserves comparison hashes and queries. When updating gh-pages, merge the changed paths into its existing tree, preserving the Learning Reader and portfolio assets.

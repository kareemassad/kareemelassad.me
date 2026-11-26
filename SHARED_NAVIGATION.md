# Shared site navigation

The public site links Resume (/), Bell Collection (/#/bells), Learning Reader (/learning-reader/), and Fantasy Football (/fantasy/).

public/site-nav.mjs is a self-contained navigation component. Keep its versioned module script in the portfolio HTML, the published learning-reader/index.html, and the fantasy export. The component reserves 48px above the reader's fixed shelf and reading panels. It provides a Projects menu on phones and active links across the portfolio's hash routes.

The fantasy frontend uses the existing cloud report API and Tuesday 6 a.m. America/Toronto refresh through Week 14. Routine updates change the saved report without rebuilding GitHub Pages.

The private repository [kareemassad/schedule-lab](https://github.com/kareemassad/schedule-lab) is the source for the fantasy app. After a reviewed source change reaches its `source` branch, its workflow builds and publishes generated files to `fantasy/` on this repository's `gh-pages` branch. The publication script preserves every other published path. Do not add a `public/fantasy` source copy here.

The portfolio deployment uses `gh-pages --add`. This preserves the generated fantasy route and other independently published projects. Fantasy deployments do not rebuild the portfolio. The generated `fantasy/source.json` identifies the source commit and file hashes for the current fantasy build. To change shared navigation in the fantasy app, open a PR in the Schedule Lab repository.

The old /wang-gang/ index redirects to /fantasy/ and preserves comparison hashes and queries. When updating gh-pages, merge the changed paths into its existing tree, preserving the Learning Reader and portfolio assets.

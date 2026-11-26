# Shared site navigation

The public site links Resume (/), Bell Collection (/#/bells), Learning Reader (/learning-reader/), and Fantasy Football (/fantasy/).

`public/site-nav.mjs` is the source for shared project navigation. Make common navigation changes in this repository. Portfolio deployment publishes the module at `/site-nav.mjs`; the fantasy page loads `https://kareemelassad.me/site-nav.mjs` directly, so Schedule Lab does not maintain or bundle another copy. Keep the module script in the portfolio and reader HTML. The component reserves 48px above the reader's fixed shelf and reading panels. It provides a Projects menu on phones and active links across the portfolio's hash routes.

The fantasy frontend uses the existing cloud report API and Tuesday 6 a.m. America/Toronto refresh through Week 14. Routine updates change the saved report without rebuilding GitHub Pages.

The private repository [kareemassad/schedule-lab](https://github.com/kareemassad/schedule-lab) is the source for the fantasy app. After a reviewed source change reaches its `source` branch, its workflow builds and publishes generated files to `fantasy/` on this repository's `gh-pages` branch. The publication script preserves every other published path. Do not add a `public/fantasy` source copy here.

The portfolio deployment uses `gh-pages --add`. This preserves the generated fantasy route and other independently published projects. It also retains old portfolio bundles and deleted pages. Remove confirmed stale portfolio files in a reviewed cleanup PR against `gh-pages`; preserve `fantasy/`, `learning-reader/`, and `CNAME`. Fantasy deployments do not rebuild the portfolio. The generated `fantasy/source.json` identifies the source commit and file hashes for the current fantasy build. Make fantasy-specific interface changes in the Schedule Lab repository.

The old /wang-gang/ index redirects to /fantasy/ and preserves comparison hashes and queries. When updating gh-pages, merge the changed paths into its existing tree, preserving the Learning Reader and portfolio assets.

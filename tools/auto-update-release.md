# Customer Auto-Update Release

The direct-download Windows app uses `electron-updater` with the `latest` generic feed. Customer installs check at startup and every six hours, download a newer release automatically, and install it when the app exits/restarts. This applies to installed NSIS builds, not portable builds or Microsoft Store installs.

## One-Time Setup

1. Choose a permanent public HTTPS directory for the update feed, for example `https://updates.your-domain.example/repair-suite`. Do not change this URL after shipping the first customer build.
2. Configure a static web root at that URL. It must serve files directly over HTTPS. Configure `latest.yml` to revalidate/no-cache and versioned installers/blockmaps as immutable. Use a dedicated web-root directory because deploy clears the selected target directory before copying staged feed files.
3. Set the environment values in PowerShell before preparing the initial installer:

```powershell
$env:REPAIR_SUITE_UPDATE_FEED_URL = 'https://YOUR-PUBLIC-HOST/repair-suite'
$env:REPAIR_SUITE_UPDATE_MANUAL_URL = 'https://YOUR-PUBLIC-HOST/repair-suite' # optional
$env:UPDATE_WEBROOT_PATH = 'C:\inetpub\wwwroot\repair-suite'
```

4. Use the same trusted Windows code-signing certificate for every customer release. Keep certificate secrets outside source control.
5. Build and deliver this first installer to customers. It contains the permanent feed URL. Older installs built without that URL cannot discover this feed and must be replaced manually once.

## Every Release

Run from `_private_dev/source/app_extracted` in the same PowerShell session where the environment values are set:

```powershell
npm version --no-git-tag-version patch
npm run release:installer
npm run updates:stage
npm run updates:deploy:webroot
```

Use `minor` or `major` instead of `patch` when appropriate. Review the package version change and generated `release/update-feed/latest` contents before deployment. The staged files include the NSIS installer, blockmap, `latest.yml`, download page, and checklist. The deploy command copies them to `UPDATE_WEBROOT_PATH`.

The updater build now rejects enabled feeds without a URL, rejects non-HTTPS customer feeds, and refuses to stage an enabled release if electron-builder did not produce `latest.yml`.

## Limitations

- The update URL is compiled into each installer. Changing it requires a new manually distributed installer.
- Feed hosting and DNS are not configured by this repository. A real HTTPS hostname and web root are required before automatic customer updates can work.
- Microsoft Store installations are updated through Store publishing, not this generic feed.
- No release is published by these commands until `updates:deploy:webroot` is run. Confirm the hosted `latest.yml` and installer URLs are reachable before announcing a release.

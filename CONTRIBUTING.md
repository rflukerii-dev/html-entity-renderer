# Contributing to HTML Entity Renderer

Thanks for helping. Bug reports, ideas and pull requests are all welcome.

## Reporting a bug

Open an [issue](https://github.com/rflukerii-dev/html-entity-renderer/issues) and include:

- Your Obsidian version (**Settings → About**) and platform (Windows, macOS, Linux, iOS or Android)
- The editing mode. The plugin only works in Live Preview; Source mode shows raw text on purpose.
- The exact text that misbehaves, pasted in a code block
- What you expected and what happened instead
- A screenshot, if it helps
- Whether the problem still happens with other community plugins turned off

## Suggesting a feature

Open an issue before writing code, so we can agree on the approach first.

## Scope

The plugin renders HTML character entities as characters in Live Preview. It:

- never changes the contents of your files
- leaves entities in inline code, code blocks, escaped entities (`\&copy;`) and entities that are invalid or invisible as written
- has no settings

Out of scope:

- Converting entities in the file itself. A text-replacement plugin is a better fit for that.
- Reading view, which Obsidian already handles
- Source mode

## Development setup

You need Node.js 18 or later.

    npm install
    npm test

`main.js` is the source and needs no bundling, so edit it directly. `npm run build` only syntax-checks it.

To try your changes in Obsidian, use a test vault, not your main one:

1. Copy `main.js`, `manifest.json` and `styles.css` into `<vault>/.obsidian/plugins/html-entity-renderer/`, or link that folder to your clone.
2. After each change, turn the plugin off and on in **Settings → Community plugins**, or run **Reload app without saving** from the command palette.

Before opening a pull request that changes rendering behavior, walk through `tests/manual/live-preview-test-cases.md` in Live Preview in your test vault. Automated tests can't cover the editor, so this checklist is how we check it.

## Pull requests

- Open an issue first for anything bigger than a small fix.
- Keep each pull request to one focused change.
- Write commit messages in the [Conventional Commits](https://www.conventionalcommits.org/) style, such as `fix: keep entities inside inline code`. Use a short summary in the imperative mood.
- Add or update tests in `tests/main.test.js`, and make sure `npm test` passes.
- If your change affects rendering, also run through `tests/manual/live-preview-test-cases.md` in Live Preview and mention any failures in the pull request.
- Keep `main.js` plain, readable JavaScript with no bundler step and no new runtime dependencies. `obsidian` and `@codemirror/*` come from Obsidian at runtime.
- Leave version numbers and release files alone. The maintainer handles releases.

## Releasing (maintainer)

1. Set `version` in `manifest.json` to the new `x.y.z`, with no `v`.
2. Run `npm version x.y.z --no-git-tag-version` to update `package.json` and both versions in `package-lock.json`.
3. Run `npm run build` and `npm test`.
4. Confirm that all four versions match:

        grep -n '"version"' manifest.json package.json
        head -12 package-lock.json | grep -n '"version"'

5. Commit and push to `main`.
6. Create a GitHub release:
   - Tag it `x.y.z`, with no `v`, targeting `main`.
   - Write notes for users, and wrap entities in backticks so GitHub doesn't render them.
   - Attach fresh copies of `main.js`, `manifest.json` and `styles.css` from the repo.
7. On the community directory dashboard:
   - Run **Check for new releases**, then confirm the review passes.
   - If the manifest description changed, update the listing's short description by hand.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).

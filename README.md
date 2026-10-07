# HTML Entity Renderer for Obsidian

Renders HTML character entities in the Obsidian editor without changing the Markdown source.

Examples:

- `&copy;` displays as ©
- `&amp;` displays as &
- `&mdash;` displays as —
- `&#169;` displays as ©
- `&#xA9;` displays as ©

When the cursor enters an entity, the original source is revealed so it can be edited.

Entities are only rendered in Live Preview. Source mode, inline code, code blocks, and backslash-escaped entities (`\&copy;`) are left as written, matching Reading view.

Entities that would display as nothing or as a line break (`&NewLine;`, `&Tab;`, `&shy;`, `&zwj;`, `&#x200B;`) and invalid numeric references (`&#0;`, `&#xD800;`) are also left as source, so they stay visible and editable.

## Install manually

1. Close Obsidian, or leave it open and reload after installation.
2. Open your vault folder.
3. Open `.obsidian/plugins/`.
4. Create a folder named `html-entity-renderer`.
5. Put `main.js`, `manifest.json`, and `styles.css` in that folder.
6. In Obsidian, go to **Settings → Community plugins**.
7. If prompted, turn off **Restricted mode**.
8. Click the refresh/reload button if the plugin is not listed, or restart Obsidian.
9. Enable **HTML Entity Renderer**.

Test with:

    Copyright &copy; 2026
    Fish &amp; Chips
    A&nbsp;B
    &#169; and &#xA9;

The file itself remains unchanged; only the editor display is decorated.

## Development

`package.json` and `tests/` are only needed for development; don't copy them into the vault. To run the unit tests (Node.js 18 or later):

    npm install
    npm test

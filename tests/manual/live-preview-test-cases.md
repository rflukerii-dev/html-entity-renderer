---
tags: [entity-test]
title: "Fish &amp; Chips"
note: "Properties should stay source: &mdash; &rarr; &copy;"
---
# Example markdown for HTML Entity Renderer test cases

Open this note in **Live Preview** with the plugin enabled. Keep the caret away from the lines you check. Tick each box when the line behaves as described.

Source of truth for "should render": what Reading view shows. Switch to Reading view at any point to compare.

---

# Group 1 -- Should render

Each line shows the entity as source in a code span, then the live entity after the colon. Pass = you see the character, not the `&...;` text.

## 1.1 Entity forms

- [ ] `&mdash;` em dash: a&mdash;b
- [ ] `&rarr;` arrow: A &rarr; B
- [ ] `&amp;` ampersand: Fish &amp; Chips
- [ ] `&lt;` `&gt;` angle brackets: &lt;div&gt;
- [ ] `&copy;` `&reg;` `&trade;` symbols: &copy; &reg; &trade;
- [ ] `&eacute;` accent: caf&eacute;
- [ ] `&hellip;` ellipsis: wait&hellip;
- [ ] `&nbsp;` non-breaking space (looks like a space, not source): one&nbsp;&nbsp;&nbsp;two
- [ ] `&#8212;` decimal: x&#8212;y
- [ ] `&#x2014;` and `&#X2014;` hex, either case: x&#x2014;y and x&#X2014;y
- [ ] `&#39;` apostrophe: it&#39;s
- [ ] `&#128;` should show a euro sign (Reading view does this too; confirm they match): &#128;
- [ ] `&NotEqualTilde;` two-character entity: &NotEqualTilde;
- [ ] Back to back `&lt;&amp;&gt;`: &lt;&amp;&gt;
- [ ] No spaces around it: Tom&amp;Jerry
- [ ] No double decoding. `&amp;rarr;` should show the literal text &amp;rarr; and not an arrow.
- [ ] Even backslashes don't escape. `\\&mdash;` should show a backslash pair or one backslash, then an em dash: \\&mdash;

## 1.2 Block types

### Heading with &mdash; entity and &rarr; arrow

- [ ] Bullet: &copy; 2026
  - [ ] Nested bullet: A &rarr; B
    1. Numbered: &lt;one&gt;
    2. Numbered: &lt;two&gt;
- [ ] Bold **Fish &amp; Chips**, italic *caf&eacute;*, strikethrough ~~a&mdash;b~~, highlight ==x &rarr; y==

> [!note] Callout title &rarr; entity
> Callout body: Fish &amp; Chips &mdash; caf&eacute;

> Plain blockquote: &ldquo;quoted&rdquo; text

Footnote reference[^1].

[^1]: Footnote text: a&mdash;b &rarr; c

## 1.3 Tables

Check twice: once rendered, once with the caret inside a cell. While the caret is inside the entity, that one entity should show its source. The rest of the table should keep rendering.

| Entity    | Live             | Plain |
| --------- | ---------------- | ----- |
| `&mdash;` | a&mdash;b        | text  |
| `&rarr;`  | A &rarr; B       | text  |
| `&amp;`   | Fish &amp; Chips | text  |

## 1.4 Links

- [ ] Markdown link text: [Fish &amp; Chips](https://example.com)
- [ ] Wikilink alias: [[Nonexistent note|Fish &amp; Chips]]
- [ ] Wikilink alias with arrow: [[Nonexistent note|Next &rarr; page]]

## 1.5 Inline HTML

- [ ] `<span>&rarr;</span>`: <span>&rarr;</span>
- [ ] `<b>`: <b>Fish &amp; Chips</b>
- [ ] `<kbd>`: Press <kbd>&uarr;</kbd> then <kbd>&darr;</kbd>
- [ ] Mixed: before <i>caf&eacute;</i> after &mdash; done

---

# Group 2 -- Should stay source

Pass = you see the literal `&...;` text exactly as typed. Lines marked **audit risk** are the ones the audit says the code may not exclude yet. If they render, the README's "matching Reading view" claim is wrong for that case.

## 2.1 Escaped

- [ ] Single backslash. Should NOT render: \&mdash;
- [ ] Triple backslash. Should NOT render: \\\&mdash;

## 2.2 Code (excluded today)

- [ ] Inline code: `&mdash; &rarr; &amp;`
- [ ] Inline code with spaces: ` &copy; `

Fenced block:

```html
<p>Fish &amp; Chips &mdash; caf&eacute;</p>
<span>&rarr;</span>
```

- [ ] Tilde fence:

~~~
&lt;div&gt; &mdash; &#8212;
~~~

- [ ] Fence with no language:

```
&copy; &reg; &trade;
```

## 2.3 Not excluded today (audit risk)

Expected by Reading view: stay source. The code skips only inline code and fenced blocks, so these may render. Record which ones do.

- [ ] **Audit risk** Indented code (four spaces, after a blank line):

    &mdash; &rarr; &amp; indented code

- [ ] **Audit risk** Inline math: $a &lt; b$ and $x &rarr; y$
- [ ] **Audit risk** Block math:

$$
a &lt; b \quad c &rarr; d
$$

- [ ] **Audit risk** Inline comment: %% hidden &mdash; &rarr; %%
- [ ] **Audit risk** Block comment:

%%
&copy; &reg; &trade; inside a comment
%%

- [ ] **Audit risk** Properties (see the top of this note): `title`, `note` should stay source. Check in Live Preview with Properties shown as source, and again in the Properties UI.

## 2.4 Not a real entity

- [ ] Unknown name: &notarealentity;
- [ ] Partial legacy name, `&copyright;` must NOT become a copyright sign plus "right;": &copyright;
- [ ] Missing semicolon: &amp and &mdash
- [ ] Empty: &; and &#; and &#x;
- [ ] Space inside: & mdash; and &mdash ;
- [ ] Zero: &#0;
- [ ] Surrogate: &#xD800; and &#55296;
- [ ] Out of range: &#1114112; and &#x110000;
- [ ] Too many digits, decimal: &#12345678;
- [ ] Too many digits, hex: &#x1234567;

## 2.5 Invisible results

These decode to characters that render as nothing or break the line, so they should stay source. Note `&Tab;` is on the audit's README fix list.

- [ ] `&ZeroWidthSpace;` : a&ZeroWidthSpace;b
- [ ] `&shy;` : a&shy;b
- [ ] `&zwj;` and `&zwnj;` : a&zwj;b a&zwnj;b
- [ ] `&lrm;` and `&rlm;` : a&lrm;b a&rlm;b
- [ ] `&Tab;` : a&Tab;b
- [ ] `&NewLine;` : a&NewLine;b
- [ ] `&#8203;` and `&#x200B;` : a&#8203;b a&#x200B;b
- [ ] `&#10;` and `&#13;` : a&#10;b a&#13;b

## 2.6 While editing

- [ ] Caret inside: put the caret in the middle of the entity in x&mdash;y. The source must show. Move away and it re-renders.
- [ ] Caret directly beside: click just before and just after the entity in x&mdash;y. The source shows in both positions.
- [ ] Selection: drag-select across x&mdash;y and x&rarr;y. Both show source while selected.
- [ ] Typing: at the end of this line type `&mdash;` slowly: x
- [ ] Deleting: with the caret after a rendered entity, press Backspace once. Check what is removed, one character or the whole entity.

## 2.7 Other modes

- [ ] Source mode: switch to Source mode. Nothing in this note renders, including Group 1.
- [ ] Reading view: Group 1 and Reading view show the same characters. Group 2 items should match Reading view too, apart from the audit risks above.

---

# Manual-only checks

These don't fit a text line. Tick each one as you test.

- [ ] Desktop Live Preview: all of Group 1 and 2 above
- [ ] Split panes: open this note in two panes. The caret in one pane does not reveal source in the other.
- [ ] Popout window: drag this note into its own window. Group 1 still renders. Typing and moving the caret still work.
- [ ] Canvas text card: add a card with the text below. Note whether the entities render.
- [ ] Hover tooltip: hover over a rendered entity in Group 1. Count the tooltips. The audit expects at most one.
- [ ] Lag: scroll and type in the stress section below. Note any stutter.
- [ ] iOS: open this note in Live Preview and repeat Groups 1 and 2.
- [ ] Android: same.
- [ ] Obsidian version tested (write it here): 

Canvas card text to paste:

```
Fish &amp; Chips &mdash; caf&eacute; &rarr; done
```

---

# Stress -- should render

Long run of lines. Every entity here should render. Scroll fast, then type at the top and bottom.

Line 1: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;1 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 2: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;2 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 3: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;3 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 4: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;4 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 5: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;5 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 6: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;6 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 7: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;7 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 8: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;8 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 9: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;9 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 10: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;10 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 11: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;11 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 12: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;12 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 13: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;13 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 14: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;14 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 15: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;15 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 16: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;16 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 17: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;17 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 18: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;18 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 19: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;19 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 20: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;20 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 21: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;21 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 22: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;22 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 23: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;23 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 24: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;24 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 25: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;25 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 26: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;26 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 27: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;27 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 28: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;28 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 29: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;29 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 30: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;30 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 31: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;31 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 32: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;32 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 33: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;33 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 34: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;34 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 35: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;35 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 36: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;36 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 37: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;37 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 38: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;38 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 39: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;39 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 40: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;40 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 41: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;41 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 42: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;42 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 43: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;43 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 44: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;44 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 45: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;45 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 46: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;46 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 47: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;47 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 48: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;48 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 49: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;49 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 50: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;50 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 51: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;51 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 52: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;52 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 53: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;53 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 54: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;54 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 55: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;55 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 56: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;56 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 57: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;57 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 58: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;58 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 59: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;59 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 60: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;60 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 61: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;61 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 62: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;62 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 63: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;63 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 64: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;64 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 65: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;65 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 66: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;66 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 67: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;67 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 68: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;68 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 69: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;69 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 70: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;70 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 71: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;71 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 72: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;72 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 73: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;73 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 74: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;74 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 75: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;75 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 76: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;76 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 77: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;77 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 78: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;78 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 79: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;79 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 80: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;80 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 81: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;81 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 82: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;82 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 83: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;83 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 84: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;84 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 85: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;85 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 86: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;86 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 87: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;87 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 88: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;88 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 89: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;89 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 90: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;90 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 91: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;91 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 92: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;92 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 93: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;93 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 94: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;94 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 95: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;95 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 96: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;96 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 97: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;97 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 98: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;98 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 99: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;99 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 100: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;100 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 101: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;101 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 102: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;102 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 103: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;103 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 104: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;104 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 105: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;105 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 106: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;106 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 107: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;107 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 108: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;108 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 109: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;109 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 110: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;110 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 111: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;111 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 112: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;112 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 113: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;113 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 114: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;114 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 115: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;115 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 116: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;116 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 117: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;117 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 118: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;118 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 119: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;119 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 120: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;120 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 121: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;121 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 122: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;122 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 123: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;123 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 124: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;124 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 125: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;125 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 126: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;126 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 127: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;127 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 128: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;128 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 129: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;129 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 130: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;130 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 131: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;131 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 132: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;132 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 133: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;133 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 134: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;134 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 135: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;135 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 136: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;136 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 137: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;137 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 138: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;138 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 139: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;139 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 140: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;140 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 141: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;141 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 142: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;142 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 143: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;143 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 144: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;144 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 145: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;145 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 146: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;146 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 147: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;147 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 148: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;148 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 149: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;149 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 150: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;150 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 151: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;151 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 152: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;152 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 153: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;153 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 154: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;154 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 155: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;155 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 156: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;156 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 157: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;157 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 158: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;158 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 159: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;159 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 160: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;160 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 161: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;161 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 162: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;162 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 163: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;163 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 164: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;164 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 165: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;165 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 166: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;166 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 167: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;167 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 168: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;168 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 169: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;169 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 170: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;170 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 171: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;171 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 172: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;172 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 173: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;173 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 174: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;174 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 175: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;175 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 176: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;176 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 177: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;177 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 178: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;178 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 179: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;179 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 180: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;180 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 181: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;181 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 182: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;182 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 183: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;183 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 184: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;184 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 185: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;185 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 186: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;186 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 187: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;187 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 188: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;188 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 189: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;189 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 190: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;190 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 191: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;191 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 192: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;192 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 193: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;193 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 194: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;194 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 195: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;195 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 196: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;196 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 197: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;197 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 198: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;198 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 199: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;199 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 200: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;200 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 201: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;201 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 202: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;202 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 203: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;203 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 204: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;204 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 205: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;205 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 206: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;206 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 207: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;207 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 208: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;208 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 209: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;209 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 210: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;210 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 211: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;211 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 212: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;212 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 213: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;213 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 214: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;214 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 215: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;215 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 216: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;216 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 217: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;217 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 218: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;218 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 219: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;219 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 220: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;220 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 221: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;221 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 222: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;222 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 223: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;223 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 224: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;224 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 225: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;225 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 226: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;226 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 227: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;227 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 228: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;228 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 229: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;229 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 230: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;230 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 231: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;231 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 232: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;232 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 233: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;233 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 234: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;234 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 235: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;235 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 236: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;236 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 237: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;237 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 238: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;238 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 239: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;239 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 240: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;240 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 241: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;241 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 242: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;242 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 243: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;243 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 244: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;244 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 245: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;245 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 246: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;246 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 247: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;247 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 248: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;248 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 249: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;249 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 250: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;250 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 251: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;251 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 252: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;252 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 253: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;253 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 254: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;254 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 255: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;255 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 256: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;256 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 257: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;257 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 258: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;258 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 259: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;259 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 260: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;260 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 261: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;261 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 262: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;262 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 263: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;263 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 264: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;264 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 265: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;265 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 266: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;266 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 267: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;267 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 268: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;268 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 269: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;269 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 270: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;270 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 271: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;271 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 272: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;272 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 273: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;273 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 274: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;274 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 275: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;275 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 276: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;276 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 277: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;277 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 278: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;278 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 279: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;279 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 280: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;280 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 281: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;281 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 282: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;282 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 283: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;283 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 284: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;284 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 285: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;285 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 286: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;286 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 287: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;287 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 288: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;288 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 289: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;289 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 290: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;290 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 291: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;291 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 292: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;292 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 293: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;293 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 294: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;294 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 295: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;295 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 296: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;296 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 297: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;297 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 298: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;298 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 299: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;299 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 300: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;300 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 301: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;301 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 302: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;302 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 303: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;303 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 304: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;304 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 305: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;305 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 306: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;306 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 307: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;307 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 308: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;308 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 309: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;309 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 310: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;310 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 311: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;311 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 312: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;312 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 313: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;313 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 314: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;314 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 315: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;315 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 316: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;316 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 317: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;317 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 318: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;318 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 319: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;319 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 320: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;320 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 321: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;321 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 322: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;322 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 323: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;323 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 324: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;324 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 325: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;325 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 326: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;326 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 327: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;327 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 328: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;328 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 329: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;329 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 330: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;330 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 331: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;331 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 332: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;332 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 333: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;333 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 334: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;334 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 335: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;335 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 336: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;336 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 337: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;337 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 338: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;338 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 339: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;339 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 340: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;340 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 341: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;341 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 342: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;342 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 343: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;343 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 344: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;344 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 345: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;345 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 346: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;346 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 347: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;347 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 348: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;348 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 349: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;349 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 350: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;350 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 351: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;351 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 352: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;352 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 353: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;353 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 354: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;354 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 355: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;355 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 356: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;356 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 357: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;357 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 358: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;358 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 359: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;359 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 360: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;360 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 361: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;361 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 362: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;362 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 363: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;363 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 364: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;364 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 365: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;365 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 366: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;366 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 367: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;367 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 368: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;368 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 369: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;369 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 370: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;370 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 371: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;371 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 372: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;372 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 373: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;373 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 374: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;374 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 375: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;375 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 376: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;376 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 377: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;377 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 378: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;378 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 379: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;379 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 380: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;380 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 381: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;381 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 382: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;382 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 383: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;383 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 384: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;384 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 385: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;385 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 386: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;386 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 387: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;387 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 388: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;388 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 389: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;389 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 390: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;390 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 391: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;391 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 392: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;392 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 393: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;393 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 394: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;394 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 395: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;395 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 396: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;396 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 397: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;397 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 398: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;398 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 399: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;399 &lt;tag&gt; &copy; &#x2713; &hellip;

Line 400: Fish &amp; Chips &mdash; caf&eacute; &rarr; &#8364;400 &lt;tag&gt; &copy; &#x2713; &hellip;

const { Plugin, editorLivePreviewField } = require("obsidian");
const { Decoration, ViewPlugin, WidgetType } = require("@codemirror/view");
const { syntaxTree, syntaxTreeAvailable } = require("@codemirror/language");

// CommonMark limits decimal references to 7 digits and hex references to 6.
const ENTITY_RE = /&(?:#[0-9]{1,7}|#[xX][0-9a-fA-F]{1,6}|[A-Za-z][A-Za-z0-9]+);/g;

// Obsidian's Markdown syntax node names for inline code and code blocks
// (e.g. "formatting_formatting-code_inline-code", "hmd-codeblock").
const CODE_NODE_RE = /inline-code|codeblock/;

// Control, format (zero-width, soft hyphen) and line/paragraph separator
// characters render as nothing or break the line, so they are left as source.
const INVISIBLE_RE = /^[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]+$/u;

const DECODE_CACHE_LIMIT = 1000;
const decodeCache = new Map();

function isValidCodePoint(entity) {
  if (entity[1] !== "#") return true;
  const hex = entity[2] === "x" || entity[2] === "X";
  const codePoint = parseInt(entity.slice(hex ? 3 : 2, -1), hex ? 16 : 10);
  // The parser maps 0, surrogates and out-of-range values to U+FFFD.
  return codePoint > 0 && codePoint <= 0x10ffff && !(codePoint >= 0xd800 && codePoint <= 0xdfff);
}

function decodeUncached(entity) {
  if (!isValidCodePoint(entity)) return null;

  const el = document.createElement("textarea");
  el.innerHTML = entity;
  const decoded = el.value;
  if (decoded === entity) return null;

  // A complete entity decodes to at most two code points. The HTML parser also
  // accepts legacy names without a semicolon, so "&copyright;" decodes only its
  // "&copy" prefix and leaves "right;" behind; reject those partial decodes.
  if ([...decoded].length > 2) return null;

  if (INVISIBLE_RE.test(decoded)) return null;

  return decoded;
}

function decodeEntity(entity) {
  if (decodeCache.has(entity)) return decodeCache.get(entity);

  const decoded = decodeUncached(entity);
  if (decodeCache.size >= DECODE_CACHE_LIMIT) decodeCache.clear();
  decodeCache.set(entity, decoded);
  return decoded;
}

function isLivePreview(state) {
  return state.field(editorLivePreviewField, false) === true;
}

function isEscaped(state, from) {
  // An odd number of backslashes directly before "&" escapes it in Markdown.
  let count = 0;
  for (let pos = from - 1; pos >= 0 && state.doc.sliceString(pos, pos + 1) === "\\"; pos--) {
    count++;
  }
  return count % 2 === 1;
}

function isInCode(tree, from) {
  for (let node = tree.resolveInner(from, 1); node; node = node.parent) {
    if (CODE_NODE_RE.test(node.name)) return true;
  }
  return false;
}

class EntityWidget extends WidgetType {
  constructor(entity, decoded) {
    super();
    this.entity = entity;
    this.decoded = decoded;
  }

  eq(other) {
    return this.entity === other.entity && this.decoded === other.decoded;
  }

  toDOM() {
    const span = document.createElement("span");
    span.className = "html-entity-renderer-widget";
    span.textContent = this.decoded;
    span.title = this.entity;
    span.setAttribute("aria-label", `${this.entity} → ${this.decoded}`);
    return span;
  }

  ignoreEvent() {
    return false;
  }
}

function selectionIntersects(state, from, to) {
  return state.selection.ranges.some(range => {
    // Reveal the source when the caret is inside or directly next to the entity.
    if (range.empty) return range.head >= from && range.head <= to;
    return range.from < to && range.to > from;
  });
}

function buildDecorations(view) {
  const state = view.state;
  // Source mode shows the raw Markdown, so only decorate in Live Preview.
  if (!isLivePreview(state)) return Decoration.none;

  const ranges = [];
  const tree = syntaxTree(state);

  for (const visible of view.visibleRanges) {
    const text = state.doc.sliceString(visible.from, visible.to);
    ENTITY_RE.lastIndex = 0;

    let match;
    while ((match = ENTITY_RE.exec(text)) !== null) {
      const from = visible.from + match.index;
      const to = from + match[0].length;

      if (selectionIntersects(state, from, to)) continue;
      // Until the parser reaches this text, it can't be told apart from code;
      // leave it as source and redraw when the tree grows.
      if (!syntaxTreeAvailable(state, to)) continue;
      if (isEscaped(state, from) || isInCode(tree, from)) continue;

      const decoded = decodeEntity(match[0]);
      if (!decoded) continue;

      ranges.push(
        Decoration.replace({
          widget: new EntityWidget(match[0], decoded),
          inclusive: false
        }).range(from, to)
      );
    }
  }

  return Decoration.set(ranges, true);
}

const entityViewPlugin = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.decorations = buildDecorations(view);
    }

    update(update) {
      if (
        update.docChanged ||
        update.selectionSet ||
        update.viewportChanged ||
        // The parser fills in the tree lazily, and the user can switch modes.
        syntaxTree(update.startState) !== syntaxTree(update.state) ||
        isLivePreview(update.startState) !== isLivePreview(update.state)
      ) {
        this.decorations = buildDecorations(update.view);
      }
    }
  },
  {
    decorations: value => value.decorations
  }
);

module.exports = class HtmlEntityRendererPlugin extends Plugin {
  async onload() {
    this.registerEditorExtension(entityViewPlugin);
  }
};

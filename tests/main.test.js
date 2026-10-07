/**
 * Unit tests for main.js.
 *
 * Obsidian isn't available outside the app, so it is mocked. The Markdown
 * syntax tree is mocked too, because Obsidian's parser names its nodes
 * differently from the public @codemirror/lang-markdown parser. The real
 * @codemirror/state and @codemirror/view are used for documents, selections
 * and decorations; only ViewPlugin.fromClass is replaced, so the tests can
 * drive the plugin class directly without a live EditorView.
 */

jest.mock(
  "obsidian",
  () => {
    const { StateField } = require("@codemirror/state");

    class Plugin {
      constructor() {
        this.extensions = [];
      }

      registerEditorExtension(extension) {
        this.extensions.push(extension);
      }
    }

    const editorLivePreviewField = StateField.define({
      create: () => true,
      update: value => value
    });

    return { Plugin, editorLivePreviewField };
  },
  { virtual: true }
);

jest.mock(
  "@codemirror/language",
  () => {
    const trees = new WeakMap();

    // Builds a fake syntax tree. Each code range becomes a node with the given
    // name; with `nested`, the code node is the parent of a plain text leaf.
    function mockTree(codeRanges = []) {
      const root = { name: "Document", parent: null };
      return {
        resolveInner(pos, side) {
          const hit = codeRanges.find(range =>
            side > 0 ? pos >= range.from && pos < range.to : pos > range.from && pos <= range.to
          );
          if (!hit) return root;
          const codeNode = { name: hit.name, parent: root };
          return hit.nested ? { name: "text", parent: codeNode } : codeNode;
        }
      };
    }

    const defaultTree = mockTree();

    return {
      syntaxTree: jest.fn(state => trees.get(state) || defaultTree),
      syntaxTreeAvailable: jest.fn(() => true),
      __setTree: (state, tree) => trees.set(state, tree),
      __mockTree: mockTree
    };
  },
  { virtual: true }
);

jest.mock("@codemirror/view", () => {
  const actual = jest.requireActual("@codemirror/view");
  return {
    ...actual,
    ViewPlugin: { fromClass: (cls, spec) => ({ cls, spec }) }
  };
});

let EditorState;
let EditorSelection;
let editorLivePreviewField;
let language;
let plugin;
let EntityPluginValue;
let pluginSpec;

beforeEach(async () => {
  // Fresh modules per test, so main.js's decode cache starts empty.
  jest.resetModules();
  ({ EditorState, EditorSelection } = require("@codemirror/state"));
  ({ editorLivePreviewField } = require("obsidian"));
  language = require("@codemirror/language");

  const HtmlEntityRendererPlugin = require("../main.js");
  plugin = new HtmlEntityRendererPlugin();
  await plugin.onload();
  ({ cls: EntityPluginValue, spec: pluginSpec } = plugin.extensions[0]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

// --- Helpers -----------------------------------------------------------------

function makeState(
  doc,
  { cursor = 0, selection, livePreview = true, codeRanges, multipleSelections = false } = {}
) {
  const extensions = [];
  if (livePreview !== null) extensions.push(editorLivePreviewField.init(() => livePreview));
  if (multipleSelections) extensions.push(EditorState.allowMultipleSelections.of(true));

  const state = EditorState.create({
    doc,
    selection: selection || EditorSelection.cursor(cursor),
    extensions
  });

  if (codeRanges) language.__setTree(state, language.__mockTree(codeRanges));
  return state;
}

function viewFor(state, visibleRanges = [{ from: 0, to: state.doc.length }]) {
  return { state, visibleRanges };
}

function build(doc, options = {}) {
  const state = makeState(doc, options);
  return new EntityPluginValue(viewFor(state, options.visibleRanges));
}

function decorationsOf(value) {
  const found = [];
  value.decorations.between(0, Number.MAX_SAFE_INTEGER, (from, to, decoration) => {
    const { widget } = decoration.spec;
    found.push({ from, to, entity: widget.entity, decoded: widget.decoded, widget, decoration });
  });
  return found;
}

// Returns the document text as the editor would display it.
function render(doc, options) {
  const value = build(doc, options);
  let output = "";
  let pos = 0;
  for (const { from, to, decoded } of decorationsOf(value)) {
    output += doc.slice(pos, from) + decoded;
    pos = to;
  }
  return output + doc.slice(pos);
}

// Renders a single entity surrounded by text, away from the cursor at 0.
function display(entity) {
  return render(`x ${entity} y`).slice(2, -2);
}

function textareaCount(spy) {
  return spy.mock.calls.filter(([tag]) => tag === "textarea").length;
}

// --- Decoding ----------------------------------------------------------------

describe("decoding", () => {
  test.each([
    ["&copy;", "©"],
    ["&amp;", "&"],
    ["&AMP;", "&"],
    ["&mdash;", "—"],
    ["&lt;", "<"],
    ["&gt;", ">"],
    ["&nbsp;", " "],
    ["&frac12;", "½"],
    ["&Afr;", "\u{1D504}"],
    ["&nvlt;", "<⃒"]
  ])("named entity %s renders as %j", (entity, expected) => {
    expect(display(entity)).toBe(expected);
  });

  test.each([
    ["&#169;", "©"],
    ["&#0000169;", "©"],
    ["&#xA9;", "©"],
    ["&#xa9;", "©"],
    ["&#XA9;", "©"],
    ["&#x0000A9;", "©"],
    ["&#x1F600;", "\u{1F600}"],
    ["&#xFFFD;", "�"],
    ["&#x10FFFF;", "\u{10FFFF}"]
  ])("numeric reference %s renders as %j", (entity, expected) => {
    expect(display(entity)).toBe(expected);
  });

  test("uses the HTML parser's Windows-1252 mapping for &#128;", () => {
    expect(display("&#128;")).toBe("€");
  });

  test.each(["&foo;", "&notarealentity;", "&a;", "&;", "&#;", "&#x;", "&copy", "& copy;"])(
    "leaves non-entity %s unchanged",
    text => {
      expect(display(text)).toBe(text);
    }
  );

  test.each(["&copyright;", "&amplifier;", "&notanentity;", "&ltfoo;", "&AMPfoo;"])(
    "leaves %s unchanged instead of decoding only its legacy prefix",
    text => {
      expect(display(text)).toBe(text);
    }
  );

  test.each(["&#00000169;", "&#12345678;", "&#x00000A9;", "&#x1234567;"])(
    "leaves %s unchanged because it exceeds CommonMark's digit limit",
    text => {
      expect(display(text)).toBe(text);
    }
  );

  test.each(["&#0;", "&#x0;", "&#xD800;", "&#xDFFF;", "&#55296;", "&#x110000;", "&#1114112;"])(
    "leaves invalid code point %s unchanged",
    text => {
      expect(display(text)).toBe(text);
    }
  );

  test.each([
    "&Tab;",
    "&NewLine;",
    "&shy;",
    "&zwj;",
    "&zwnj;",
    "&#x200B;",
    "&#x7F;",
    "&#8232;",
    "&#8233;"
  ])("leaves invisible or line-breaking %s unchanged", text => {
    expect(display(text)).toBe(text);
  });

  test("renders several entities on one line", () => {
    expect(render("x &copy; 2026 Fish &amp; Chips &#169;&#xA9;")).toBe("x © 2026 Fish & Chips ©©");
  });

  test("records the exact source range of each entity", () => {
    const found = decorationsOf(build("x &copy; y &amp;"));
    expect(found.map(({ from, to, entity }) => [from, to, entity])).toEqual([
      [2, 8, "&copy;"],
      [11, 16, "&amp;"]
    ]);
  });
});

// --- Markdown context ---------------------------------------------------------

describe("Markdown context", () => {
  test("skips entities in inline code", () => {
    const doc = "x `&copy;` y";
    const codeRanges = [{ from: 2, to: 10, name: "formatting_formatting-code_inline-code" }];
    expect(render(doc, { codeRanges })).toBe(doc);
  });

  test("skips entities in code blocks", () => {
    const doc = "```\n&copy;\n```";
    const codeRanges = [{ from: 4, to: 10, name: "hmd-codeblock" }];
    expect(render(doc, { codeRanges })).toBe(doc);
  });

  test("skips entities on a code block's opening line", () => {
    const doc = "x ```&amp;";
    const codeRanges = [{ from: 2, to: 10, name: "HyperMD-codeblock_HyperMD-codeblock-begin" }];
    expect(render(doc, { codeRanges })).toBe(doc);
  });

  test("skips entities whose code node is an ancestor rather than the leaf", () => {
    const doc = "```\n&copy;\n```";
    const codeRanges = [{ from: 4, to: 10, name: "hmd-codeblock", nested: true }];
    expect(render(doc, { codeRanges })).toBe(doc);
  });

  test("renders entities just outside code", () => {
    const doc = "x `a` &copy;";
    const codeRanges = [{ from: 2, to: 5, name: "formatting_formatting-code_inline-code" }];
    expect(render(doc, { codeRanges })).toBe("x `a` ©");
  });

  test("renders entities in nodes that aren't code", () => {
    const doc = "x **&copy;**";
    const codeRanges = [{ from: 2, to: 12, name: "strong" }];
    expect(render(doc, { codeRanges })).toBe("x **©**");
  });

  test("skips an entity escaped with one backslash", () => {
    expect(render("x \\&copy;")).toBe("x \\&copy;");
  });

  test("renders an entity after an escaped backslash", () => {
    expect(render("x \\\\&copy;")).toBe("x \\\\©");
  });

  test("skips an entity after three backslashes", () => {
    expect(render("x \\\\\\&copy;")).toBe("x \\\\\\&copy;");
  });

  test("handles an escaped entity at the start of the document", () => {
    const doc = "\\&copy; y";
    expect(render(doc, { cursor: doc.length })).toBe(doc);
  });

  test("renders an entity at the start of the document", () => {
    const doc = "&copy; y";
    expect(render(doc, { cursor: doc.length })).toBe("© y");
  });
});

// --- Incomplete parsing -------------------------------------------------------

describe("incomplete syntax tree", () => {
  test("leaves everything unchanged until the tree is available", () => {
    language.syntaxTreeAvailable.mockReturnValue(false);
    expect(render("x &copy; y &amp;")).toBe("x &copy; y &amp;");
  });

  test("checks availability up to the end of each entity", () => {
    render("x &copy;");
    expect(language.syntaxTreeAvailable).toHaveBeenCalledWith(expect.anything(), 8);
  });

  test("renders only the entities the tree already covers", () => {
    language.syntaxTreeAvailable.mockImplementation((state, upto) => upto <= 10);
    expect(render("x &copy; y &amp;")).toBe("x © y &amp;");
  });
});

// --- Editor mode --------------------------------------------------------------

describe("editor mode", () => {
  test("renders nothing in Source mode", () => {
    const value = build("x &copy;", { livePreview: false });
    expect(value.decorations.size).toBe(0);
  });

  test("renders nothing when the Live Preview field is missing", () => {
    const value = build("x &copy;", { livePreview: null });
    expect(value.decorations.size).toBe(0);
  });
});

// --- Selection ----------------------------------------------------------------

describe("revealing source at the cursor", () => {
  // "ab &copy; cd": the entity spans 3 to 9.
  const doc = "ab &copy; cd";

  test.each([
    [2, "ab © cd"],
    [3, doc],
    [6, doc],
    [9, doc],
    [10, "ab © cd"]
  ])("cursor at %i displays %j", (cursor, expected) => {
    expect(render(doc, { cursor })).toBe(expected);
  });

  test.each([
    [0, 3, "ab © cd"],
    [0, 4, doc],
    [8, 12, doc],
    [9, 12, "ab © cd"],
    [0, 12, doc],
    [12, 0, doc]
  ])("selection from %i to %i displays %j", (anchor, head, expected) => {
    const selection = EditorSelection.single(anchor, head);
    expect(render(doc, { selection })).toBe(expected);
  });

  test("each cursor reveals only the entity it touches", () => {
    // "a &copy; b &amp; c": &copy; spans 2 to 8 and &amp; spans 11 to 16.
    const selection = EditorSelection.create([EditorSelection.cursor(5), EditorSelection.cursor(18)]);
    expect(render("a &copy; b &amp; c", { selection, multipleSelections: true })).toBe("a &copy; b & c");
  });

  test("several cursors can reveal several entities", () => {
    const selection = EditorSelection.create([EditorSelection.cursor(5), EditorSelection.cursor(13)]);
    const doc = "a &copy; b &amp; c";
    expect(render(doc, { selection, multipleSelections: true })).toBe(doc);
  });
});

// --- Visible ranges -----------------------------------------------------------

describe("visible ranges", () => {
  // "a &copy; b &amp; c &lt;": entities at 2-8, 11-16 and 19-23.
  const doc = "a &copy; b &amp; c &lt;";

  test("decorates only entities inside the visible ranges", () => {
    const visibleRanges = [
      { from: 0, to: 9 },
      { from: 18, to: 23 }
    ];
    const found = decorationsOf(build(doc, { visibleRanges }));
    expect(found.map(({ from, to, decoded }) => [from, to, decoded])).toEqual([
      [2, 8, "©"],
      [19, 23, "<"]
    ]);
  });

  test("ignores an entity cut off by the edge of a visible range", () => {
    const found = decorationsOf(build(doc, { visibleRanges: [{ from: 0, to: 5 }] }));
    expect(found).toEqual([]);
  });

  test("renders nothing when no range is visible", () => {
    expect(build(doc, { visibleRanges: [] }).decorations.size).toBe(0);
  });
});

// --- Widget -------------------------------------------------------------------

describe("EntityWidget", () => {
  function widgetFor(entity) {
    return decorationsOf(build(`x ${entity}`))[0].widget;
  }

  test("is a non-inclusive replace decoration", () => {
    const [{ decoration }] = decorationsOf(build("x &copy;"));
    expect(decoration.spec.inclusive).toBe(false);
  });

  test("renders a span with the decoded text and the source as its tooltip", () => {
    const span = widgetFor("&copy;").toDOM();
    expect(span.tagName).toBe("SPAN");
    expect(span.className).toBe("html-entity-renderer-widget");
    expect(span.textContent).toBe("©");
    expect(span.title).toBe("&copy;");
    expect(span.getAttribute("aria-label")).toBe("&copy; → ©");
  });

  test("inserts decoded markup characters as text, not HTML", () => {
    const span = widgetFor("&lt;").toDOM();
    expect(span.childNodes).toHaveLength(1);
    expect(span.firstChild.nodeType).toBe(Node.TEXT_NODE);
    expect(span.innerHTML).toBe("&lt;");
  });

  test("compares equal only when the entity and decoded text match", () => {
    const widget = widgetFor("&copy;");
    const Widget = widget.constructor;
    expect(widget.eq(new Widget("&copy;", "©"))).toBe(true);
    expect(widget.eq(new Widget("&#169;", "©"))).toBe(false);
    expect(widget.eq(new Widget("&copy;", "x"))).toBe(false);
  });

  test("lets the editor handle clicks on the widget", () => {
    expect(widgetFor("&copy;").ignoreEvent()).toBe(false);
  });
});

// --- Updates ------------------------------------------------------------------

describe("updates", () => {
  function makeUpdate(startState, state, flags = {}, visibleRanges) {
    return {
      docChanged: false,
      selectionSet: false,
      viewportChanged: false,
      geometryChanged: false,
      ...flags,
      startState,
      state,
      view: viewFor(state, visibleRanges)
    };
  }

  test("keeps the existing decorations when nothing relevant changed", () => {
    const startState = makeState("x &copy;");
    const value = new EntityPluginValue(viewFor(startState));
    const before = value.decorations;

    value.update(makeUpdate(startState, makeState("x &copy;", { cursor: 5 })));
    expect(value.decorations).toBe(before);
  });

  test("ignores layout-only changes", () => {
    const startState = makeState("x &copy;");
    const value = new EntityPluginValue(viewFor(startState));
    const before = value.decorations;

    value.update(makeUpdate(startState, startState, { geometryChanged: true }));
    expect(value.decorations).toBe(before);
  });

  test("rebuilds when the document changes", () => {
    const startState = makeState("x &copy;");
    const value = new EntityPluginValue(viewFor(startState));

    value.update(makeUpdate(startState, makeState("x &amp;"), { docChanged: true }));
    expect(decorationsOf(value).map(d => d.decoded)).toEqual(["&"]);
  });

  test("rebuilds when the selection moves into an entity", () => {
    const startState = makeState("x &copy;");
    const value = new EntityPluginValue(viewFor(startState));
    expect(decorationsOf(value)).toHaveLength(1);

    value.update(makeUpdate(startState, makeState("x &copy;", { cursor: 5 }), { selectionSet: true }));
    expect(decorationsOf(value)).toHaveLength(0);
  });

  test("rebuilds when the viewport changes", () => {
    const startState = makeState("x &copy;");
    const value = new EntityPluginValue(viewFor(startState));

    value.update(makeUpdate(startState, startState, { viewportChanged: true }, []));
    expect(decorationsOf(value)).toHaveLength(0);
  });

  test("rebuilds when the syntax tree changes", () => {
    const startState = makeState("x `&copy;`");
    const value = new EntityPluginValue(viewFor(startState));
    expect(decorationsOf(value)).toHaveLength(1);

    const codeRanges = [{ from: 2, to: 10, name: "formatting_formatting-code_inline-code" }];
    const state = makeState("x `&copy;`", { codeRanges });
    value.update(makeUpdate(startState, state));
    expect(decorationsOf(value)).toHaveLength(0);
  });

  test("rebuilds when switching to Source mode", () => {
    const startState = makeState("x &copy;");
    const value = new EntityPluginValue(viewFor(startState));

    value.update(makeUpdate(startState, makeState("x &copy;", { livePreview: false })));
    expect(value.decorations.size).toBe(0);
  });

  test("rebuilds when switching back to Live Preview", () => {
    const startState = makeState("x &copy;", { livePreview: false });
    const value = new EntityPluginValue(viewFor(startState));

    value.update(makeUpdate(startState, makeState("x &copy;")));
    expect(decorationsOf(value)).toHaveLength(1);
  });
});

// --- Decode cache -------------------------------------------------------------

describe("decode cache", () => {
  test("decodes a repeated entity through the DOM only once", () => {
    const spy = jest.spyOn(document, "createElement");
    render("x &hearts; &hearts;");
    render("x &hearts;");
    expect(textareaCount(spy)).toBe(1);
  });

  test("caches rejected entities too", () => {
    const spy = jest.spyOn(document, "createElement");
    render("x &copyright; &copyright;");
    expect(textareaCount(spy)).toBe(1);
  });

  test("rejects invalid code points without touching the DOM", () => {
    const spy = jest.spyOn(document, "createElement");
    render("x &#0; &#xD800; &#x110000;");
    expect(textareaCount(spy)).toBe(0);
  });

  test("stays bounded by evicting old entries", () => {
    const entities = [];
    for (let code = 1000; code <= 2000; code++) entities.push(`&#${code};`);
    render(`x ${entities.join(" ")}`);

    const spy = jest.spyOn(document, "createElement");
    expect(render("x &#1000;")).toBe("x Ϩ");
    expect(textareaCount(spy)).toBe(1);
  });
});

// --- Plugin -------------------------------------------------------------------

describe("HtmlEntityRendererPlugin", () => {
  test("registers exactly one editor extension on load", () => {
    expect(plugin.extensions).toHaveLength(1);
  });

  test("exposes the plugin value's decorations to the editor", () => {
    const value = build("x &copy;");
    expect(pluginSpec.decorations(value)).toBe(value.decorations);
  });
});

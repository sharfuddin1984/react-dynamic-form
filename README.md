# FormSmith — Dynamic Form Builder

A form renderer that turns a JSON schema into a live, validated React form —
fetched from a (mock) JSON API or hand-edited in the browser.

## Run it

```bash
npm install
npm run dev
```

## Why it's split up this way

The single-file version worked fine, but in one file it's hard to see what
*depends on what*. Splitting it makes the dependency direction visible:

```
data flows downward, callbacks flow upward
─────────────────────────────────────────

  formsApi.js  (pretends to be a server)
       │
       ▼
  useDynamicForm.js  (the only file with useState — owns all app state)
       │
       ▼
  App.jsx  (wires the hook to components, no logic of its own)
       │
       ├──▶ ApiToolbar.jsx     (endpoint picker, fetch button)
       ├──▶ SchemaEditor.jsx   (left pane: JSON textarea)
       ├──▶ FlowDivider.jsx    (purely decorative)
       └──▶ FormPreview.jsx    (right pane)
                 ├──▶ FieldRenderer.jsx   (one field's JSON → one input)
                 └──▶ SuccessPanel.jsx    (shown after a valid submit)

  validation.js  (pure functions — no React — used by the hook)
  global.css     (CSS variables = the only source of color/spacing tokens)
```

## File-by-file

| File | Responsibility |
|---|---|
| `src/api/formsApi.js` | Owns the schema data and the simulated network call. Swap the mock `ENDPOINTS` object for a real `fetch()` call here and nothing else in the app needs to change. |
| `src/utils/validation.js` | Pure validation logic — reads each field's own `required`, `minLength`, `pattern`, etc. No React imports, so it's trivially unit-testable on its own. |
| `src/hooks/useDynamicForm.js` | **The only file that calls `useState`.** Holds the JSON text, parsed schema, form values, errors, and submission state, and exposes plain functions (`editSchema`, `changeField`, `submit`...) for components to call. This is what makes the components below "dumb" — they just render props. |
| `src/components/ApiToolbar.jsx` | Endpoint dropdown + fetch button + status line. |
| `src/components/SchemaEditor.jsx` | The JSON textarea (left pane), plus the valid/invalid status line underneath it. |
| `src/components/FlowDivider.jsx` | The animated chevrons between the two panes. Decoration only — no props, no state. |
| `src/components/FormPreview.jsx` | The right pane. Decides whether to show the empty state, the form, or the success panel. |
| `src/components/FieldRenderer.jsx` | **The core of "dynamic."** One `switch` on `field.type` that turns a single field definition into the right input. Add a new case here to support a new field type everywhere at once. |
| `src/components/SuccessPanel.jsx` | The "submitted" view showing the response payload as JSON. |
| `src/styles/global.css` | Every color is a CSS variable (`:root`), referenced by class name or by passing `color="var(--teal)"` to icons — there's no separate JS theme file to keep in sync. |
| `src/App.jsx` | Composition only: calls the hook once, passes pieces of its return value down as props. |
| `src/main.jsx` | Standard Vite/React entry point — mounts `<App />` into `#root`. |

## Try it

- Edit the JSON in the left pane — the form on the right rebuilds on every
  keystroke. Break the JSON and the form keeps showing the last valid
  version instead of crashing.
- Switch the endpoint dropdown and hit **Fetch** to simulate loading a
  different form definition from a server.
- Add a new field type (e.g. `'range'`) by adding one `case` to
  `FieldRenderer.jsx` — every schema can use it immediately.

## Swapping in a real backend

Only `src/api/formsApi.js` needs to change:

```js
export async function fetchFormSchema(key) {
  const res = await fetch(`/api/forms/${key}`);
  const schema = await res.json();
  return { schema, ms: 0 };
}
```

Everything downstream — the hook, the editor, the renderer — already treats
the schema as "whatever JSON came back," so it doesn't need to know the
difference.

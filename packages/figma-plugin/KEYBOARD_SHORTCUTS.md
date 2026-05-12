# Critique Lens — Figma Plugin Keyboard Shortcuts

> On Windows/Linux substitute **Ctrl** for **⌘**.

## Actions

| Shortcut | Action | Notes |
|---|---|---|
| `⌘ ↵` | **Capture selected frame** | Exports the currently selected Figma frame as a PNG and shows a preview. Does not trigger inside a textarea. |
| `⌘ ⇧ ↵` | **Run preflight analysis** | Submits the captured frame + selected reviewer to the Critique Lens API. Requires a frame to be captured and a reviewer selected first. Works from anywhere in the plugin. |
| `⌘ R` | **Refresh** | Reloads the reviewer and project lists from the Critique Lens app. Useful after adding a new reviewer or project without restarting the plugin. |
| `Escape` | **Close plugin** | Closes the Critique Lens plugin panel. |

## Navigation

| Shortcut | Action |
|---|---|
| `Tab` | Move forward through fields (reviewer, project, PBI, notes, URL) |
| `Shift Tab` | Move backward through fields |

## Typical workflow

1. Select a frame in Figma
2. Press **`⌘ ↵`** to capture it
3. Choose a reviewer from the dropdown (or `Tab` to it)
4. Optionally select a project and PBI
5. Press **`⌘ ⇧ ↵`** to run the analysis — results open in your browser automatically

## Notes

- `⌘ ↵` is intentionally blocked when a `<textarea>` is focused so it does not conflict with adding a new line in the annotation notes field. Use `⌘ ⇧ ↵` to run the analysis from anywhere, including while typing notes.
- The shortcut reference panel is accessible via the **Shortcuts** button in the plugin header.

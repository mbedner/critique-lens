// Figma plugin main thread

figma.showUI(__html__, { width: 420, height: 640, title: "Critique Lens" });

figma.ui.onmessage = async (msg: { type: string; payload?: unknown }) => {
  switch (msg.type) {
    case "analyze-frame":
      await handleAnalyzeFrame();
      break;
    case "cancel":
      figma.closePlugin();
      break;
  }
};

async function handleAnalyzeFrame() {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.ui.postMessage({ type: "error", message: "Select a frame to analyze." });
    return;
  }

  const node = selection[0];
  if (node.type !== "FRAME" && node.type !== "COMPONENT" && node.type !== "SECTION") {
    figma.ui.postMessage({ type: "error", message: "Selection must be a Frame, Component, or Section." });
    return;
  }

  figma.ui.postMessage({ type: "status", message: "Exporting frame…" });

  const bytes = await node.exportAsync({
    format: "PNG",
    constraint: { type: "SCALE", value: 2 },
  });

  const layers = extractLayers(node);

  figma.ui.postMessage({
    type: "frame-data",
    payload: {
      name: node.name,
      width: node.width,
      height: node.height,
      imageBytes: Array.from(bytes),
      layers,
    },
  });
}

type LayerMeta = {
  name: string;
  type: string;
  text?: string;
  children?: LayerMeta[];
};

function extractLayers(node: SceneNode, depth = 0): LayerMeta {
  const meta: LayerMeta = { name: node.name, type: node.type };
  if ("characters" in node && node.characters) meta.text = node.characters;
  if ("children" in node && depth < 4) {
    meta.children = node.children.map((child) => extractLayers(child, depth + 1));
  }
  return meta;
}

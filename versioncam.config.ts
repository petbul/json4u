import { defineRecorder } from "versioncam";

export default defineRecorder({
  // Next's default port: the dev script is a bare `next dev`.
  baseUrl: "http://localhost:3000",
  // The README's development steps: `pnpm dev` from the repository's root.
  webServer: { command: "pnpm dev", url: "http://localhost:3000" },
  viewport: { width: 1440, height: 900 },
  clips: "demos/clips/**/*.clip.ts",
  // The bottom right of the graph view, which is empty in the example
  // document; the default rests on a line between two graph nodes.
  cursorStart: { x: 0.72, y: 0.78 },
  // The clip pastes, formats and compares, which takes longer than the
  // default 9 to 11 seconds to show readably.
  review: { minSeconds: 15, maxSeconds: 20 },
});

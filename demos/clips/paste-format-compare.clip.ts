import { clip } from "versioncam";

// A small package.json-like document, pasted minified so the formatting shows.
const ORIGINAL =
  '{"name":"json4u","version":"3.7.3","features":["graph","table","compare"],"license":"Apache-2.0","stars":3221}';
// The same document with three edits for the diff to find.
const EDITED =
  '{"name":"json4u","version":"3.8.0","features":["graph","table","compare","jq"],"license":"Apache-2.0","stars":3300}';

// Pastes a document into the editor, lets json4u format it, puts an edited
// copy in the second editor and compares the two.
export default clip("paste-format-compare", { title: "Paste, format and compare JSON", seed: 7 }, async (s) => {
  // A paste through the editor's own paste handler. The recorder has no
  // clipboard to paste from, so this hands Monaco the event Command+V or
  // Ctrl+V would; Monaco inserts the text and json4u formats it.
  const paste = (editor: number, text: string) =>
    s.offCamera(async (page) => {
      await page.evaluate(
        ({ editor, text }) => {
          const area = document.querySelectorAll<HTMLTextAreaElement>(".monaco-editor textarea")[editor];
          area.focus();
          const data = new DataTransfer();
          data.setData("text/plain", text);
          area.dispatchEvent(new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }));
        },
        { editor, text },
      );
    });

  await s.open("/editor");
  s.caption("Paste JSON into json4u and it is formatted at once");
  await s.hold(1500);

  await s.click(s.css(".monaco-editor .view-lines >> nth=0"));
  await s.press("ControlOrMeta+a");
  await paste(0, ORIGINAL);
  await s.settle({ label: "formatted" });
  await s.hold(2400);

  // The text view puts a second editor on the right.
  s.caption("Compare it with an edited copy");
  await s.click(s.byRole("tab", { name: "text" }));
  await s.settle();
  await s.click(s.css(".monaco-editor .view-lines >> nth=1"));
  await s.press("ControlOrMeta+a");
  await paste(1, EDITED);
  await s.settle({ label: "edited copy" });
  await s.hold(2000);

  await s.click(s.byRole("button", { name: "Compare", exact: true }));
  await s.settle({ label: "compared" });
  await s.hold(2800);

  // json4u confirms the comparison in a toast; wait for it to go.
  await s.moveTo([1200, 640]);
  await s.hold(2800);
});

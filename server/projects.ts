// Return your real projects. At least two of them, that you actually built.
const PROJECTS: Array<{
  title: string;
  description: string;
  technologies: string[];
  url: string;
}> = [
  {
    title: "LILO",
    description:
      "Browser-native coding-education platform. All code executes client-side in WebAssembly: Python via Pyodide, Java via CheerpJ. A quantized LLM runs locally for AI tutoring.",
    technologies: ["WebAssembly", "Pyodide", "CheerpJ", "Next.js"],
    url: "https://learnwleo.com",
  },
  {
    title: "Window Controls Overlay (Microsoft Edge)",
    description:
      "Desktop PWAs can render web content into the OS title bar area, with app-region drag handles. Shipped in Edge 105 stable across Windows, macOS, and Linux.",
    technologies: ["PWA", "Chromium", "CSS"],
    url: "https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/window-controls-overlay",
  },
  {
    title: "Find on Page API (WebView2)",
    description:
      "Native programmatic text-search API across Win32/C++, WinRT/C#, and .NET, built on a multi-process Mojo IPC architecture. 14 features shipped.",
    technologies: ["C++", "WinRT", "Chromium", "Mojo"],
    url: "https://learn.microsoft.com/en-us/microsoft-edge/webview2/release-notes/",
  },
];

export function GET(): Response {
  return new Response(JSON.stringify(PROJECTS), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

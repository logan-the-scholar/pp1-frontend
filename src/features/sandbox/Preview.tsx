"use client";
import useNewWindowPreview from "@/hooks/useNewWindowPreview";
import { SandpackLayout, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import CodeViewer from "./CodeViewer";

const Preview = () => {
    const { containerRef, open } = useNewWindowPreview();

    return (
        <SandpackProvider
            style={{ flex: 1 }}
            template="react-ts"
            customSetup={{
                dependencies: {
                    "react": "^18.0.0",
                    "react-dom": "^18.0.0",
                }
            }}
            files={{
                "/src/App.tsx": {
                    code: `
export default function App() {
    return <h1>Hola desde Monaco</h1>;
}
`,
                    active: true,
                },
                "/index.tsx": {
                    code: `
import { createRoot } from "react-dom/client";
import App from "./src/App";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
`,
                },
                "/index.html": {
                    code: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Sandpack Preview</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
                    `
                }
            }}
        >
            <div className="w-full text-white flex h-full overflow-hidden">
                <CodeViewer />
                <div className="h-full w-1/2">
                    <SandpackLayout style={{ height: "100%" }}>
                        <SandpackPreview style={{ height: "100%" }} showNavigator={true} showOpenInCodeSandbox={false} />
                    </SandpackLayout>
                </div>
            </div>

        </SandpackProvider>
    );
};

export default Preview;
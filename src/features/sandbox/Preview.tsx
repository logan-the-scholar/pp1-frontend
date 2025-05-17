"use client";
import LoadingCircle from "@/components/LoadingCircle";
import LanguageMapper from "@/helpers/LanguageMapper";
import useNewWindowPreview from "@/hooks/useNewWindowPreview";
import { Sandpack, SandpackPreview, SandpackProvider, useSandpack } from "@codesandbox/sandpack-react";
import { Editor } from "@monaco-editor/react";
import { useEffect } from "react";
import CodeViewer from "./CodeViewer";

const Preview = () => {
    const { containerRef, open } = useNewWindowPreview();

    return (
        <SandpackProvider
            style={{ flex: 1 }}
            template="react-ts"
            customSetup={{
                dependencies: {
                    react: "^18.0.0",
                    "react-dom": "^18.0.0",
                }
            }}
            files={{
                "/App.tsx": {
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
import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
`,
                },
            }}
        >
            <div className="w-full text-white flex h-full overflow-hidden">
                <CodeViewer />
                <SandpackPreview showOpenInCodeSandbox={false} />
            </div>
        </SandpackProvider>
    );
};

export default Preview;
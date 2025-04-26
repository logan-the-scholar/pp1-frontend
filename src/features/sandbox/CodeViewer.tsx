"use client";
import { Editor } from "@monaco-editor/react";

const CodeViewer = () => {
    return (
        <Editor
            loading={(
                <div className="h-full w-full bg-neutral-900">
                    loading...
                </div>
            )}
            options={{ minimap: { enabled: false } }}
            className="w-full h-full absolute"
            language="javascript"
            theme="vs-dark"
        // onMount={(x) => editorMount(x)}
        // value={code}
        // onChange={(x) => {
        //     setCode(x || "");
        //     textSetter(x === initialCode ? undefined : x);
        // }}
        />
    );
};

export default CodeViewer;
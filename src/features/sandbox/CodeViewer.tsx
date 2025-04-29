"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { Editor } from "@monaco-editor/react";

const CodeViewer = () => {
    return (
        <div className="h-[100vh] w-full flex flex-col pt-2 overflow-hidden">
            <div className="px-4 py-1.5 border border-b-0 border-neutral-200 bg-[#1e1e1e] cursor-pointer w-fit select-none">nose.tsx x</div>
            <div className="px-4 py-1.5 cursor-pointer text-xs text-neutral-300 bg-[#1e1e1e] select-none">aa {">"} asdjaks {">"} asdsn</div>

            <Editor
                loading={(
                    <div className="h-full w-full bg-[#1e1e1e]">
                        <LoadingCircle size={80} stroke={8} />
                    </div>
                )}
                options={{ minimap: { enabled: false } }}
                className="w-full flex-1"
                language="javascript"
                theme="vs-dark"
            // onMount={(x) => editorMount(x)}
            // value={code}
            // onChange={(x) => {
            //     setCode(x || "");
            //     textSetter(x === initialCode ? undefined : x);
            // }}
            />
        </div>
    );
};

export default CodeViewer;
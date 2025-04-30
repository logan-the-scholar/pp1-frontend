"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { RootState } from "@/redux/store";
import { Editor } from "@monaco-editor/react";
import { useSelector } from "react-redux";

const CodeViewer = () => {
    const text = useSelector((state: RootState) => state.file.text);

    return (
        <div className="h-[100vh] w-full flex flex-col pt-2 overflow-hidden">

            {/* WINDOW VIEW */}
            <div className="w-full flex select-none">

                {/* TITLE */}
                <div className={`pl-3 py-1.5 border-x border-t border-neutral-400 bg-[#1e1e1e] cursor-pointer w-fit flex relative ${true && "hover:bg-[#ffffff1c]"}`}>
                    {text}
                    <span className="mx-2 px-1 hover:bg-[#ffffff21] content-center rounded-[4px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x">
                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                    </span>
                    <div className="absolute left-0 h-0.5 w-full bg-[#1e1e1e] -bottom-[1px]"></div>
                </div>
            </div>

            {/* PATH VIEW */}
            <div className="px-4 py-1.5 border-x border-t border-neutral-400 cursor-pointer text-xs text-neutral-300 bg-[#1e1e1e] select-none">aa {">"} asdjaks {">"} asdsn</div>

            {/* EDITOR */}
            <Editor
                loading={(
                    <div className="h-full w-full bg-[#1e1e1e]">
                        <LoadingCircle size={80} stroke={8} />
                    </div>
                )}
                options={{ minimap: { enabled: false } }}
                className="w-full flex-1 border-x border-neutral-400"
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
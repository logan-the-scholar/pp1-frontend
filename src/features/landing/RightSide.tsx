"use client";
import { Editor } from "@monaco-editor/react";
import { ExternalLink } from "lucide-react";
import { editor } from "monaco-editor";
import { useEffect, useRef } from "react";

const RightSide: React.FC<{ hidePanelTriggerer: React.Dispatch<React.SetStateAction<boolean>> }> = ({ hidePanelTriggerer }) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    // const divRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    const editorMount = (editor: editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
        
        editorRef.current.onDidFocusEditorText(() => {
            shouldHidePanel(true);
        });

        editorRef.current.onDidBlurEditorText(() => {
            shouldHidePanel(false);
        });
    };

    const shouldHidePanel = (state: boolean) => {
        hidePanelTriggerer(state);
    };

    // const handleClick = () => {
    //     console.log("clicked");
    // };

    return (
        <div className="w-[40%] h-48">
            <div className="text-3xl font-bold">
                Try it!
                <div className="text-base mt-2 font-normal">The perfect editor provided by{" "}
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/react-monaco-editor/react-monaco-editor" className="underline font-semibold cursor-pointer inline-flex">
                        Monaco Editor
                        <span><ExternalLink strokeWidth={2} /></span>
                    </a>
                </div>
            </div>
            <div className="w-full h-fit shadow-[14px_14px_0px_#5d0ec0] border-r-2 border-b-2 border-violet-900">
                <div
                    // onClick={(x) => handleClick()}
                    className="w-full h-[30dvw] mt-5 bg-violet-600 pr-2 relative"
                >
                    <Editor
                        loading={(
                            <div className="h-full w-full bg-neutral-900 -top-3 -left-3 absolute">
                                loading...
                            </div>
                        )}
                        className="-top-3 -left-3 w-full h-full absolute"
                        language="javascript"
                        theme="vs-dark"
                        onMount={(x) => editorMount(x)}
                    />
                </div>
            </div>
        </div>
    );
};

export default RightSide;
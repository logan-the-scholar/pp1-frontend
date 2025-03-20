"use client";
import { Editor } from "@monaco-editor/react";
import { ExternalLink } from "lucide-react";
import { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";

const RightSide: React.FC<{ hidePanelState: boolean, hidePanelTriggerer: React.Dispatch<React.SetStateAction<boolean>> }> = ({ hidePanelState, hidePanelTriggerer }) => {
    const initialCode = "//Your code here!";
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    // const divRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    const [showButtons, setShowButtons] = useState<boolean>(false);
    const [code, setCode] = useState<string>(initialCode);
    const [output, setOutput] = useState<string>();
    // const [windowVisibility, setWindowVisibility] = useState<boolean>(true);
    // const [showOptions, setShowOptions] = useState<boolean>(false);
    const outputRef = useRef<HTMLPreElement | null>(null);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }

    }, [output]);


    useEffect(() => {

        // const windowChange = () => {
        //     if (document.hidden) {
        //         setWindowVisibility(false);
        //     } else {
        //         setWindowVisibility(true);
        //     }
        // };

        // document.addEventListener("visibilitychange", windowChange);

        return () => {
            // setShowOptions(false);
            setShowButtons(false);
            // setWindowVisibility(true);
            // document.removeEventListener("visibilitychange", windowChange);
        }
    }, []);


    const editorMount = (editor: editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;

        editorRef.current.onDidFocusEditorWidget(() => {
            shouldHidePanel(true);
        });

        setShowButtons(true);
    };


    const shouldHidePanel = (state: boolean) => {
        hidePanelTriggerer(state);
        // setShowOptions(state);
    };


    const run = () => {

        //     const workerCode =
        //         `
        //   self.onmessage = function(e) {
        //     const logs = [];

        //     // Capturar console.log y enviarlo de vuelta
        //     console.log = (...args) => {
        //       logs.push(args.join(" "));
        //       self.postMessage({ type: "log", message: args.join(" ") });
        //     };

        //     try {
        //       eval(e.data); // Ejecutar código enviado
        //     } catch (error) {
        //       self.postMessage({ type: "error", message: error.toString() });
        //     }
        //   };
        // `;

        //     const workerBlob = new Blob([workerCode], { type: "application/javascript" });
        //     const worker = new Worker(URL.createObjectURL(workerBlob));

        //     worker.onmessage = (e) => {
        //         if (e.data.type === "log") {
        //             setOutput((prev) => prev + e.data.message + "\n");
        //         } else if (e.data.type === "error") {
        //             setOutput((prev) => prev + "Error: " + e.data.message + "\n");
        //         }
        //     };

        //     worker.postMessage(code);
    };


    return (
        <>
            {/* //cambiar esto por un grid para evitar movimientos extraños */}

            <div className={`h-full transition-all delay-100 duration-500 ${hidePanelState ? "w-[77%]" : "w-[40%]"}`}>

                <div className={`text-3xl font-bold h-fit`}>
                    Try it!
                    <div className="text-base mt-2 font-normal">The perfect editor provided by{" "}
                        <a target="_blank" rel="noopener noreferrer" href="https://github.com/react-monaco-editor/react-monaco-editor" className="underline font-semibold cursor-pointer inline-flex">
                            Monaco Editor
                            <span><ExternalLink strokeWidth={2} /></span>
                        </a>
                    </div>
                </div>

                {/* grid grid-flow-col grid-rows-3 gap-4 */}
                {/* not-md:gap-y-5 */}
                <div className="w-full flex h-[30dvw] mt-5 not-md:flex-col justify-end">
                    {
                        <div className={`mr-auto flex flex-col place-content-between h-full w-[38%] ${hidePanelState ? "animate-stretch" : "animate-shrink"}`}>

                            {/* <div className=""></div> */}

                            <ul className="flex flex-col ml-3 mt-3 w-fit gap-2 bg-items-violet-600 list-disc list-inside select-none">
                                <li>
                                    Javascript
                                </li>
                                <li>
                                    Java
                                </li>
                                <li>
                                    Typescript
                                </li>
                            </ul>
{/* line */}
                            <div className={`ebox-5/neutral-800 w-full h-[50%] max-h-[50%] mt-4 border border-black bg-neutral-900 shadow-amber-500 text-neutral-400 relative ${hidePanelState ? "shadow-[0px_0px_0px]" : "shadow-[0px_0px_0px]"}`}>
                                <div className="z-10 top-0 left-0 relative select-none pl-2 pt-2 w-full border-b bg-inherit text-neutral-300 border-neutral-600 text-sm">Output</div>
                                <pre ref={outputRef} className="top-0 left-0 pr-0 p-2 absolute max-h-full w-full h-full overflow-x-hidden text-wrap overflow-y-scroll">{output}</pre>
                            </div>
                        </div>
                    }

                    <div className={`ebox-5/neutral-800 relative h-full border border-black transition-all delay-100 duration-500 shadow-[0px_0px_0px] ${hidePanelState ? "w-[60%]" : "w-full"}`}>

                        <div className={`absolute right-0 bottom-full py-1 px-2 select-none text-neutral-300 text-sm bg-neutral-900 ${hidePanelState ? "animate-stretch" : "animate-shrink"}`}>index.js</div>

                        <Editor
                            loading={(
                                <div className="h-full w-full bg-neutral-900">
                                    loading...
                                </div>
                            )}
                            className="w-full h-full absolute"
                            language="javascript"
                            theme="vs-dark"
                            onMount={(x) => editorMount(x)}
                            value={code}
                            onChange={(x) => setCode(x || "")}
                        />

                        {showButtons &&
                            <div className="bottom-4 right-5 z-20 absolute">
                                {code !== initialCode &&
                                    <button
                                        onClick={() => setCode(initialCode)}
                                        className="mr-2 underline px-3 py-1.5 shadow-[3px_3px_0px_#000000] active:translate-[2px] hover:shadow-[5px_5px_0px_#000000] border-black border bg-violet-600 text-white cursor-pointer"
                                    >
                                        Reset
                                    </button>
                                }
                                <button
                                    disabled={code === initialCode}
                                    onClick={() => run()}
                                    className="disabled:cursor-not-allowed underline px-3 py-1.5 shadow-[3px_3px_0px_#000000] active:translate-[2px] hover:shadow-[5px_5px_0px_#000000] border-black border bg-amber-400 text-black cursor-pointer"
                                >
                                    Run code
                                </button>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </>
    );
};

export default RightSide;
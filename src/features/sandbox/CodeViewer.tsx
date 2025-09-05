"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { RootState } from "@/redux/store";
import { Editor, OnMount } from "@monaco-editor/react";
import { useSelector } from "react-redux";
import FileIconMapper from "./FileIconMapper";
import { OpenTabsAction } from "@/redux/sandbox/open-files/OpenFilesActions";
import { useAppDispatch } from "@/hooks/useTypedSelectors";
import LanguageMapper from "@/helpers/LanguageMapper";
import OpenTabsSlice from "@/redux/sandbox/open-files/OpenTabsSlice";
import { useEffect, useRef, useState } from "react";
import { DeclaredNodeModel, OpenFileMetaData } from "@/types/state-types";
import { useSaveShortcut } from "@/hooks/shortcut/useSaveShortcut";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiFile } from "@/services/api/File";
import { IFileUpdation, ISession } from "@/types/zTypes/zTypes";
import { zodValidate } from "@/helpers/zod/ZodValidate";
import { FileUpdation } from "@/types/zTypes/FileUpdation.type";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { editor } from "monaco-editor";
import FileTreeSlice from "@/redux/sandbox/file-tree/FileTreeSlice";

const CodeViewer = () => {
    const dispatch = useAppDispatch();
    const selectedFile = useSelector((state: RootState) => state.OPEN_FILES.selected);
    const openFiles = useSelector((state: RootState) => state.OPEN_FILES.open);
    const { project, branch } = useSelector((state: RootState) => state.FILE_TREE);
    const [pos, setPos] = useState<{ line: number, col: number }>({ line: 1, col: 1 });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // const nose = useMonaco();
    const router = useRouter();
    const [session,] = useLocalStorage<ISession | null>("session", null);

    const params = useSearchParams();
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const line = Number(params?.get("line") || 1);
    const column = Number(params?.get("col") || 1);

    useSaveShortcut(() => {
        if (selectedFile) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            dispatch(OpenTabsSlice.actions.changeSaved({ one: { id: selectedFile.id, saved: true } }));
        }
    });

    const debounceSaveCode = (code: string | undefined, node: DeclaredNodeModel<OpenFileMetaData>) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {

            if (project && branch) {
                if (session === null) {
                    console.error("session storage is null!");
                    return;
                }

                const formatedPath = node.data.fullPath.map((p) => "/" + p) || [];
                formatedPath.shift();
                formatedPath.unshift(":");

                const [success, data] = zodValidate<IFileUpdation>({
                    id: node.id.toString(),
                    content: code || null,
                    author: session.nickname,
                    repoId: project,
                    path: formatedPath,
                    newName: null, newExtension: null, newPath: null,
                    createdAt: Date.now(),
                    branch,
                    versionId: node.data.versionId
                }, FileUpdation);

                if (!success) {
                    Object.entries(data.errors).forEach((e) => console.error(e));
                    throw new ErrorHelper("nose");
                }

                dispatch(OpenTabsSlice.actions.edit({
                    id: node.id,
                    code: code,
                    line: pos.line,
                    edited: true
                }));

                dispatch(FileTreeSlice.actions.edit({
                    ...node,
                    data: {
                        ...node.data,
                        content: code,
                    }
                }));

                await ApiFile.update(data.data);

            } else {
                console.error("branch and project state are nullish!");
            }

        }, 4000);
    };

    const handleChange = (code: string | undefined) => {
        if (selectedFile !== undefined) {
            debounceSaveCode(code, selectedFile);
        }
    };

    const handleClose = (id: string | number) => {
        dispatch(OpenTabsAction.closeAndChangeWindow(id));
        //TODO hacer mas GENERAL el cambio de queryparameter del file y ponerlo aqui y en todas las partes que se necesite
        //TODO ref3
    };

    const handleChangeWindow = (file: DeclaredNodeModel<OpenFileMetaData>) => {
        dispatch(OpenTabsAction.open({ ...file, data: file.data }));
        document.title = `${"Unknown"} /${file.text}`;

        //TODO MUST? usar implements con clases y AppThunks para linkear acciones de redux con otra logica? sera posible esto???

        const p = new URLSearchParams(params?.toString());
        const path_ = file.data.fullPath.slice(1).join("/") || `/${file.text}`;

        p.set("file", path_);
        router.push(`?${p.toString()}`);
    };

    const handleEditorMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        editor.setPosition({ lineNumber: line, column });
        editor.revealLineInCenter(line);
        editor.focus();

        editor.onDidChangeCursorPosition((event) => {
            const { lineNumber, column } = event.position;
            // console.log("Cursor en línea:", lineNumber, "columna:", column);
            setPos({ line: lineNumber, col: column });

            // const model = editor.getModel();
            // if (model) {
            //     const lineContent = model.getLineContent(lineNumber);
            //     console.log("Texto de la línea actual:", lineContent);
            // }
        });
    };


    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.setPosition({ lineNumber: line, column });
            editorRef.current.revealLineInCenter(line);
            editorRef.current.focus();
        }
    }, [line, column]);


    return (
        <div className="w-1/2 h-full flex flex-col">
            {openFiles.length > 0 ?
                <>
                    {/* WINDOW VIEW */}
                    <div className="w-full flex select-none">

                        {/* TITLE */}
                        {
                            openFiles.map((file) => {
                                return (
                                    <div
                                        onClick={() => handleChangeWindow(file)}
                                        key={`window_${file.id}`}
                                        className={`hover:[&>span]:visible pl-3 py-1.5 bg-[#1e1e1e] cursor-pointer w-fit flex relative 
${file.id === selectedFile?.id ? "border-x border-neutral-600" : "border-x border-[#1e1e1e] bg-neutral-900"}
${!file.data.edited && "italic"}`}
                                    >
                                        <div className="mr-3 content-center">
                                            <FileIconMapper type={file.data?.extension as string} />
                                        </div>
                                        {file.text}
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClose(file.id);
                                            }}
                                            className={`mx-2 px-0.5 -my-0.5 py-0.5 content-center rounded-[4px] 
${file.id === selectedFile?.id || file.data.edited ? "visible hover:bg-[#ffffff13]" : "invisible hover:bg-[#ffffff18]"}`}>
                                            {
                                                file.data.edited && !file.data.saved ?
                                                    // {/* EDITED CIRCLE */}
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="10" height="10"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                        className={`lucide lucide-circle-icon lucide-circle`}>
                                                        <circle cx="12" cy="12" r="10" />
                                                    </svg>
                                                    :
                                                    // {/* NOT EDITED OR HOVER TO CLOSE CROSS */}
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="16" height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                        className={`lucide lucide-x-icon lucide-x`}>
                                                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                                    </svg>
                                            }
                                        </span>
                                        {
                                            file.id === selectedFile?.id &&
                                            <div className="absolute left-0 h-0.5 w-full bg-[#1e1e1e] -bottom-[1px]"></div>
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>

                    {/* PATH VIEW */}
                    <div className="px-4 py-1 flex border-x border-t border-neutral-600 text-xs text-neutral-300 bg-[#1e1e1e] select-none">
                        {
                            selectedFile !== undefined ?
                                [...selectedFile.data.fullPath]
                                    .map((path, index) => {
                                        return (path === "0" ? null :
                                            <span className="hover:text-neutral-100 cursor-pointer mr-1.5 flex" key={`${path}_${selectedFile.text}`}>
                                                {/* {path === selectedFile.text && selectedFile.data?.extension !== FileType.FOLDER && (index + 1) === selectedFile.data?.fullPath?.length &&
                                                    <span className="mr-1">
                                                        <FileIconMapper type={selectedFile.data?.extension as string} />
                                                    </span>
                                                } */}
                                                {path === selectedFile.text &&
                                                    <span className="mr-1.5 h-full flex items-center">
                                                        <FileIconMapper size={12} type={selectedFile.data?.extension as string} />
                                                    </span>
                                                }
                                                {/* {`${path} ${path !== selectedFile.text ? "a" : ""}`} */}
                                                {path} {path !== selectedFile.text &&
                                                    <span className="max-w-4 max-h-4 overflow-hidden">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                            width="16" height="16"
                                                            viewBox="0 0 24 24" fill="none"
                                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                            className="mt-[1px] lucide lucide-chevron-right-icon lucide-chevron-right"
                                                        >
                                                            <path d="m9 18 6-6-6-6" />
                                                        </svg>
                                                    </span>
                                                }
                                            </span>
                                        );
                                    })
                                :
                                null
                        }
                    </div>

                    {/* EDITOR */}
                    <Editor
                        loading={(
                            <div className="h-full w-full bg-[#1e1e1e] border-x border-neutral-600">
                                <LoadingCircle size={80} stroke={8} />
                            </div>
                        )}
                        options={{ minimap: { enabled: false } }}
                        className="w-full flex-1 border-x border-neutral-600"
                        language={LanguageMapper(selectedFile?.data?.extension as string)}
                        theme="vs-dark"
                        path={selectedFile?.data.fullPath.join("/")}
                        value={selectedFile?.data?.content || ""}
                        onChange={(x) => handleChange(x)}
                        onMount={handleEditorMount}
                    />
                </>
                :
                <div className="border-neutral-600 border-x bg-[#1e1e1e] flex-1 text-center content-center">
                    Nothing here yet!
                </div>

            }

        </div>
    );
};

export default CodeViewer;
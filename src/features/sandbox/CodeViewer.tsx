"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { RootState } from "@/redux/store";
import { BeforeMount, Editor, OnMount } from "@monaco-editor/react";
import { useSelector } from "react-redux";
import FileIconMapper from "./FileIconMapper";
import { OpenTabsAction } from "@/redux/sandbox/open-files/OpenFilesActions";
import { useAppDispatch } from "@/hooks/useTypedSelectors";
import LanguageMapper from "@/helpers/LanguageMapper";
import { useEffect, useRef, useState } from "react";
import { DeclaredNodeModel, FileMetaData } from "@/types/ReduxState.type";
import { useCtrlShortcut } from "@/hooks/shortcut/useSaveShortcut";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiFile } from "@/services/api/File";
import { IFileUpdation, ISession } from "@/types/zTypes/zTypes";
import { zodValidate } from "@/helpers/zod/ZodValidate";
import { FileUpdation } from "@/types/zTypes/FileUpdation.type";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { editor } from "monaco-editor";
import { cacheTypeFrom } from "@/services/Package";
import { FileTreeActions } from "@/redux/sandbox/file-tree/FileTreeActions";
import FileTreeSlice, { FileTreeSelectors, selectOpenFiles } from "@/redux/sandbox/file-tree/FileTreeSlice";
import FileMapper from "@/helpers/FileMapper";

const CodeViewer = () => {
    const dispatch = useAppDispatch();
    const { open, selected, project, branch } = useSelector((state: RootState) => state.PROJECT_META);
    const selectedRef = useSelector((state: RootState) => selected === undefined ? undefined : state.FILE_TREE.entities[selected]);
    const openFiles = useSelector(selectOpenFiles);
    const tree = useSelector((state: RootState) => state.FILE_TREE.entities);

    const [pos, setPos] = useState<{ line: number, col: number }>({ line: 1, col: 1 });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const [session,] = useLocalStorage<ISession | null>("session", null);

    const params = useSearchParams();
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const line = Number(params?.get("line") || 1);
    const column = Number(params?.get("col") || 1);
    const monacoRef = useRef<typeof import("c:/J/Upskill/react-pp1/pp1-frontend/node_modules/monaco-editor/esm/vs/editor/editor.api") | null>(null);


    // const selectedFile = (id: string) useSelector(state =>
    //     state.files.byId[state.openTabs.selectedId]
    // );


    useCtrlShortcut("s", () => {
        if (selectedRef && project) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            // dispatch(FileTreeSlice.actions.save([{ id: selectedRef.id.toString() }]));
            dispatch(FileTreeActions.save([{ id: selectedRef.id.toString() }], project));
        }
    });


    const debounceSaveCode = (code: string | undefined, node: DeclaredNodeModel<FileMetaData>) => {

        dispatch(FileTreeSlice.actions.edit({
            id: node.id.toString(),
            content: code
        }));

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {

            if (code === node.data.last_content) {
                return;
            }

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

                await ApiFile.update(data.data);

            } else {
                console.error("error saving file, metadata redux state is null!");
            }

        }, 4000);
    };


    const handleChange = (code: string | undefined) => {
        if (selectedRef !== undefined && code !== selectedRef.data.content) {
            debounceSaveCode(code, selectedRef);

        }
    };


    const handleClose = (id: string | number) => {
        dispatch(OpenTabsAction.closeAndChangeWindow(id.toString()));

        //TODO hacer una clase para los paths

    };


    const handleChangeWindow = (file: DeclaredNodeModel<FileMetaData>) => {
        // if (selectedRef !== undefined && pos.line !== selectedRef.data.line) {
        //     dispatch(OpenTabsSlice.actions.edit({
        //         ...selectedRef,
        //         line: pos.line,
        //         edited: selectedRef?.data.edited
        //     }));
        //     console.log(pos.line);
        // }

        dispatch(OpenTabsAction.open({ ...file, data: file.data }));

        const p = new URLSearchParams(params?.toString());

        if (editorRef.current) {
            editorRef.current.focus();
            editorRef.current.setPosition({ lineNumber: file.data.line || 1, column: column || 1 });
        }

        p.delete("line");
        p.delete("col");
        router.push(`?${p.toString()}`);

    };


    const handleMount: OnMount = async (editor, monaco) => {

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx: monaco.languages.typescript.JsxEmit.React,
            allowJs: true,
            esModuleInterop: true,
            target: monaco.languages.typescript.ScriptTarget.ESNext,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monaco.languages.typescript.ModuleKind.ESNext,
            typeRoots: ["node_modules/@types"],
            allowNonTsExtensions: true,
            noEmit: true,
            strict: true,
            reactNamespace: "React",
        });

        //TODO ref:4 sincronizar esto con Sandpack y leerlo desde IDB
        cacheTypeFrom(monaco, "@types/react", "19.0.0");
        cacheTypeFrom(monaco, "@types/react-dom", "19.0.0");

        const model = monaco.editor.createModel(
            selectedRef?.data.content || "",
            LanguageMapper(selectedRef?.data.extension || "text"),
            // monaco.Uri.file(activeFile)
        );

        editor.setModel(model);


        editorRef.current = editor;

        editor.setPosition({ lineNumber: line, column });
        editor.revealLineInCenter(line);
        editor.focus();

        editor.onDidChangeCursorPosition((event) => {
            const { lineNumber: line, column } = event.position;

            setPos({ line, col: column });
        });
    };


    const handleBeforeMount: BeforeMount = async (monaco) => {
        monacoRef.current = monaco;
    }


    useEffect(() => {
        if (!tree) {
            return;

        } else if (monacoRef && monacoRef.current) {

            for (const id in tree) {

                const uri = monacoRef.current.Uri.parse(`file:///${tree[id].data.fullPath.toSpliced(0, 1).join("/")}`);

                let model = monacoRef.current.editor.getModel(uri);

                if (!model) {
                    model = monacoRef.current.editor.createModel(
                        tree[id].data.content || "",
                        LanguageMapper(tree[id].data.extension),
                        uri
                    );
                } else {
                    if (model.getValue() !== tree[id].data.content) {
                        model.setValue(tree[id].data.content || "");
                    }
                }
            }
        }
    }, [tree, monacoRef]);


    /* CHANGE URL PARAMETERS */
    useEffect(() => {

        const p = new URLSearchParams(params?.toString());
        if (selectedRef !== undefined) {

            document.title = `${"Unknown"} /${selectedRef.text}`;
            const path_ = selectedRef.data.fullPath.toSpliced(0, 1).join("/") || `/${selectedRef.text}`;

            p.set("file", path_);

        } else {
            p.delete("file");

        }

        router.push(`?${p.toString()}`);

    }, [selectedRef]);


    // useEffect(() => {
    //     if (editorRef.current) {
    //         editorRef.current.setPosition({ lineNumber: line, column });
    //         editorRef.current.revealLineInCenter(line);
    //         editorRef.current.focus();
    //     }
    // }, [line, column]);


    return (
        <div style={{}} className="w-1/2 h-full flex flex-col">
            {openFiles.length > 0 && selectedRef !== undefined ?
                <>
                    {/* WINDOW VIEW */}
                    <div className="w-full flex select-none">

                        {/* TITLE */}
                        {
                            openFiles.map((f) => {
                                // const file = tree.find(f_ => f.id === f_.id);
                                // if (!file) return null;
                                return (
                                    <div
                                        onClick={() => handleChangeWindow(f)}
                                        key={`window_${f.id}`}
                                        className={`hover:[&>span]:visible pl-3 py-1.5 bg-[#1e1e1e] cursor-pointer w-fit flex relative 
${f.id === selectedRef.id ? "border-x border-neutral-600" : "border-x border-[#1e1e1e] bg-neutral-900"}
${!f.data.edited && "italic"}`}
                                    >
                                        <div className="mr-3 content-center">
                                            <FileIconMapper type={f.data?.extension as string} />
                                        </div>
                                        {f.text}
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClose(f.id);
                                            }}
                                            className={`mx-2 px-0.5 -my-0.5 py-0.5 content-center rounded-[4px] 
${f.id === selectedRef.id || f.data.edited ? "visible hover:bg-[#ffffff13]" : "invisible hover:bg-[#ffffff18]"}`}>
                                            {
                                                f.data.edited && !f.data.saved ?
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
                                                    // {/* NOT EDITED (OR HOVER TO CLOSE) CROSS */}
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
                                            f.id === selectedRef?.id &&
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
                            selectedRef !== undefined ?
                                [...selectedRef.data.fullPath]
                                    .map((path, index) => {
                                        return (path === "0" ? null :
                                            <span className="hover:text-neutral-100 cursor-pointer mr-1.5 flex" key={`${path}_${selectedRef.text}`}>
                                                {/* {path === selectedFile.text && selectedFile.data?.extension !== FileType.FOLDER && (index + 1) === selectedFile.data?.fullPath?.length &&
                                                    <span className="mr-1">
                                                        <FileIconMapper type={selectedFile.data?.extension as string} />
                                                    </span>
                                                } */}
                                                {path === selectedRef.text &&
                                                    <span className="mr-1.5 h-full flex items-center">
                                                        <FileIconMapper size={12} type={selectedRef.data?.extension as string} />
                                                    </span>
                                                }
                                                {/* {`${path} ${path !== selectedFile.text ? "a" : ""}`} */}
                                                {path} {path !== selectedRef.text &&
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
                        theme="vs-dark"
                        // language={LanguageMapper(selectedRef?.data.extension as string)}
                        path={selectedRef?.data.fullPath.toSpliced(0, 1).join("/")}
                        // value={selectedRef?.data?.content || ""}
                        onChange={(x) => handleChange(x)}
                        beforeMount={handleBeforeMount}
                        onMount={handleMount}
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
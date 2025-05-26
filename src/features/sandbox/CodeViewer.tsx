"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { RootState } from "@/redux/store";
import { Editor } from "@monaco-editor/react";
import { useSelector } from "react-redux";
import FileIconMapper from "./FileIconMapper";
import FileType from "@/types/enum/FileType";
import { openFilesAction } from "@/redux/open-files/openFilesActions";
import { useAppDispatch } from "@/hooks/useTypedSelectors";
import LanguageMapper from "@/helpers/LanguageMapper";
import openFilesSlice from "@/redux/open-files/openFilesSlice";
import { useCallback, useRef, useState } from "react";
import { DeclaredNodeModel, OpenFileMetaData } from "@/types/state-types";
import treeSlice from "@/redux/file-tree/treeSlice";
import debounce from "lodash.debounce";
import { useSaveShortcut } from "@/hooks/shortcut/useSaveShortcut";

const CodeViewer = () => {
    const dispatch = useAppDispatch();
    const selectedFile = useSelector((state: RootState) => state.OPEN_FILES.selected);
    const openFiles = useSelector((state: RootState) => state.OPEN_FILES.open);
    // const [line, setLine] = useState<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useSaveShortcut(() => {
        if (selectedFile) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            dispatch(openFilesSlice.actions.changeSaved({ one: { id: selectedFile.id, saved: true } }));
        }
    });

    // const debounceSaveCode = useCallback(
    //     debounce((code: string | undefined, id: number | string) => {
    //         dispatch(openFilesSlice.actions.edit({
    //             id: id,
    //             code: code,
    //             line: 0,
    //             edited: true
    //         }));

    //     }, 1000), []);


    const debounceSaveCode = (code: string | undefined, id: string | number) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            dispatch(openFilesSlice.actions.edit({
                id: id,
                code: code,
                line: 0,
                edited: true
            }));
        }, 1000);
    };

    const handleChange = (code: string | undefined) => {
        if (selectedFile !== undefined) {
            debounceSaveCode(code, selectedFile.id);
        }
    };

    const handleClose = (id: string | number) => {
        dispatch(openFilesAction.closeAndChangeWindow(id));
    };

    const handleChangeWindow = (file: DeclaredNodeModel<OpenFileMetaData>) => {
        dispatch(openFilesAction.open({ ...file, data: file.data }));
        dispatch(treeSlice.actions.select(file.id));
    }

    return (
        <div className="w-full h-full flex flex-col">
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
                                            <FileIconMapper type={file.data?.fileType as string} />
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
                    <div className="px-4 py-1.5 flex border-x border-t border-neutral-600 cursor-pointer text-xs text-neutral-300 bg-[#1e1e1e] select-none">
                        {
                            selectedFile !== undefined ?
                                selectedFile.data?.pathNames ?
                                    selectedFile.data.pathNames.map((path, index) => {
                                        return (
                                            <span className="hover:text-neutral-100 cursor-pointer mr-1.5 flex" key={`${path}_${selectedFile.text}`}>
                                                {path === selectedFile.text && selectedFile.data?.fileType !== FileType.FOLDER && (index + 1) === selectedFile.data?.fullPath?.length &&
                                                    <span className="mr-1">
                                                        <FileIconMapper type={selectedFile.data?.fileType as string} />
                                                    </span>
                                                }
                                                {`${path} >`}
                                            </span>
                                        );
                                    })
                                    :
                                    <span>
                                        {selectedFile.parent}
                                    </span>
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
                        language={LanguageMapper(selectedFile?.data?.fileType as string)}
                        theme="vs-dark"
                        path={selectedFile?.data?.pathNames?.join("/")}
                        value={selectedFile?.data?.content || ""}
                        onChange={(x) => handleChange(x)}
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
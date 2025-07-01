"use client";
import { getBackendOptions, MultiBackend, NodeModel, Tree, TreeMethods, useTreeContext } from "@minoru/react-dnd-treeview";
import React, { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import FileComponent from "./FileComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import FileType from "@/types/enum/FileType";
import { useAppDispatch } from "@/hooks/useTypedSelectors";
import { DeclaredNodeModel, FileMetaData, OpenFilesType } from "@/types/state-types";
import { openFilesAction } from "@/redux/sandbox/open-files/openFilesActions";
import { jetBrainsMono } from "@/helpers/FontLoader";
import { FileTreeActions } from "@/redux/sandbox/file-tree/FileTreeActions";
import FileTreeSlice from "@/redux/sandbox/file-tree/FiletreeSlice";

const FileViewer: React.FC<{ name: string | null }> = ({ name }) => {

    const treeContext = useTreeContext();
    const dispatch = useAppDispatch();
    const treeData = useSelector((state: RootState) => state.FILE_TREE);
    const openFileData: OpenFilesType = useSelector((state: RootState) => state.OPEN_FILES);

    const treeRef = useRef<TreeMethods>(null);
    const contextMenuRef = useRef<HTMLDivElement | null>(null);
    const mainThreeRef = useRef<HTMLDivElement | null>(null);
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [positionMenu, setPositionMenu] = useState({ x: 0, y: 0, pos: "top" });

    const [contextSelected, setContextSelected] = useState<{
        node: NodeModel<FileMetaData>,
        onToggle?: () => void,
        isOpen?: boolean
    } | null>(null);

    const [creatingNode, setCreatingNode] = useState<{
        parentId: string | number,
        type: FileType.PLAIN_TEXT | FileType.FOLDER
    } | null>(null);


    useEffect(() => {
        console.log(creatingNode);
    }, [creatingNode]);


    const openFile = (node: NodeModel<FileMetaData>) => {
        dispatch(openFilesAction.open({ ...node, data: node.data as FileMetaData }));
    };


    //TODO hay que actualizar el path despues de hacer esto
    const handleDrop = (newTreeData: any) => {
        console.log("nothing");
    };


    useEffect(() => {
        if (openFileData.selected != null) {
            treeRef.current?.open(openFileData.selected?.data.fullPath as (string | number)[]);
        }
    }, [openFileData.selected]);


    useEffect(() => {
        const onMenuBlur = (e: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
                setVisibleMenu(false);
                setContextSelected(null);

                if (mainThreeRef.current && mainThreeRef.current.contains(e.target as Node)) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    const cancelClick = (e: MouseEvent) => {
                        e.stopPropagation();
                        mainThreeRef.current && mainThreeRef.current.removeEventListener("click", cancelClick);
                    };

                    creatingNode === null && mainThreeRef.current.addEventListener("click", cancelClick);

                }
            }
        };

        document.addEventListener("mousedown", onMenuBlur);

        return () => document.removeEventListener("mousedown", onMenuBlur);
    }, []);


    const handleContextMenu = (e: React.MouseEvent, node: NodeModel<FileMetaData>, onToggle?: () => void, isOpen?: boolean) => {
        e.preventDefault();
        setPositionMenu({ x: e.clientX, y: e.clientY, pos: e.clientY >= window.innerHeight - 200 ? "bottom" : "top" });

        setVisibleMenu(true);

        setContextSelected({ node, onToggle, isOpen });

        e.stopPropagation();
    };


    const addNode = (fileType: FileType.PLAIN_TEXT | FileType.FOLDER) => {
        if (contextSelected?.node.id !== undefined) {

            if (contextSelected.onToggle && !contextSelected.isOpen) {
                contextSelected.onToggle();
            }

            setCreatingNode({ parentId: contextSelected?.node.id, type: fileType });
            setVisibleMenu(false);
            setContextSelected(null);

        }
    };

    //TODO esto puede causar un error si se intenta agregar un . a una carpeta
    const handleCreateNode = (name: string) => {
        if (!name.trim() || creatingNode === null) {
            return setCreatingNode(null);

        } else {

            const tempId = Date.now();

            const newNode: NodeModel<FileMetaData> = {
                id: tempId,
                parent: creatingNode.parentId,
                text: name,
                data: {
                    extension: creatingNode.type === FileType.FOLDER ?
                        FileType.FOLDER
                        :
                        name.trim().substring(name.lastIndexOf(".") + 1).toLowerCase(),
                    fullPath: ["0"],
                }
            };

            if (newNode.data?.extension !== FileType.FOLDER) {
                dispatch(FileTreeActions.createAndOpenNode(newNode));
                const created = treeData.tree.find((n) => n.id === newNode.id);

                if (created) {
                    dispatch(FileTreeSlice.actions.select(created.id));

                }

            } else {
                dispatch(FileTreeSlice.actions.createNode({ ...newNode, data: newNode.data }));

            }

            setCreatingNode(null);
        }

    };


    return (
        <div onContextMenu={(e) => e.preventDefault()}
            onClick={() => setVisibleMenu(false)}
            className={`select-none pt-2 w-[20%] relative min-w-[10%] max-w-[50%] h-full text-sm flex flex-col ${jetBrainsMono.className}`}
        >
            {/*
                //TODO el click derecho al root -> crear nuevo archivo no funciona.
                //TODO cuando se hace click al arbol deberia desenfocarse ambos clicks.
            */}

            {/* CONTEXT MENU */}
            {
                visibleMenu &&
                <div>
                    <div style={{ top: positionMenu.y, left: positionMenu.x }} className="w-px h-px fixed z-50">
                        <div
                            ref={contextMenuRef}
                            style={positionMenu.pos === "top" ? { top: "0%" } : { bottom: "0%" }}
                            className="[&>div]:cursor-pointer overflow-hidden [&>div]:px-6 [&>div]:mx-1 [&>div]:pb-0.5 [&>div]:pt-1 [&>div]:hover:bg-[#ffffff1c] [&>div]:rounded-sm bg-[#1e1e1e] z-50 absolute w-fit text-nowrap flex flex-col py-1 rounded-md shadow-md shadow-black"
                        >

                            {(contextSelected?.node.droppable && contextSelected.node.data?.extension === "folder") ?
                                <>
                                    <div onClick={() => addNode(FileType.PLAIN_TEXT)}>
                                        New File...
                                    </div>
                                    <div onClick={() => addNode(FileType.FOLDER)}>
                                        New Folder...
                                    </div>
                                    <span className="w-full h-px bg-neutral-400 my-1"></span>
                                </>
                                :
                                null
                            }

                            {(contextSelected?.node.droppable && contextSelected.node.data?.extension === "folder") ?
                                <div>
                                    Paste
                                </div>
                                :
                                null
                            }

                            {contextSelected?.node.id !== "0" && contextSelected?.node.parent !== "-1" &&
                                <>
                                    <div>
                                        Cut
                                    </div>
                                    <div>
                                        Copy
                                    </div>
                                </>
                            }
                            <span className="w-full h-px bg-neutral-400 my-1"></span>

                            <div onClick={() => null}>
                                Copy Relative Path
                            </div>
                            {contextSelected?.node.id !== "0" && contextSelected?.node.parent !== "-1" &&
                                <>
                                    <span className="w-full h-px bg-neutral-400 my-1"></span>

                                    <div>
                                        Rename...
                                    </div>
                                    <div>
                                        Delete
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>

            }

            <DndProvider context={treeContext} backend={MultiBackend} options={getBackendOptions()}>
                <div
                    className="z-40 left-[calc(100%-5px)] top-0 absolute w-1! h-full cursor-ew-resize transition-colors ease-in-out delay-300 hover:bg-[#ffffff44]"
                ></div>

                <div className="px-4 py-2 font-light border-t border-transparent">
                    FILE EXPLORER
                </div>

                <div
                    ref={mainThreeRef}
                    onContextMenu={(e) => {
                        handleContextMenu(e, {
                            id: "0", parent: "-1", text: "root", droppable: true, data: { extension: "folder" }
                        });
                    }}
                    className="flex-1 relative font-light mt-2 max-w-full h-full w-full overflow-x-hidden overflow-y-scroll"
                >
                    {
                        treeData.tree !== undefined && treeData.tree.length > 0 &&
                        <Tree
                            tree={treeData.tree}
                            rootId={"-1"}
                            ref={treeRef}
                            onDrop={handleDrop}
                            insertDroppableFirst
                            render={(node, { depth, isOpen, onToggle }) => {

                                return <div
                                    className={`w-full flex-col`}
                                    onContextMenu={(e) => {
                                        handleContextMenu(e, node, onToggle, isOpen);
                                    }}
                                    onClick={(e) => {

                                        if (contextSelected !== null) {
                                            setContextSelected(null);
                                            dispatch(FileTreeSlice.actions.select(undefined));

                                        } else {
                                            node.droppable ? onToggle() : openFile(node);
                                            dispatch(FileTreeSlice.actions.select(node.id));

                                        }
                                    }}
                                >
                                    {node.id === "0" ?
                                        <div className="bg-[#1e1e1e] px-2 py-1 font-bold w-full flex cursor-pointer"
                                        >
                                            <span className="mr-1.5 flex mt-[2px]">
                                                {isOpen ?
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down">
                                                            <path d="m6 9 6 6 6-6" />
                                                        </svg>
                                                    </>
                                                    :
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right">
                                                            <path d="m9 18 6-6-6-6" />
                                                        </svg>
                                                    </>}
                                            </span>
                                            {node.text}
                                        </div>
                                        :
                                        <div className={`flex w-full cursor-pointer
${contextSelected?.node.id === node.id && !(creatingNode?.parentId === node.id) && "outline-1 outline-neutral-400 -outline-offset-1"} 
${treeData.selected?.id === node.id ? creatingNode?.parentId === node.id ? "bg-transparent!" : "bg-[#ffffff1c]" : "hover:bg-[#ffffff10]"}`
                                        }
                                            style={{ paddingLeft: node.data?.extension === "folder" ? "10px" : "15px" }}
                                        >
                                            {Array.from({ length: depth }).map((v, i) => {
                                                return i === 0 ?
                                                    <div key={i} style={{ paddingLeft: "15px" }}></div>
                                                    :
                                                    <div key={i} style={{ paddingLeft: "20px" }} className="border-l border-neutral-600"></div>
                                            })}
                                            <FileComponent isOpen={isOpen} node={(node as DeclaredNodeModel<FileMetaData>)} />
                                        </div>
                                    }

                                    {/* NEW FILE/FOLDER INPUT */}
                                    {(creatingNode?.parentId === node.id && node.droppable) &&
                                        <div
                                            style={{ paddingLeft: node.data?.extension === "folder" ? "10px" : "15px" }}
                                            className="cursor-pointer w-full hover:bg-[#ffffff10] flex"
                                        >
                                            {Array.from({ length: depth + 1 }).map((v, i) => {
                                                return i === 0 ?
                                                    <div key={i} style={{ paddingLeft: "15px" }}></div>
                                                    :
                                                    <div key={i} style={{ paddingLeft: "20px" }} className="border-l border-neutral-600"></div>
                                            }
                                            )}
                                            <FileComponent isOpen={false} node={{ id: "???", parent: -1, text: "", data: { extension: creatingNode.type } }} />
                                            <input
                                                autoFocus
                                                className="w-full outline-0 border border-neutral-400"
                                                type="text"
                                                onBlur={(e) => handleCreateNode(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleCreateNode((e.target as HTMLInputElement).value);
                                                    if (e.key === "Escape") setCreatingNode(null);
                                                }}
                                            />
                                        </div>
                                    }
                                </div>
                            }
                            }
                        />
                    }
                </div>
            </DndProvider>
        </div >
    );
};

export default FileViewer;
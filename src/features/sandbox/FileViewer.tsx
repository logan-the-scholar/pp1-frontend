"use client";
import { getBackendOptions, MultiBackend, NodeModel, Tree } from "@minoru/react-dnd-treeview";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import FileComponent from "./FileComponent";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import FileType from "@/types/enum/FileType";
import threeSlice from "@/redux/threeSlice";
import fileSlice from "@/redux/fileSlice";
import { createAndOpenNode } from "@/redux/actions";
import { useAppDispatch } from "@/hooks/useTypedSelectors";

export type FileMetaData = {
    fileType: string,
    fullPath?: string[] | number[],
    content?: string,
}

const FileViewer: React.FC = () => {

    const treeData: NodeModel<FileMetaData>[] = useSelector((state: RootState) => state.three);

    const handleDrop = (newTreeData: any) => { console.log("nothing") };
    const [selected, setSelected] = useState<NodeModel<FileMetaData> | null>(null);
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [positionMenu, setPositionMenu] = useState({ x: 0, y: 0 });
    const [contextSelected, setContextSelected] = useState<NodeModel<FileMetaData> | null>(null);
    const contextMenuRef = useRef<HTMLDivElement | null>(null);
    const mainThreeRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();
    const [creatingNode, setCreatingNode] = useState<{ parentId: string | number, type: FileType.PLAIN_TEXT | FileType.FOLDER } | null>(null);

    const openFile = (node: NodeModel<FileMetaData>) => {
        dispatch(fileSlice.actions.set(node));
    };


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


    const handleContextMenu = (e: React.MouseEvent, node: NodeModel<FileMetaData>) => {
        e.preventDefault();

        setPositionMenu({ x: e.clientX, y: e.clientY >= window.innerHeight - 200 ? e.clientY - 200 : e.clientY });
        setVisibleMenu(true);

        setContextSelected(node);
        e.stopPropagation();
    };


    const addNode = (fileType: FileType.PLAIN_TEXT | FileType.FOLDER) => {
        if (contextSelected?.id !== undefined) {
            setCreatingNode({ parentId: contextSelected.id, type: fileType });
        }
    };


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
                    fileType: creatingNode.type === FileType.FOLDER ? FileType.FOLDER : name.trim().substring(name.lastIndexOf(".") + 1).toLowerCase(),
                    fullPath: [0],
                }
            };

            if (newNode.data?.fileType !== FileType.FOLDER) {
                dispatch(createAndOpenNode(newNode));
            } else {
                dispatch(threeSlice.actions.createNode(newNode));
            }

            setCreatingNode(null);

        }

    };


    return (
        <div onContextMenu={(e) => e.preventDefault()}
            onClick={() => setVisibleMenu(false)}
            className="select-none pt-2 w-[20%] relative min-w-[10%] max-w-[50%] h-full text-sm flex flex-col"
        >
            {/*
                //TODO cuando se crea un nuevo archivo se deberia dar solo 1 click para poder abrir otro archivo
                //TODO mapear el arbol a dos arboles por cada carpeta, separando archivos de carpetas
                //TODO cuando se hace click al arbol deberia desenfocarse ambos clicks 
            */}

            {/* CONTEXT MENU */}
            {
                visibleMenu &&
                <div
                    ref={contextMenuRef}
                    style={{ top: positionMenu.y, left: positionMenu.x }}
                    className="[&>div]:cursor-pointer overflow-hidden [&>div]:px-6 [&>div]:mx-1 [&>div]:pb-0.5 [&>div]:pt-1 [&>div]:hover:bg-[#ffffff1c] [&>div]:rounded-sm bg-[#1e1e1e] z-50 absolute w-fit text-nowrap flex flex-col py-1 rounded-md shadow-md shadow-black"
                >

                    {(contextSelected?.droppable && contextSelected.data?.fileType === "folder") || (contextSelected?.id === 0 && contextSelected.parent === -1) ?
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

                    {(contextSelected?.droppable && contextSelected.data?.fileType === "folder") || (contextSelected?.id === 0 && contextSelected.parent === -1) ?
                        <div>
                            Paste
                        </div>
                        :
                        null
                    }
                    {contextSelected?.id !== 0 && contextSelected?.parent !== -1 &&
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

                    <div>
                        Copy Relative Path
                    </div>
                    {contextSelected?.id !== 0 && contextSelected?.parent !== -1 &&
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
            }

            <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                <div
                    className="z-40 left-[calc(100%-5px)] top-0 absolute w-1! h-[100vh] cursor-ew-resize transition-colors ease-in-out delay-300 hover:bg-[#ffffff44]"
                ></div>

                <div className="px-4 py-2 font-light border-t border-transparent">
                    FILE EXPLORER
                </div>

                <div className="bg-[#1e1e1e] px-2 py-1 font-bold w-full">Project name</div>

                <div
                    ref={mainThreeRef}
                    onContextMenu={(e) => {
                        handleContextMenu(e, { id: 0, parent: -1, text: "root" });
                    }}
                    className="flex-1 relative font-light mt-2 max-w-full h-full w-full overflow-x-hidden overflow-y-scroll"
                >
                    {
                        treeData !== undefined &&
                        <Tree
                            tree={treeData}
                            rootId={0}
                            onDrop={handleDrop}
                            render={(node, { depth, isOpen, onToggle, containerRef }) => (
                                <div
                                    className={`w-full flex-col 
`}
                                    // ${creatingNode && creatingNode.parentId === node.id && "hover:bg-[#1e1e1e]!"}
                                    onContextMenu={(e) => handleContextMenu(e, node)}
                                    onClick={(e) => {
                                        if (contextSelected !== null) {
                                            setContextSelected(null);
                                            setSelected(null);
                                        } else {
                                            node.droppable ? onToggle() : openFile(node);
                                            setSelected(node);

                                        }
                                    }}
                                >
                                    <div className={`flex w-full cursor-pointer
${contextSelected?.id === node.id && !(creatingNode?.parentId === node.id) && "outline-1 outline-neutral-400 -outline-offset-1"} 
${selected?.id === node.id ? creatingNode?.parentId === node.id ? "bg-transparent!" : "bg-[#ffffff1c]" : "hover:bg-[#ffffff10]"} 
`
                                        // ${creatingNode?.parentId === node.id && "bg-[#1e1e1e]!"}
                                    }
                                        style={{ paddingLeft: (depth * 22) + 16 }}
                                    >
                                        <FileComponent isOpen={isOpen} node={node} />
                                    </div>

                                    {creatingNode?.parentId === node.id && node.droppable &&
                                        <div style={{ paddingLeft: ((depth + 1) * 22) + 16 }} className="cursor-pointer w-full hover:bg-[#ffffff10] flex">
                                            <FileComponent isOpen={false} node={{ id: "???", parent: -1, text: "", data: { fileType: creatingNode.type } }} />
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
                            )}
                        />
                    }
                </div>
            </DndProvider>
        </div >
    );
};

export default FileViewer;
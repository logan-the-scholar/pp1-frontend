"use client";
import { getBackendOptions, MultiBackend, NodeModel, Tree } from "@minoru/react-dnd-treeview";
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import FileComponent from "./FileComponent";
import { useDispatch, useSelector } from "react-redux";
import { set } from "@/redux/fileSlice";
import { RootState } from "@/redux/store";

export type FileMetaData = {
    fileType: string, fullPath?: string[] | number[], content?: string
}

const FileViewer: React.FC = () => {

    const [treeData, setTreeData] = useState<NodeModel<FileMetaData>[]>(useSelector((state: RootState) => state.three));

    const handleDrop = (newTreeData: any) => setTreeData(newTreeData);
    const [selected, setSelected] = useState<NodeModel<FileMetaData> | null>(null);
    const dispatch = useDispatch();

    const select = (node: NodeModel<FileMetaData>) => {
        setSelected(node);
    };

    const openFile = (node: NodeModel<FileMetaData>) => {
        dispatch(set(node));
    };

    const createNode = () => {

    };

    const [visibleMenu, setVisibleMenu] = useState(false);
    const [positionMenu, setPositionMenu] = useState({ x: 0, y: 0 });

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setPositionMenu({ x: e.pageX, y: e.pageY });
        setVisibleMenu(true);
    };

    const handleHideContextMenu = () => {
        setVisibleMenu(false);
    };

    return (
        <div onClick={handleHideContextMenu} className="select-none pt-2 w-[20%] relative min-w-[10%] max-w-[50%] h-full text-sm flex flex-col">

            {/* CONTEXT MENU */}
            {visibleMenu &&
                <div
                    style={{ top: positionMenu.y, left: positionMenu.x }}
                    className="bg-[#1e1e1e] absolute w-fit text-nowrap z-20"
                >
                    context menu here
                </div>
            }

            <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                <div
                    className="z-50 left-[calc(100%-5px)] top-0 absolute w-1! h-[100vh] cursor-ew-resize transition-colors ease-in-out delay-300 hover:bg-[#ffffff44]"
                ></div>

                <div className="px-4 py-2 font-light border-t border-transparent">
                    FILE EXPLORER
                </div>

                <div className="bg-[#1e1e1e] px-2 py-1 font-bold w-full">Project name</div>

                <div className="flex-1 font-light mt-2 max-w-full h-full w-full overflow-x-hidden overflow-y-scroll">
                    {
                        treeData !== undefined &&
                        <Tree
                            tree={treeData}
                            rootId={0}
                            onDrop={handleDrop}
                            render={(node, { depth, isOpen, onToggle }) => (
                                <div
                                    className={`w-full cursor-pointer flex ${selected?.id === node.id ? "bg-[#ffffff1c]" : "hover:bg-[#ffffff10]"}`}
                                    onContextMenu={handleContextMenu}
                                    onClick={(e) => {
                                        e.button
                                        node.droppable ? onToggle() : openFile(node);
                                        select(node);
                                    }}
                                    style={{ paddingLeft: (depth * 22) + 16 }}
                                >
                                    <FileComponent isOpen={isOpen} node={node} />
                                </div>
                            )}
                        />
                    }
                </div>
            </DndProvider>
        </div>
    );
};

export default FileViewer;
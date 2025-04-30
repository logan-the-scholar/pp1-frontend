"use client";
import { getBackendOptions, MultiBackend, NodeModel, Tree } from "@minoru/react-dnd-treeview";
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import FileComponent from "./FileComponent";
import { useDispatch } from "react-redux";
import { set } from "@/redux/fileSlice";

export type FileMetaData = {
    fileType: string, fullPath?: string, content?: string
}

const FileViewer: React.FC = () => {

    const [treeData, setTreeData] = useState<NodeModel<FileMetaData>[]>(
        [
            {
                "id": 1,
                "parent": 0,
                "droppable": true,
                "text": "common",
                "data": {
                    "fileType": "folder"
                }
            },
            {
                "id": 2,
                "parent": 1,
                "text": "seed-data.json",
                "data": {
                    "fullPath": "common",
                    "content": "none",
                    "fileType": "json"
                }
            },
            {
                "id": 3,
                "parent": 1,
                "text": "config.ts",
                "data": {
                    "fileType": "ts"
                }

            },
            {
                "id": 4,
                "parent": 0,
                "droppable": true,
                "text": "root",
                "data": {
                    "fileType": "folder"
                }
            },
            {
                "id": 5,
                "parent": 4,
                "droppable": true,
                "text": "app",
                "data": {
                    "fileType": "folder"
                }
            },
            {
                "id": 6,
                "parent": 5,
                "text": "index.ts",
                "data": {
                    "fileType": "ts"
                }
            }
        ]
    );
    const handleDrop = (newTreeData: any) => setTreeData(newTreeData);
    const [selected, setSelected] = useState<NodeModel<FileMetaData> | null>(null);
    const dispatch = useDispatch();

    const select = (node: NodeModel<FileMetaData>) => {
        setSelected(node);
    };

    const openFile = (node: NodeModel<FileMetaData>) => {
        dispatch(set(node));
    };

    return (
        <div className="select-none pt-2 w-[20%] relative min-w-[10%] max-w-[50%] h-full text-sm flex flex-col">
            <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                <div
                    className="z-50 left-[calc(100%-5px)] top-0 absolute w-1! h-[100vh] cursor-ew-resize transition-colors ease-in-out delay-300 hover:bg-[#ffffff44]"
                ></div>

                <div className="px-4 py-2 font-light border-t border-transparent">
                    FILE EXPLORER
                </div>

                <div className="bg-[#1e1e1e] px-2 py-1 font-bold w-full">Project name</div>

                <div className="flex-1 font-light mt-2 max-w-full h-full w-full overflow-x-hidden overflow-y-scroll">
                    <Tree
                        tree={treeData}
                        rootId={0}
                        onDrop={handleDrop}
                        render={(node, { depth, isOpen, onToggle }) => (
                            <div
                                className={`w-full cursor-pointer flex ${selected?.id === node.id ? "bg-[#ffffff1c]" : "hover:bg-[#ffffff10]"}`}
                                onClick={() => {
                                    node.droppable ? onToggle() : openFile(node);
                                    select(node);
                                }}
                                style={{ paddingLeft: (depth * 22) + 16 }}
                            >
                                <FileComponent isOpen={isOpen} node={node} />
                            </div>
                        )}
                    />
                </div>
            </DndProvider>
        </div>
    );
};

export default FileViewer;
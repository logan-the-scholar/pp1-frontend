"use client";
import { getBackendOptions, MultiBackend, Tree } from "@minoru/react-dnd-treeview";
import { Folder, FolderOpen } from "lucide-react";
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import FileComponent from "./FileComponent";
import { jetBrainsMono } from "@/helpers/FontLoader";

const FileViewer: React.FC = () => {
    const [treeData, setTreeData] = useState(
        [
            {
                "id": 1,
                "parent": 0,
                "droppable": true,
                "text": "common"
            },
            {
                "id": 2,
                "parent": 1,
                "text": "seed-data.json",
                "data": {
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
                "text": "root"
            },
            {
                "id": 5,
                "parent": 4,
                "droppable": true,
                "text": "app"
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
                                className="w-full cursor-pointer hover:bg-[#ffffff10] flex"
                                onClick={() => node.droppable ? onToggle() : null} style={{ paddingLeft: (depth * 22) + 16 }}
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
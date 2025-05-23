import FileType from "@/types/enum/FileType";
import { DeclaredNodeModel, FileMetaData } from "@/types/state-types";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Satellite } from "lucide-react";

type treeType = {
    tree: DeclaredNodeModel<FileMetaData>[],
    selected: DeclaredNodeModel<FileMetaData> | undefined
}

const treeState: treeType = {
    tree: [
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
                "fullPath": [1],
                "fileType": "json"
            }
        },
        {
            "id": 3,
            "parent": 1,
            "text": "config.ts",
            "data": {
                "fullPath": [1],
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
                "fullPath": [4],
                "fileType": "folder"
            }
        },
        {
            "id": 6,
            "parent": 5,
            "text": "index.ts",
            "data": {
                "fullPath": [4, 5],
                "fileType": "ts"
            }
        }
    ],

    selected: undefined
};

const treeSlice = createSlice({
    name: "TREE",
    initialState: treeState,
    reducers: {

        createNode(state, action: PayloadAction<DeclaredNodeModel<FileMetaData>>) {
            if (action.payload.parent !== 0) {

                const newNode: DeclaredNodeModel<FileMetaData> = {
                    ...action.payload,
                    droppable: action.payload.data?.fileType === FileType.FOLDER ? true : undefined,
                    data: {
                        ...action.payload.data,
                        fileType: action.payload.data?.fileType || FileType.PLAIN_TEXT
                    }
                };

                state.tree.push(newNode);

            } else {
                state.tree.push(action.payload);

            }
        },

        /**Highlights visually the provided node and saves it as a state*/
        select(state, action: PayloadAction<string | number | undefined>) {
            const foundNode = state.tree.find((n) => n.id === action.payload);

            if (action.payload === undefined || foundNode === undefined) {
                state.selected = undefined;

            } else {

                state.selected = {
                    id: foundNode.id,
                    parent: foundNode.parent,
                    text: foundNode.text,
                    data: {
                        ...foundNode.data
                    }
                }

                foundNode.data?.fullPath?.forEach((x) => {
                    const parentIndex = state.tree.findIndex((node) => node.id === x);

                    if (parentIndex >= 0 && state.tree.at(parentIndex)?.droppable) {
                        state.tree[parentIndex].data.isDropped = true;
                    }
                });

            }

        },

    },

});

export default treeSlice;
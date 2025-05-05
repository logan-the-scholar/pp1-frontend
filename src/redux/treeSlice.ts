import FileType from "@/types/enum/FileType";
import { FileMetaData } from "@/types/FileMetadata.type";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: NodeModel<FileMetaData>[] = [
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
            "content": "none",
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
];

//TODO pasar todo esto a actions

const treeSlice = createSlice({
    name: "TREE",
    initialState,
    reducers: {

        createNode(state, action: PayloadAction<NodeModel<FileMetaData>>) {
            if (action.payload.parent !== 0) {
                // const newNode: NodeModel<FileMetaData> = action.payload;


                // newNode.data = { fullPath, fileType: action.payload.data?.fileType || FileType.PLAIN_TEXT };

                const newNode: NodeModel<FileMetaData> = {
                    ...action.payload,
                    droppable: action.payload.data?.fileType === FileType.FOLDER ? true : undefined,
                    data: {
                        ...action.payload.data,
                        fileType: action.payload.data?.fileType || FileType.PLAIN_TEXT
                    }
                };

                state.push(newNode);

            } else {
                state.push(action.payload);

            }
        }
    },

});

export default treeSlice;
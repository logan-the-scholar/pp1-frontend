import { AppThunk } from "@/redux/store";
import { ApiType } from "@/types/ApiResponse.type";
import treeSlice from "@/redux/sandbox/file-tree/treeSlice";
import { DeclaredNodeModel, FileMetaData } from "@/types/state-types";
import { FileRepository } from "../database/FileRepository";

function createStore(files: ApiType.File[]): AppThunk {
    return (async (dispatch, getState) => {
        try {

            await new FileRepository().createStore(files);

            dispatch(treeSlice.actions.createStore(
                files.map<DeclaredNodeModel<FileMetaData>>((file) => {
                    return {
                        id: file.id,
                        parent: file.parent,
                        text: file.name,
                        droppable: file.extension === "FOLDER",
                        data: {
                            extension: file.extension,
                            fullPath: file.path,
                            pathNames: file.pathNames,
                            content: file.content,
                            line: undefined,
                            isDropped: undefined
                        }
                    }
                })
            ));

        } catch (error: any) {
            console.error(error);
            throw error;
        }
    });
}

export const StateAndDatabase = { createStore };
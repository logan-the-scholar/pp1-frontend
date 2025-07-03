import { NodeModel } from "@minoru/react-dnd-treeview";
import openFilesSlice from "../open-files/openFilesSlice";
import FileType from "@/types/enum/FileType";
import { DeclaredNodeModel, FileMetaData, OpenFilesType, TreeType } from "@/types/state-types";
import { openFilesAction } from "../open-files/openFilesActions";
import { AppThunk } from "@/redux/store";
import { FileRepository } from "@/services/database/FileRepository";
import { ApiType } from "@/types/ApiResponse.type";
import FileTreeSlice from "./FileTreeSlice";
import { zodValidate } from "@/helpers/zod/ZodValidate";
import { IFileCreation } from "@/types/zTypes";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiFile } from "@/services/api/File";
import { FileCreation } from "@/types/FileCreation.type";

function createAndOpenNode(node: DeclaredNodeModel<FileMetaData>, projectId: string): AppThunk {
    return (async (dispatch, getState) => {

        const { pathNames, fullPath } = findParent(node, getState);
        const created = await pushNode({ ...node, data: { ...node.data, pathNames, fullPath } }, projectId);

        await new FileRepository().save(created);

        dispatch(FileTreeSlice.actions.createNode({
            id: created.id,
            text: created.name,
            parent: created.parent,
            data: {
                extension: created.extension,
                fullPath: created.path,
                pathNames: created.pathNames,
                content: created.content,
                line: 1,
                isDropped: false,
                author: created.author
            }
        }));

        const createdNode = getState().FILE_TREE.tree.find((n) => n.id === created.id);

        if (createdNode && createdNode.data?.extension.toLowerCase() !== FileType.FOLDER) {
            dispatch(openFilesSlice.actions.add({
                ...createdNode,
                data: {
                    ...createdNode.data as FileMetaData,
                    edited: true,
                    saved: true,
                }
            }));

            dispatch(FileTreeSlice.actions.select(createdNode.id));

            dispatch(openFilesAction.open(
                {
                    ...createdNode,
                    data: {
                        ...createdNode.data as FileMetaData,
                        edited: true,
                        saved: true,
                    }
                }));
        }
    })
}


function createStore(files: ApiType.File[]): AppThunk {
    return (async (dispatch, getState) => {
        try {

            await new FileRepository().createStore(files);

            dispatch(FileTreeSlice.actions.createStore(
                files.map<DeclaredNodeModel<FileMetaData>>((file) => {
                    return {
                        id: file.id,
                        parent: file.parent,
                        text: file.name,
                        droppable: file.extension.toUpperCase() === "FOLDER",
                        data: {
                            extension: file.extension,
                            author: file.author,
                            fullPath: file.path,
                            pathNames: file.pathNames,
                            content: file.content,
                            line: undefined,
                            isDropped: file.id === "0"
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


function findParent(node: NodeModel<FileMetaData>, getState: () => { OPEN_FILES: OpenFilesType, FILE_TREE: TreeType }) {

    let pathNames: string[] = [node.text];
    const fullPath: string[] = [node.id.toString()];

    const find = (id: string) => {
        const found: NodeModel<FileMetaData> | undefined = getState().FILE_TREE.tree.find((parentNode) => {
            return parentNode.id === id;
        });

        if (found !== undefined) {
            fullPath.unshift(found.id.toString());
            pathNames.unshift(found.text);

            if (found.parent !== "0") {
                find(found.parent as string);
            }
        }
    };

    find(node.id as string);

    return { pathNames, fullPath };
};


async function pushNode(node: DeclaredNodeModel<FileMetaData>, projectId: string) {

    const [success, data] = zodValidate<IFileCreation>({
        projectId,
        name: node.text,
        author: node.data.author,
        extension: node.data.extension,
        isFolder: node.droppable === undefined ? false : node.droppable,
        path: node.data.fullPath
    }, FileCreation);

    if (!success) {
        Object.entries(data.errors).forEach((e) => console.error(e));
        throw new ErrorHelper("aaaa nose");
    }

    const response = await ApiFile.create(data.data);

    if (response instanceof ErrorHelper) {
        throw new ErrorHelper(response.message, response.exception);

    }

    return await response.json() as ApiType.File;

}

export const FileTreeActions = { createAndOpenNode, createStore };


// import { NodeModel } from "@minoru/react-dnd-treeview";
// import openFilesSlice from "../open-files/openFilesSlice";
// import FileType from "@/types/enum/FileType";
// import { DeclaredNodeModel, FileMetaData } from "@/types/state-types";
// import { openFilesAction } from "../open-files/openFilesActions";
// import { AppThunk } from "@/redux/store";
// import { FileRepository } from "@/services/database/FileRepository";
// import { ApiType } from "@/types/ApiResponse.type";
// import FileTreeSlice from "./FiletreeSlice";
// import { ApiFile } from "@/services/api/File";
// import { zodValidate } from "@/helpers/zod/ZodValidate";
// import { IFileCreation } from "@/types/zTypes";
// import { FileCreation } from "@/types/FileCreation.type";
// import { ErrorHelper } from "@/helpers/ErrorHelper";

// function createAndOpenNode(node: DeclaredNodeModel<FileMetaData>): AppThunk {
//     return (async (dispatch, getState) => {
//         try {

//             let pathNames: string[] = [node.text];
//             const fullPath: string[] = [node.id.toString()];

//             const findParent = (id: number) => {

//                 const found: NodeModel<FileMetaData> | undefined = getState().FILE_TREE.tree.find((parentNode) => {
//                     return parentNode.id === id;
//                 });

//                 if (found !== undefined) {
//                     fullPath.unshift(found.id.toString());
//                     pathNames.unshift(found.text);

//                     if (found.parent !== 0) {
//                         findParent(found.parent as number);
//                     }
//                 }
//             };

//             findParent(node.parent as number);

//             dispatch(createAndPushNode(node));

//             const createdNode = getState().FILE_TREE.tree.find((n) => n.id === node.id);

//             if (createdNode && createdNode.data?.extension !== FileType.FOLDER) {
//                 dispatch(openFilesSlice.actions.add({
//                     ...createdNode,
//                     data: {
//                         ...createdNode.data as FileMetaData,
//                         edited: true,
//                         saved: true,
//                     }
//                 }));

//                 dispatch(FileTreeSlice.actions.select(createdNode.id));

//                 dispatch(openFilesAction.open(
//                     {
//                         ...createdNode,
//                         data: {
//                             ...createdNode.data as FileMetaData,
//                             edited: true,
//                             saved: true,
//                         }
//                     }));
//             }
//         } catch (error: any) {
//             console.error(error);
//             throw error;

//         }


//     });
// }

// function createStore(files: ApiType.File[]): AppThunk {
//     return (async (dispatch, getState) => {
//         try {

//             await new FileRepository().createStore(files);

//             dispatch(FileTreeSlice.actions.createStore(
//                 files.map<DeclaredNodeModel<FileMetaData>>((file) => {
//                     return {
//                         id: file.id,
//                         parent: file.parent,
//                         text: file.name,
//                         droppable: file.extension.toUpperCase() === "FOLDER",
//                         data: {
//                             extension: file.extension,
//                             fullPath: file.path,
//                             pathNames: file.pathNames,
//                             content: file.content,
//                             author: file.author,
//                             line: undefined,
//                             isDropped: undefined
//                         }
//                     }
//                 })
//             ));

//         } catch (error: any) {
//             console.error(error);
//             throw error;
//         }
//     });
// }

// function createAndPushNode(node: DeclaredNodeModel<FileMetaData>): AppThunk {
//     return (async (dispatch, getState) => {
//         const [success, data] = zodValidate<IFileCreation>({
//             projectId: "",
//             name: node.text,
//             author: node.data.author,
//             extension: node.data.extension,
//             isFolder: node.droppable === undefined ? false : node.droppable,
//             path: node.data.fullPath
//         }, FileCreation);

//         if (!success) {
//             Object.entries(data.errors).forEach((e) => console.error(e));
//             throw new ErrorHelper("aaaa nose");
//         }

//         const response = await ApiFile.create(data.data);

//         if (response instanceof ErrorHelper) {
//             throw new ErrorHelper(response.message, response.exception);

//         } else {
//             const { id, path, name, parent, ...createdFile }: ApiType.File = await response.json();

//             dispatch(FileTreeSlice.actions.createNode({
//                 id,
//                 text: name,
//                 parent,
//                 data: {
//                     ...createdFile,
//                     fullPath: path,
//                 }
//             }));

//         }
//     });
// }

// export const FileTreeActions = { createAndOpenNode, createStore, createAndPushNode };
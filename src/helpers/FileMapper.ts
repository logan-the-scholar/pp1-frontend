import { ApiType } from "@/types/ApiResponse.type";
import { DeclaredNodeModel, FileMetaData, OpenFilesType, TreeType } from "@/types/state-types";

function FileMapper(file: ApiType.File, getState: () => { OPEN_FILES: OpenFilesType; FILE_TREE: TreeType; }): DeclaredNodeModel<FileMetaData> {
    // {
    //     id: "faba6f54-64a5-46bb-a372-e148a49991b1",
    //     "author": "logan-the-scholar",
    //     "path": ["f66385dd-5669-4809-b2dc-94687ef17509::", "main.ts"],
    // }

    let path_: string[] | null = file.path.toSpliced(0, 1, "0"); // - 0/main.ts
    // const iterator: string[] = [];

    //         pathNames: file.path === null ? undefined : file.path.map((p) => files.find((s) => s.id === p)?.name) as string[],

    return {
        id: file.id,
        text: file.name,
        parent: file.id === "0" ? "-1" : path_.at(-2) || "0",
        droppable: file.extension.toUpperCase() === "FOLDER",
        data: {
            extension: file.extension,
            fullPath: path_.length === 0 ? null : path_,

            // pathNames: path_.length === 0 ? undefined : path_.map(p => {
            //     iterator.push(p);
            //     // getState().FILE_TREE.tree.find((s) => s.data.pathNames !== undefined && s.data.pathNames.join() === p)?.text
            //     return getState().FILE_TREE.tree.find(s =>
            //         s.data.pathNames !== undefined && s.data.pathNames.join("") === iterator.join(""))?.text || "0"
            // }),
            pathNames: path_,

            content: file.content,
            line: undefined,
            isDropped: file.id === "0",
            author: file.author,
            commit: file.commitId,
            movedFrom: file.moved_from || undefined,
            isDrafted: file.isDrafted,
        }
    }

}
export default FileMapper;
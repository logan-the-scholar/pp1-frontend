import { ApiType } from "@/types/ApiResponse.type";
import { DeclaredNodeModel, FileMetaData, OpenFilesType, TreeType } from "@/types/state-types";

function FileMapper(file: ApiType.File): DeclaredNodeModel<FileMetaData> {
    let path_: string[] | null = file.path.toSpliced(0, 1, "0"); // - 0/main.ts

    return {
        id: path_.join("/"),
        text: file.name,
        parent: file.id === "0" ? "-1" : path_.length === 1 ? path_[0] : path_.slice(0, -1).join("/"),
        droppable: file.extension.toUpperCase() === "FOLDER",
        data: {
            extension: file.extension,
            fullPath: path_.length === 0 ? null : path_,
            versionId: file.id,
            content: file.content,
            line: undefined, //TODO sacarlo de indexedDB
            isDropped: file.id === "0",
            author: file.author,
            commit: file.commitId,
            movedFrom: file.moved_from || undefined,
            isDrafted: file.isDrafted,
        }
    }

}
export default FileMapper;
import { ApiType } from "@/types/ApiResponse.type";
import { DeclaredNodeModel, FileMetaData, OpenFilesType, TreeType } from "@/types/state-types";
import { z, ZodString } from "zod";

function FileMapper(file: ApiType.File): DeclaredNodeModel<FileMetaData> {
    let path_: string[] = file.path.toSpliced(0, 1, "0"); // - 0/main.ts
    let content_: string | undefined = file.content || undefined;

    if (content_ !== null && content_ !== undefined && z.string().base64().safeParse(content_)) {
        const buffer = Buffer.from(content_, 'base64');
        content_ = buffer.toString('utf8');
    }

    return {
        id: path_.join("/"),
        text: file.name,
        parent: file.id === "0" ? "-1" : path_.length === 1 ? path_[0] : path_.slice(0, -1).join("/"),
        droppable: file.extension.toUpperCase() === "FOLDER",
        data: {
            extension: file.extension,
            fullPath: path_,
            versionId: file.id,
            content: content_,
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
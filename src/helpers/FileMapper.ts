import { ApiType } from "@/types/Api.type";
import { DbFileTabType } from "@/types/Database.type";
import { DeclaredNodeModel, FileMetaData, } from "@/types/ReduxState.type";
import { z } from "zod";

function FileMapper(file: ApiType.File, meta?: DbFileTabType): DeclaredNodeModel<FileMetaData> {
    let path_: string[] = file.path.toSpliced(0, 1, "0"); // - 0/main.ts
    let content_: string | undefined = file.content || undefined;

    if (content_ !== null && content_ !== undefined && z.string().base64().safeParse(content_)) {
        const buffer = Buffer.from(content_, 'base64');
        content_ = buffer.toString('utf8');
    }

    // console.log(meta);
    // console.log(file);
    
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
            last_content: content_,
            isDropped: file.id === "0",
            author: file.author,
            commit: file.commitId,
            fileStatus: file.fileStatus,
            createdAt: file.createdAt,
            line: meta?.line || undefined,
            edited: meta?.edited || false,
            saved: meta?.edited || true,
            fileId: file.fileId
        }
    }

}
export default FileMapper;
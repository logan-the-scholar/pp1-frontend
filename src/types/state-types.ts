export type FileMetaData = {
    fileType: string,
    fullPath?: string[] | number[],
    pathNames?: string[],
    content?: string,
    line?: number,
}

export type OpenFileMetaData = FileMetaData & {
    edited: boolean,
    saved: boolean,
}
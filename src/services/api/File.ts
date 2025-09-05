import { IFileCreation, IFileUpdation } from "@/types/zTypes/zTypes";
import { fetchCatch } from "../wrapper/fetch-catch";
import { API_SERVER } from "@/helpers/env-config";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiStatusEnum } from "@/types/enum/ApiStatus.enum";

async function create(data: IFileCreation): Promise<Response | ErrorHelper> {
    const { repoId, ...remain } = data;

    try {
        const response: Response = await fetchCatch(`${API_SERVER}/demo/api/v0/file/${repoId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...remain,
                content: remain.content !== null ? Buffer.from(remain.content).toString("base64") : null,
            })
        });

        return response;
    } catch (error: any) {
        return error instanceof ErrorHelper ? error : new ErrorHelper(ApiStatusEnum.UNKNOWN, error.message);

    }
}

async function remove(id: string): Promise<Response | ErrorHelper> {
    try {
        const response: Response = await fetchCatch(`${API_SERVER}/demo/api/v0/file/${id}`, {
            method: "DELETE",
        });

        return response;
    } catch (error: any) {
        return error instanceof ErrorHelper ? error : new ErrorHelper(ApiStatusEnum.UNKNOWN, error.message);

    }
}

async function update(data: IFileUpdation): Promise<Response | ErrorHelper> {
    const { repoId, ...remain } = data;

    try {

        const response: Response = await fetchCatch(`${API_SERVER}/demo/api/v0/file/repo/${repoId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...remain,
                id: remain.versionId,
                content: remain.content !== null ? Buffer.from(remain.content).toString("base64") : null
            })
        });

        return response;
    } catch (error: any) {
        return error instanceof ErrorHelper ? error : new ErrorHelper(ApiStatusEnum.UNKNOWN, error.message);

    }
}

export const ApiFile = { create, remove, update };
import { IFileCreation } from "@/types/zTypes";
import { fetchCatch } from "../wrapper/fetch-catch";
import { API_SERVER } from "@/helpers/env-config";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiStatusEnum } from "@/types/enum/ApiStatus.enum";

async function create(data: IFileCreation): Promise<Response | ErrorHelper> {
    try {
        const { projectId, ...remain } = data;

        const response: Response = await fetchCatch(`${API_SERVER}/demo/api/v0/file/${projectId}`, {
            method: "POST",
            body: JSON.stringify(remain)
        });

        return response;
    } catch (error: any) {
        return error instanceof ErrorHelper ? error : new ErrorHelper(ApiStatusEnum.UNKNOWN, error.message);

    }
}

export const ApiFile = { create }
import { API_SERVER } from "@/helpers/env-config";
import { IProjectCreation } from "@/types/zTypes";
import { fetchCatch } from "../wrapper/fetch-catch";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiStatusEnum } from "@/types/enum/ApiStatus.enum";
import { ApiType } from "@/types/ApiResponse.type";

async function create(data: IProjectCreation) {
    try {
        await fetchCatch(`${API_SERVER}/demo/api/v0/project`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...data })
        });
    } catch (error: any) {
        return error instanceof ErrorHelper ? error : new ErrorHelper(ApiStatusEnum.UNKNOWN, error.message);

    }
}

async function getAll(id: string): Promise<ErrorHelper | ApiType.Project[]> {
    try {
        return await fetchCatch(`${API_SERVER}/demo/api/v0/project/all/${id}`, {
            method: "GET"
        });

    } catch (error: any) {
        return error instanceof ErrorHelper ? error : new ErrorHelper(ApiStatusEnum.UNKNOWN, error.message);

    }
}

export const ApiProject = { getAll, create };
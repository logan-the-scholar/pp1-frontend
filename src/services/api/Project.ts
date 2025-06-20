import { API_SERVER } from "@/helpers/env-config";
import { IProjectCreation } from "@/types/zTypes";
import { fetchCatch } from "../wrapper/fetch-catch";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiStatusEnum } from "@/types/enum/ApiStatus.enum";
import { ApiType } from "@/types/ApiResponse.type";
import { URL } from "url";

async function create(data: IProjectCreation) {
    try {

        const response = await fetchCatch(`${API_SERVER}/demo/api/v0/project`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...data })
        });

        const created = response.headers.get("location");

        if (created === null) {
            throw new ErrorHelper(ApiStatusEnum.SERVER_ERROR, "501: Generated url can't be read. Reading: " + created);
        }

        return new URL(created);

    } catch (error: any) {
        console.error(error);
        return error instanceof ErrorHelper ? error : new ErrorHelper(ApiStatusEnum.UNKNOWN, error.message);

    }
}

async function getAll(id: string): Promise<ErrorHelper | ApiType.Project[]> {
    try {
        const response = await fetchCatch(`${API_SERVER}/demo/api/v0/project/all/${id}`, {
            method: "GET"
        });

        return await response.json();

    } catch (error: any) {
        return error instanceof ErrorHelper ? error : new ErrorHelper(ApiStatusEnum.UNKNOWN, error.message);

    }
}

async function deleteBy(id: string): Promise<ErrorHelper | { message: string }> {
    try {
        const response = await fetchCatch(`${API_SERVER}/demo/api/v0/project/${id}`, {
            method: "DELETE"
        });

        return await response.json();

    } catch (error: any) {
        return error instanceof ErrorHelper ? error : new ErrorHelper(ApiStatusEnum.UNKNOWN, error.message);

    }
}

export const ApiProject = { getAll, create, deleteBy };
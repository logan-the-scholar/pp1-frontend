import { API_SERVER } from "@/helpers/env-config";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiStatusEnum } from "@/types/enum/ApiStatus.enum";
import { fetchCatch } from "../wrapper/fetch-catch";

async function getAll(userId: string): Promise<any | ErrorHelper> {

    try {
        const response = await fetchCatch(`${API_SERVER}/demo/api/v0/workspace/${userId}`, {
            method: "GET"
        });

        return response;

    } catch (error: any) {
        return error instanceof ErrorHelper ? error : new ErrorHelper(ApiStatusEnum.UNKNOWN, error.message);

    }
}

export const ApiWorkspace = { getAll };
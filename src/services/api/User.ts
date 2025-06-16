import { API_SERVER } from "@/helpers/env-config";
import { ApiType } from "@/types/ApiResponse.type";
import { fetchCatch } from "../wrapper/fetch-catch";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiError } from "next/dist/server/api-utils";
import { ApiStatusEnum } from "@/types/enum/ApiStatus.enum";


async function register(): Promise<any> {

}

async function login(email: string, password: string): Promise<ApiType.Login | ErrorHelper> {

    try {

        const response: ApiType.Login = await fetchCatch(`${API_SERVER}/demo/api/v0/user/login`, {
            method: "POST",
            headers: {
                "X-Mail": email,
                "X-Pass": password
            }
        });

        return response;

    } catch (error: any) {

        return error instanceof ErrorHelper ? error : new ErrorHelper(ApiStatusEnum.UNKNOWN, error.message);
    }
}

async function githubSignIn(code: string): Promise<ApiType.Login | ErrorHelper> {

    try {

        const response: ApiType.Login = await fetchCatch(`${API_SERVER}/demo/api/v0/user/github/sign-in`, {
            method: "POST",
            headers: {
                "X-Code": code
            }
        });

        return response;

    } catch (error: any) {

        return error instanceof ErrorHelper ? error : new ErrorHelper(ApiStatusEnum.UNKNOWN, error.message);
    }
}

export const ApiUser = { register, login, githubSignIn };
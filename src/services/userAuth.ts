import { API_SERVER } from "@/helpers/env-variable-normalizator";
import { ApiResponse } from "@/types/ApiResponse.type";
import { fetchCatch } from "./fetch-error";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiError } from "next/dist/server/api-utils";
import { ApiStatusEnum } from "@/types/enum/ApiStatus.enum";

export class UserAuth {

    static async register(): Promise<any> {

    }

    static async login(): Promise<any> {
        //"Content-type": "application/json",

    }

    static async githubSignIn(code: string): Promise<ApiResponse.Login | ErrorHelper> {

        try {

            const response: ApiResponse.Login = await fetchCatch(`${API_SERVER}/demo/api/v0/user/github/sign-in`, {
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
}
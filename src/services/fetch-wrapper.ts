import { ErrorHelper } from "@/helpers/ErrorHelper";
import { fetchCatch } from "./fetch-catch";
import { ApiStatusEnum } from "@/types/enum/ApiStatus.enum";

/** Fetch a backend request, including the authentication token, as Bearer header token, from the local storage */
export async function fetchWrap(url: string | URL | globalThis.Request, options: RequestInit) {

    const userSession = localStorage.getItem("userSession");
    const token = userSession ? JSON.parse(userSession).token : null;

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    if (token!) {
        try {
            const data = await fetchCatch(url, { ...options, headers });

            return data;
        } catch (error) {

            if (error instanceof ErrorHelper) {
                
                // if (error.message === ApiStatusEnum.TOKEN_EXPIRED) {
                //     window.location.href = "/api/auth/logout?from=out_session";
                //     localStorage.clear();
                //     throw new ErrorHelper(ApiStatusEnum.TOKEN_EXPIRED, "Debes iniciar sesion nuevamente");
                // } else 

                if (error.message === ApiStatusEnum.USER_DELETED) {
                    window.location.href = "api/auth/logout?from=user_blocked";
                    localStorage.clear();
                }
            }

            throw error;
        }

    } else {
        throw new ErrorHelper(ApiStatusEnum.NOT_ALLOWED_HERE, "403");
    }
}
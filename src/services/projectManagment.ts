import { API_SERVER } from "@/helpers/env-variable-normalizator";
import { IProjectCreation } from "@/types/zTypes";
import { fetchCatch } from "./fetch-catch";

export async function createProject(data: IProjectCreation) {
    try {
        const response = await fetchCatch(`${API_SERVER}/demo/api/v0/project`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...data })
        });
    } catch (error) {

    }
}
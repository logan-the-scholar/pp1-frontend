import { API_SERVER } from "@/helpers/env-variable-normalizator";
import { IProjectCreation } from "@/types/zTypes";

export async function createProject(data: { owner: string } & IProjectCreation) {
    try {
        const response = await fetch(`${API_SERVER}`);
        
    } catch (error) {
        
    }
}
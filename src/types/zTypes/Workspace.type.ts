import { z } from "zod";

export const StorageWorkspace = () => z.object({
    id: z.string().uuid(),
    name: z.string(),
    owner: z.string(),
});
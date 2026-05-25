import { z } from "zod";

export const StorageBranch = () => z.object({
    branch: z.string().optional(),
    headId: z.string().uuid().optional(),
    draftId: z.string().uuid().optional()
});
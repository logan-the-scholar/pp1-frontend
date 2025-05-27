import { z } from "zod";

export const ProjectCreation = () => z.object({
    name: z.string().optional(),
    visibility: z.union(
        [
            z.literal("private"),
            z.literal("public")
        ]
    )
});
import { z } from "zod";

export const ProjectCreation = () => z.object({
    name: z.string().min(2, "name lenght must be between 2 - 24 characters")
        .max(24, "name lenght must be between 2 - 24 characters"),
    visibility: z.union(
        [
            z.literal("private"),
            z.literal("public")
        ]
    ),
    workspaceId: z.string().uuid("workspace id must be a valid id!"),
});
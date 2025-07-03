import { z } from "zod";

export const FileCreation = () => z.object({
    projectId: z.string().uuid("project id must be a valid uuid"),

    name: z.string().min(1, "name lenght must be between 1 - 50 characters").max(50, "name lenght must be between 1 - 50 characters"),

    author: z.string({ message: "author name must can't be empty" }),

    extension: z.string(),

    isFolder: z.boolean({ message: "isFolder status must can't be empty" }),

    path: z.array(z.string().uuid("path reference must be a valid uuid"), { message: "idk" }).nullable(),
});
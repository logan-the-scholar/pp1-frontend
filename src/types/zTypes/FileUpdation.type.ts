import { z } from "zod";

export const FileUpdation = () => z.object({

    repoId: z.string().uuid("project id must be a valid uuid"),

    id: z.string().uuid("file id reference must be present"),

    author: z.string({ message: "author name can't be empty" }).min(4).max(30),

    path: z.array(z.string(), { message: "path list can't be empty" }),

    newName: z.string().nullable(),

    content: z.string().nullable(),

    newExtension: z.string().nullable(),

    newPath: z.array(z.string()).nullable(),

    createdAt: z.number({ message: "update date must be a timestamp number" }),

    branch: z.string().min(4, "branch lenght must be between 1-20 characters").max(20, "branch lenght must be between 1-20 characters"),
});
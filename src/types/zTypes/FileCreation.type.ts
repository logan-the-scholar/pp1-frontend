import { z } from "zod";

export const FileCreation = () => z.object({
    repoId: z.string().uuid("project id must be a valid uuid"),

    name: z.string({ message: "file name can't be empty" })
    //.min(1, "name lenght must be between 1-50 characters").max(50, "name lenght must be between 1-50 characters")
    ,

    author: z.string({ message: "author name can't be empty" }).min(4).max(30),

    extension: z.string({ message: "file extension can't be null" }),

    //isFolder: z.boolean({ message: "isFolder status must can't be empty" }),

    path: z.array(z.string(), { message: "path list can't be empty" }),

    branch: z.string().min(4, "branch lenght must be between 1-20 characters").max(20, "branch lenght must be between 1-20 characters"),

    content: z.string().nullable(),

    createdAt: z.number({ message: "creation date must be a timestamp number" })
});
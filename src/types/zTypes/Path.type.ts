import { z } from "zod";

export const Path = () => z.object({
    path: z.array(z.string(), { message: "path list can't be empty" })
        .superRefine((args, ctx) => {
            const regex = /^\/[^/:]+$/;
            args.forEach((a, i) => {
                if (i > 0) {
                    !regex.test(a) && ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: a + " is not a valid path format",
                    });
                } else if (a.length > 1 || a.at(0) !== ":") {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: a + " is not a valid path root",
                    });
                }
            })
        })
});
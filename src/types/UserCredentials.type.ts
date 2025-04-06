import { z } from "zod";
const passwordSchema = z.string()
    .min(8, "Must be longer than 9 characters")
    .superRefine((password, ctx) => {
        const errors = [];
        if (!/[a-z]/.test(password)) {
            errors.push("a lowercase");
        }

        if (!/[A-Z]/.test(password)) {
            errors.push("an uppercase");
        }

        if (!/\d/.test(password)) {
            errors.push("a number");
        }

        if (!/[!@#$%^&*]/.test(password)) {
            errors.push("at least one special character !@#$%^&*");
        }

        if (errors.length === 0) {
            return;
        }

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: errors.length > 0 ? "Must contain " + errors.join(", ") : "",
        });
    });

export const UserCredentials = () => z.object({
    mail: z.string().min(6, "Email must be longer than 6 characters")
        .max(50, "This mail is too long!")
        .email("Must be a valid email"),

    password: passwordSchema,
});
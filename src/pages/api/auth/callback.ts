import { NextApiRequest, NextApiResponse } from "next";

interface CustomError extends Error {
    cause?: {
        errorDescription?: string;
    };
}

export default async function callback(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { code } = req.query
        if (typeof code === "string" && code.length > 10) {
            console.log(code);
        }
    } catch (error: unknown) {
        console.error("callback error:", error);
        if (error instanceof Error && (error as CustomError).cause?.errorDescription === "user is blocked") {
            return res.redirect(302, "/auth/signin?from=user_blocked");
        }

        res.status(500).json({ error });
    }
}
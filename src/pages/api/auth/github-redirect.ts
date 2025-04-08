import { NextApiRequest, NextApiResponse } from "next";

export default async function callback(req: NextApiRequest, res: NextApiResponse) {
    try {
        res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&prompt=select_account&scope=user&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/github-callback`);
    } catch (error: unknown) {
        console.error("callback error:", error);
        res.status(500).json({ message: "This error is unusual, contact support for more information", error });
    }
}
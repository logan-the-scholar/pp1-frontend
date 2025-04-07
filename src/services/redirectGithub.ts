export const redirectToGitHub = (redirect_uri?: string | undefined) => {

    window.location.href =
        `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user&redirect_uri=${redirect_uri || `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`}`;
};
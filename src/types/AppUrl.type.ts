export const AppUrl = {
    api: {
        auth: {
            /** /api/auth */
            _: "/api/auth",
            /** /api/auth/logout */
            logout: "/api/auth/logout"
        },
    },

    auth: {
        /** /auth */
        _: "/auth",
        /** /auth/signin */
        signin: "/auth/signin"
    },

    Dashboard: {
        /**@returns `/dashboard/projects` */
        projects: "/dashboard/projects",

        /**@returns `/dashboard?from={action}` */
        from: (action: "invalid-id" | "error" | "invalid-branch") => "/dashboard?from=" + action,
    },
    /** /dashboard */
    dashboard: "/dashboard",

    Sandbox: {
        /**@returns `/sandbox/{id}` */
        id: (id: string) => "/sandbox/" + id,
        /**@returns `/sandbox/{id}/{branch}` */
        id_branch: (id: string, branch: string) => "/sandbox/" + id + "/" + branch,

    },
    sandbox: "/sandbox",

};
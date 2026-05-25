export const AppUrl = {
    api: {
        auth: {
            /** /api/auth */
            _: "/api/auth",
            /** /api/auth/logout */
            logout: "/api/auth/logout"
        },
    },

    Auth: {

        /** /auth/signin */
        signin: "/auth/signin",
        /**@returns `/auth/signin?from={action}` */
        Signin: {
            from: (action: string) => "/auth/signin?from=" + action
        }
    },
    /** /auth */
    auth: "/auth",

    Dashboard: {
        /**@returns `/dashboard/projects` */
        projects: "/dashboard/projects",

        /**@returns `/dashboard/projects?from={action}` */
        from: (action: "invalid-id" | "error" | "invalid-branch") => "/dashboard/projects?from=" + action,
    },
    /** /dashboard */
    dashboard: "/dashboard/projects",

    Sandbox: {
        /**@returns `/sandbox/{id}` */
        id: (id: string) => "/sandbox/" + id,
        /**@returns `/sandbox/{id}/{branch}` */
        id_branch: (id: string, branch: string) => "/sandbox/" + id + "/" + branch,

    },
    sandbox: "/sandbox",

};
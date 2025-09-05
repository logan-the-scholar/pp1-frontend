"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { PopupProvider } from "@/context/PopupProvider";
import Main from "@/features/sandbox/Main";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { store } from "@/redux/store";
import { ApiProject } from "@/services/api";
import { ApiType } from "@/types/ApiResponse.type";
import { AppUrl } from "@/types/AppUrl.type";
import { use, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { z } from "zod";

export default function Sandbox({ params }: {
    params: Promise<{ id: string, branch: string }>,
    // searchParams: Promise<{ line?: number, col?: number }>
}) {
    const useParams = use(params);
    // const useSearchParams = use(searchParams);

    const [files, setFiles] = useState<ApiType.File[] | null>(null);
    // const [name, setName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [session,] = useLocalStorage<ApiType.Session | null>("session", null);

    useEffect(() => {
        if (session === null) {
            window.location.href = AppUrl.Auth.Signin.from("session-expired");
            return;
        }

        const fetch = async () => {

            if (!z.string().uuid().safeParse(useParams.id).success) {
                window.location.href = AppUrl.Dashboard.from("invalid-id");
                return;

            } else {
                if (!z.string().min(4).max(20).safeParse(useParams.branch).success) {
                    window.location.href = AppUrl.Sandbox.id(useParams.id);

                } else {

                    const responseFiles = await ApiProject.getBranchAndFiles(useParams.id, useParams.branch);

                    if (responseFiles instanceof ErrorHelper) {
                        window.location.href = AppUrl.Dashboard.from("error");
                        return;
                    }

                    document.title = "Null | " + responseFiles.name;

                    if (responseFiles.files !== null) {
                        setFiles([
                            {
                                id: "0",
                                parent: "-1",
                                name: responseFiles.name,
                                author: "none",
                                extension: "FOLDER",
                                path: ["0"],
                                commitId: "",
                                isDrafted: true
                            }, ...responseFiles.files]);
                    }

                    setLoading(false);
                }
            }
        };

        if (typeof window !== "undefined") {
            fetch();
        }

    }, []);

    return (
        <>
            {useParams.id === null ?
                null
                :
                <Provider store={store}>
                    <PopupProvider>
                        {loading ?
                            <div className="w-full h-[100vh]">
                                <LoadingCircle size={78} />
                            </div>
                            :
                            <Main info={{ ...useParams }} files={files} />}
                    </PopupProvider>
                </Provider>
            }
        </>
    );
}
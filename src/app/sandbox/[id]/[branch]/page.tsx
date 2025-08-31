"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { PopupProvider } from "@/context/PopupProvider";
import Main from "@/features/sandbox/Main";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { store } from "@/redux/store";
import { ApiProject } from "@/services/api";
import { ApiType } from "@/types/ApiResponse.type";
import { AppUrl } from "@/types/AppUrl.type";
import { use, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { z } from "zod";

export default function Sandbox({ params, searchParams }: { params: Promise<{ id: string, branch: string }>, searchParams: Promise<any> }) {
    const useParams = use(params);
    const [files, setFiles] = useState<ApiType.File[] | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
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
                            <Main basicInfo={{ ...useParams }} files={files} />}
                    </PopupProvider>
                </Provider>
            }
        </>
    );
}
"use client";
import LoadingCircle from "@/components/LoadingCircle";
import ContentSideBar from "@/features/sandbox/ContentSideBar";
import EditorNavBar from "@/features/sandbox/EditorNavBar";
import FileViewer from "@/features/sandbox/FileViewer";
import Preview from "@/features/sandbox/Preview";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { store } from "@/redux/store";
import { ApiProject } from "@/services/api";
import { ApiType } from "@/types/ApiResponse.type";
import { use, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { z } from "zod";

export default function Sandbox({ params, searchParams }: { params: Promise<{ name: string }>, searchParams: Promise<any> }) {
    const usedParams = use(params);
    const usedQuery = use(searchParams);
    const [isLoading, setIsloading] = useState<boolean>(true);
    const [temp, setTemp] = useState<ApiType.Project | null>(null);
    // const [selectedWorkspace,] = useLocalStorage("selected_worskpace", null);

    useEffect(() => {
        if (z.string().uuid().safeParse(usedParams.name).success) {

            const fetch = async () => {
                const response = await ApiProject.get(usedParams.name);

                if (response instanceof ErrorHelper) {
                    return;
                }

                setTemp(response);
                setIsloading(false);
            };

            fetch();
        }

    }, [usedParams]);

    return (
        <>
            {isLoading ?
                <div className="w-full h-[100vh]">
                    <LoadingCircle size={78} />
                </div>
                :
                <Provider store={store}>
                    <div className="flex flex-col w-full h-[100vh]">
                        <div className="w-full h-10 bg-neutral-900">
                            <EditorNavBar />
                        </div>
                        <div className="w-full flex-1 flex bg-neutral-900">
                            <ContentSideBar />
                            <FileViewer name={"nose"} />
                            <Preview />
                        </div>
                    </div>
                </Provider>
            }
        </>
    );
}
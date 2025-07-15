"use client";
import EditorNavBar from "./EditorNavBar";
import ContentSideBar from "./ContentSideBar";
import FileViewer from "./FileViewer";
import Preview from "./Preview";
import { useEffect, useState } from "react";
import { ApiProject } from "@/services/api";
import { z } from "zod";
import LoadingCircle from "@/components/LoadingCircle";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { useAppDispatch } from "@/hooks/useTypedSelectors";
import { ApiUrl } from "@/types/ApiUrl.type";
import { FileTreeActions } from "@/redux/sandbox/file-tree/FileTreeActions";
import { OpenFilesAction } from "@/redux/sandbox/open-files/OpenFilesActions";
import FileTreeSlice from "@/redux/sandbox/file-tree/FileTreeSlice";

const Main: React.FC<{ id: string }> = ({ id }) => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsloading] = useState<boolean>(true);
    const [basicInfo, setBasicInfo] = useState<{ name: string } | null>(null);

    useEffect(() => {

        const fetch = async () => {
            if (z.string().uuid().safeParse(id).success) {
                const response = await ApiProject.get(id);

                if (response instanceof ErrorHelper) {
                    window.location.href = `${ApiUrl.dashboard}?from=error`;
                    return;
                }

                setBasicInfo({ name: response.name });

                dispatch(FileTreeSlice.actions.setProject(response.id));

                if (response.files !== null) {
                    dispatch(FileTreeActions.createStore([
                        {
                            id: "0",
                            parent: "-1",
                            name: response.name,
                            author: "none",
                            extension: "FOLDER",
                            path: [],
                            //pathNames: []
                        }, ...response.files]));
                }
                setIsloading(false);
            } else {
                window.location.href = `${ApiUrl.dashboard}?from=invalid-id`;

            }
        };

        if (typeof window !== "undefined") {
            fetch();
        }

    }, []);

    return (
        <>
            {isLoading || id === undefined ?
                <div className="w-full h-[100vh]">
                    <LoadingCircle size={78} />
                </div >
                :
                <>
                    {/* //TODO AGREGAR ERROR HANDLING AQUI */}
                    {basicInfo !== null &&
                        <div className="flex flex-col w-full h-[100vh]">
                            <div className="w-full h-10 bg-neutral-900">
                                <EditorNavBar />
                            </div>
                            <div className="w-full flex-1 flex bg-neutral-900">
                                <ContentSideBar />
                                <FileViewer info={{ name: basicInfo.name, id }} />
                                <Preview />
                            </div>
                        </div>
                    }
                </>
            }
        </>
    );
}

export default Main;
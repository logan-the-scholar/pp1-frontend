"use client";
import EditorNavBar from "./EditorNavBar";
import ContentSideBar from "./ContentSideBar";
import FileViewer from "./FileViewer";
import Preview from "./Preview";
import { useEffect, useState } from "react";
import LoadingCircle from "@/components/LoadingCircle";
import { useAppDispatch } from "@/hooks/useTypedSelectors";
import { FileTreeActions } from "@/redux/sandbox/file-tree/FileTreeActions";
import { ApiType } from "@/types/ApiResponse.type";

type RepositoryMetadata = {
    id: string,
    // name: string,
    branch: string,
}

const Main: React.FC<{ files: ApiType.File[] | null, basicInfo: RepositoryMetadata }> = ({ files, basicInfo }) => {

    const dispatch = useAppDispatch();
    const [isLoading, setIsloading] = useState<boolean>(true);

    useEffect(() => {
        if (files !== null) {
            dispatch(FileTreeActions.createStore(files));
        }

    }, [files]);

    return (
        <>
            {/*
                        //TODO AGREGAR ERROR HANDLING AQUI
                    */}
            {basicInfo !== null &&
                <div className="flex flex-col w-full h-[100vh]">
                    <div className="w-full h-10 bg-neutral-900">
                        <EditorNavBar />
                    </div>
                    <div className="w-full flex-1 flex bg-neutral-900">
                        <ContentSideBar />
                        <FileViewer info={{ ...basicInfo }} />
                        <Preview />
                    </div>
                </div>
            }
        </>
    );
}

export default Main;
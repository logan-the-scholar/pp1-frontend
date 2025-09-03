"use client";
import EditorNavBar from "./EditorNavBar";
import ContentSideBar from "./ContentSideBar";
import FileViewer from "./FileViewer";
import CodeAndPreview from "./CodeAndPreview";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useTypedSelectors";
import { FileTreeActions } from "@/redux/sandbox/file-tree/FileTreeActions";
import { ApiType } from "@/types/ApiResponse.type";
import FileTreeSlice from "@/redux/sandbox/file-tree/FileTreeSlice";

type RepositoryMetadata = {
    id: string,
    // name: string,
    branch: string,
}

const Main: React.FC<{ files: ApiType.File[] | null, basicInfo: RepositoryMetadata }> = ({ files, basicInfo }) => {

    const dispatch = useAppDispatch();
    // const [isLoading, setIsloading] = useState<boolean>(true);

    useEffect(() => {
        if (files !== null && files.length > 0) {
            dispatch(FileTreeSlice.actions.setProject(basicInfo.id));
            dispatch(FileTreeSlice.actions.setBranch(basicInfo.branch));
            dispatch(FileTreeActions.createStore(files));
        }

    }, [files]);

    return (
        <>
            {basicInfo !== null &&
                <div className="flex flex-col w-full h-[100vh]">
                    <div className="w-full h-10 bg-neutral-900">
                        <EditorNavBar />
                    </div>
                    <div className="w-full flex-1 flex bg-neutral-900">
                        <ContentSideBar />
                        <FileViewer info={{ ...basicInfo }} />
                        <CodeAndPreview />
                    </div>
                    {/* <div className="w-full h-5 bg-transparent absolute left-0 bottom-0">
                        <div className="border-t border-neutral-600 w-20 bg-neutral-900">

                        </div>
                    </div> */}
                </div>
            }
        </>
    );
}

export default Main;
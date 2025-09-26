"use client";
import EditorNavBar from "./EditorNavBar";
import ContentSideBar from "./ContentSideBar";
import FileViewer from "./FileViewer";
import { SandpackLayout, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import CodeViewer from "./CodeViewer";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/useTypedSelectors";
import { FileTreeActions } from "@/redux/sandbox/file-tree/FileTreeActions";
import { ApiType } from "@/types/ApiResponse.type";
import FileTreeSlice, { FileTreeSelectors } from "@/redux/sandbox/file-tree/FileTreeSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ProjectMetaSlice from "@/redux/sandbox/project-meta/ProjectMetaSlice";

type RepositoryMetadata = {
    id: string,
    branch: string,
}

const Main: React.FC<{ files: ApiType.File[] | null, info: RepositoryMetadata }> = ({ files, info }) => {
    const fileTree = useSelector((state: RootState) => FileTreeSelectors.selectAll(state));
    const dispatch = useAppDispatch();
    const [files_, setFiles_] = useState<Record<string, { code: string; active?: boolean; }> | undefined>(undefined);

    useEffect(() => {
        if (files !== null && files.length > 0) {
            dispatch(ProjectMetaSlice.actions.setProject(info.id));
            dispatch(ProjectMetaSlice.actions.setBranch(info.branch));
            dispatch(FileTreeActions.createStore(files));
        }

    }, [files]);

    useEffect(() => {

        const a = fileTree.reduce((acc, file, index) => {
            const formatedPath = file.data.fullPath.toSpliced(0, 1);
            const path = formatedPath.join("/");

            if (file.data.last_content) {
                acc[path] = {
                    code: file.data.last_content,
                    active: index === 0
                };
            }

            return acc;
        }, {} as Record<string, { code: string; active?: boolean }>);

        setFiles_(a);
    }, [fileTree]);

    return (
        <>
            {info !== null &&
                <div className="flex flex-col w-full h-[100vh]">
                    <div className="w-full h-10 bg-neutral-900">
                        <EditorNavBar />
                    </div>
                    <div className="w-full flex-1 flex bg-neutral-900">
                        <ContentSideBar />
                        <FileViewer info={{ ...info }} />
                        {/* <CodeAndPreview /> */}

                        <SandpackProvider
                            style={{ flex: 1 }}
                            template="react-ts"
                            customSetup={{
                                dependencies: {
                                    //TODO ref:4 sincronizar esto con monaco y leerlo desde IDB
                                    "react": "^18.0.0",
                                    "react-dom": "^18.0.0",
                                }
                            }}
                            files={files_}
                        >
                            <div className="w-full text-white flex h-full overflow-hidden">
                                <CodeViewer />
                                <div className="h-full w-1/2">
                                    <SandpackLayout style={{ height: "100%" }}>
                                        <SandpackPreview
                                            style={{ height: "100%" }}
                                            showNavigator={true}
                                            showOpenInCodeSandbox={false}

                                        />
                                    </SandpackLayout>
                                </div>
                            </div>

                        </SandpackProvider>
                    </div>
                    {/* <div className="w-full h-5 bg-transparent absolute left-0 bottom-0">
                        <div className="border-t border-neutral-600 w-20 bg-neutral-900">

                        </div>
                    </div> */}
                </div >
            }
        </>
    );
}

export default Main;
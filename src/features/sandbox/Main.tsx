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
import { AppUrl } from "@/types/AppUrl.type";
import { FileTreeActions } from "@/redux/sandbox/file-tree/FileTreeActions";
import FileTreeSlice from "@/redux/sandbox/file-tree/FileTreeSlice";
import { showPopup } from "@/context/PopupProvider";

const Main: React.FC<{ id: string, branch: string }> = ({ id, branch }) => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsloading] = useState<boolean>(true);
    const [basicInfo, setBasicInfo] = useState<{ name: string } | null>(null);

    const setupProject = async (branch_: string) => {
        const responseFiles = await ApiProject.getBranchAndFiles(id, branch_);

        if (responseFiles instanceof ErrorHelper) {
            window.location.href = `${AppUrl.dashboard}?from=error`;
            return;
        }

        if (responseFiles.files !== null) {
            dispatch(FileTreeActions.createStore([
                {
                    id: "0",
                    parent: "-1",
                    name: responseFiles.name,
                    author: "none",
                    extension: "FOLDER",
                    path: [],
                    commitId: "",
                    isDrafted: true
                }, ...responseFiles.files]));
        }
    };

    useEffect(() => {

        const fetch = async () => {
            if (!z.string().uuid().safeParse(id).success) {
                window.location.href = `${AppUrl.dashboard}?from=invalid-id`;
                return;

            } else {

                if (!z.string().min(4).max(20).safeParse(branch).success) {
                    // window.location.href = `${AppUrl.dashboard}?from=invalid-branch-name`;
                    // return;

                    const responseBranches = await ApiProject.getAndBranches(id);

                    if (responseBranches instanceof ErrorHelper) {
                        window.location.href = `${AppUrl.dashboard}?from=error`;
                        return;
                    }

                    setBasicInfo({ name: responseBranches.name });
                    dispatch(FileTreeSlice.actions.setProject(responseBranches.id));

                    showPopup({
                        title: `${responseBranches.name}`,
                        type: "multiple-select-confirm",
                        message: `Select a branch to continue`,
                        confirmText: "Select",
                        cancelText: "Cancel",
                        dismissable: false,
                    }).then(async ({ confirmed, selected }) => {

                        if (confirmed) {
                            if (selected === undefined) {
                                window.location.href = `${AppUrl.dashboard}?from=invalid-branch-name`;
                                return;

                            }
                            await setupProject(selected);
                            setIsloading(false);

                        } else {
                            window.location.href = AppUrl.dashboard;
                            return;

                        }
                    });
                } else {
                    await setupProject(branch);
                    setIsloading(false);

                }
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
                                <FileViewer info={{ name: basicInfo.name, id, branch }} />
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
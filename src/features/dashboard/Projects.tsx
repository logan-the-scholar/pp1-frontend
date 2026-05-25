"use client";
import React, { useEffect, useState } from "react";
import ProjectPopup from "./ProjectPopup";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import LoadingCircle from "@/components/LoadingCircle";
import ProjectCard from "./ProjectCard";
import { ApiProject, ApiWorkspace } from "@/services/api";
import { AppUrl } from "@/types/AppUrl.type";
import { StorageSession } from "@/types/zTypes/Login.type";
import { StorageWorkspace } from "@/types/zTypes/Workspace.type";
import { StorageWorkspaces } from "@/types/zTypes/Workspaces.type";
import { ApiType } from "@/types/Api.type";

const Projects: React.FC<{ showPopup: boolean, setShowPopup: React.Dispatch<React.SetStateAction<boolean>> }> = ({
    showPopup, setShowPopup }) => {

    const [projects, setProjects] = useState<ApiType.Project[] | null>(null);
    const [session,] = useLocalStorage("session", StorageSession(), null);
    const [selectedWorkspace, setSelectedWorkspace] = useLocalStorage("selected_workspace", StorageWorkspace(), null);
    const [workspace, setWorkspace] = useLocalStorage("workspaces", StorageWorkspaces(), null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingProjects, setLoadingProjects] = useState<boolean>(true);

    const loadWorkspaces = async (session_: ApiType.Session) => {
        const response: ApiType.Workspace[] | ErrorHelper = await ApiWorkspace.getAll(session_.name);

        if (response instanceof Array) {
            setWorkspace(response);

            if (selectedWorkspace === null && response.length > 0) {
                setSelectedWorkspace(response[0]);
            }

        }

    };

    useEffect(() => {
        setLoading(true);

        //TODO tokens de autenticacion (de muy corta duracion) y refresh token en cookies
        const fetch = async () => {
            if (session === null) {
                console.error("Session storage is empty!");
                window.location.href = AppUrl.Auth.Signin.from("error");
                return;
            }

            loadWorkspaces(session);
            setLoading(false);

        };

        if (typeof window !== undefined) {
            fetch();
        }

    }, []);


    useEffect(() => {

        const fetch = async () => {
            //TODO ref:1
            let w_ = selectedWorkspace;
            if (w_ === null || w_ === undefined) {

                if (session) {
                    await loadWorkspaces(session);
                    setLoading(false);
                }
            }

            const response: ApiType.Project[] | ErrorHelper = await ApiProject.getAll((w_?.id || selectedWorkspace?.id) as string);

            if (response instanceof ErrorHelper) {
                console.error(response);

            } else {
                setProjects(response);

            }

            setLoadingProjects(false);
        };

        if (selectedWorkspace !== null) {
            fetch();
        }
    }, [selectedWorkspace]);

    return (
        <>
            {!loading ?
                <>
                    <div className="w-full h-full">

                        <div className="h-full w-full">
                            <div className="text-4xl">
                            </div>

                            {!loadingProjects ?
                                <div className="w-full h-full">
                                    {projects !== null && projects.length > 0 ?
                                        <div className="p-8 grid grid-cols-4 gap-3 w-full h-full">
                                            {projects.map((x) =>
                                                <ProjectCard key={x.id} {...x} />
                                            )}
                                        </div>
                                        :
                                        <div>
                                            <div>
                                                Nothing here Yet! create a project to start
                                            </div>
                                            <button
                                                className="p-1 bg-amber-400 text-neutral-800 cursor-pointer"
                                                onClick={() => setShowPopup(true)}
                                            >
                                                New +
                                            </button>
                                        </div>
                                    }
                                </div>
                                :
                                <div className="w-full h-full">
                                    <LoadingCircle size={54} />
                                </div>
                            }
                        </div>
                    </div>
                    <ProjectPopup setShowPopup={setShowPopup} showPopup={showPopup} />
                </>
                :
                <div className="w-full h-full">
                    <LoadingCircle size={78} />
                </div>
            }
        </>
    );
}

export default Projects;
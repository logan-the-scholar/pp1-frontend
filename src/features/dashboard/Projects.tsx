"use client";
import React, { useEffect, useState } from "react";
import ProjectPopup from "./ProjectPopup";
import { fetchWorkspaces } from "@/services/workspace";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ApiType } from "@/types/ApiResponse.type";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import LoadingCircle from "@/components/LoadingCircle";
import { fetchProjects } from "@/services/projects";
import ProjectCard from "./ProjectCard";

const Projects: React.FC<{ showPopup: boolean, setShowPopup: React.Dispatch<React.SetStateAction<boolean>> }> = ({
    showPopup, setShowPopup }) => {

    const [projects, setProjects] = useState<ApiType.Project[] | null>(null);
    const [user,] = useLocalStorage<ApiType.Login>("session", null);
    const [selectedWorkspace, setSelectedWorkspace] = useLocalStorage<ApiType.Workspace>("selected_workspace", null);
    const [workspace, setWorkspace] = useLocalStorage<ApiType.Workspace[]>("workspaces", null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingProjects, setLoadingProjects] = useState<boolean>(true);


    useEffect(() => {
        setLoading(true);
        //TODO en un futuro guardar todo esto en indexedDB
        //TODO tokens de autenticacion (de muy corta duracion) y refresh token en cookies
        const fetch = async () => {
            const response: ApiType.Workspace[] | ErrorHelper = await fetchWorkspaces(user.id);

            if (response instanceof ErrorHelper) {
                console.error(response);

            } else {
                setWorkspace(response);
                if (selectedWorkspace === null && response.length > 0) {
                    setSelectedWorkspace(response.at(0) as ApiType.Workspace);
                }

            }

            setLoading(false);
        };

        fetch();
    }, []);


    useEffect(() => {

        if (selectedWorkspace !== null) {
            const fetch = async () => {
                const response: ApiType.Project[] | ErrorHelper = await fetchProjects(selectedWorkspace.id);

                if (response instanceof ErrorHelper) {
                    console.error(response);

                } else {
                    setProjects(response);

                }

                setLoadingProjects(false);
            };

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
                                Projects
                            </div>

                            {!loadingProjects ?
                                <div className="w-full h-full">
                                    {projects !== null && projects.length > 0 ?
                                        <div className="grid grid-cols-4 gap-3 w-full h-full">
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
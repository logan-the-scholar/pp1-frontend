"use client";
import React, { useEffect, useState } from "react";
import ProjectPopup from "./ProjectPopup";
import { fetchWorkspaces } from "@/services/workspace";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ApiType } from "@/types/ApiResponse.type";
import { ErrorHelper } from "@/helpers/ErrorHelper";

const Projects: React.FC<{ showPopup: boolean, setShowPopup: React.Dispatch<React.SetStateAction<boolean>> }> = ({
    showPopup, setShowPopup }) => {

    // const [showPopup, setShowPopup] = useState<boolean>(false);
    const [projects, setProjects] = useState<string[] | null>(null);
    const [user, setUser] = useLocalStorage<ApiType.Login>("session", null);
    const [selectedWorkspace, setSelectedWorkspace] = useLocalStorage<ApiType.Workspace>("selected_workspace", null);
    const [workspace, setWorkspace] = useLocalStorage<ApiType.Workspace[]>("workspaces", null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        //TODO en un futuro guardar todo esto en indexedDB
        //TODO tokens de autenticacion (de muy corta duracion) y refresh token en cookies
        const fetch = async () => {
            const response: ApiType.Workspace[] | ErrorHelper = await fetchWorkspaces(user.id);

            if (response instanceof ErrorHelper) {
                console.error(response);

            } else {
                setWorkspace(response);
                setLoading(false);
                if(selectedWorkspace === null && response.length > 0) {
                    setSelectedWorkspace(response.at(0) as ApiType.Workspace);
                }
            }
        };

        fetch();

    }, []);

    return (
        <>
            <div className="w-ful h-full">

                <div>
                    <div className="text-4xl">
                        Projects
                    </div>

                    <div>
                        {projects !== null && projects.length > 0 ?
                            projects.map((x) =>
                                <div className="cursor-pointer" key={`p_${x}`}>{x}</div>
                            )
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
                </div>
            </div>
            <ProjectPopup setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
}

export default Projects;
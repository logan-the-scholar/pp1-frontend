"use client";
import React, { useEffect, useState } from "react";
import ProjectPopup from "./ProjectPopup";
import { fetchWorkspaces } from "@/services/workspace";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ApiType } from "@/types/ApiResponse.type";
import { ErrorHelper } from "@/helpers/ErrorHelper";

const Projects = () => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [projects, setProjects] = useState<string[] | null>(null);
    const [data, setData] = useLocalStorage<ApiType.Login>("session", null);

    useEffect(() => {

        const fetch = async () => {
            const idk: any | ErrorHelper = await fetchWorkspaces(data.id);

            if(idk instanceof ErrorHelper) {

                console.log(idk);
            }

        };

        fetch();

    }, []);

    return (
        <>
            <div className="w-ful h-full">
                <button
                    className="p-1 bg-amber-200 text-neutral-700 cursor-pointer"
                    onClick={() => setShowPopup(true)}
                >
                    New Project
                </button>
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
                                    className="p-1 bg-amber-200 text-neutral-700 cursor-pointer"
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
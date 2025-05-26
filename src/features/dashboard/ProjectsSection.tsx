"use client";
import { ArrowDownFromLine, Eye, FolderPen } from "lucide-react";
import React, { useState } from "react";

interface newProject {
    name: string | undefined;
    visibility: "public" | "private";
}

const ProjectsSection = () => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [projects, setProjects] = useState<string[] | null>(null);
    const [projectInfo, setProjectInfo] = useState<newProject>({ name: undefined, visibility: "private" });
    // const clickOutRef = useRef<HTMLDivElement | null>(null);

    // const handleClosePopup = (e: React.MouseEvent<HTMLDivElement>) => {
    //     console.log(e.currentTarget);

    //     if (e.currentTarget === e.target) {

    //     }
    // };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
    }

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
            {
                showPopup &&
                <div
                    onClick={(e) => setShowPopup(false)}
                    className="w-full h-full fixed inset-0 z-30 bg-[#0e0e0e70] flex items-center justify-center"
                >
                    <div
                        className="w-1/2 h-1/2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full h-full border z-40 border-neutral-400 bg-neutral-950">
                            <div className="w-full border-b border-neutral-400 content-end flex">
                                <div
                                    onClick={() => setShowPopup(false)}
                                    className="ml-auto cursor-pointer hover:bg-neutral-700 px-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        className="lucide lucide-x-icon lucide-x"
                                        width="20" height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    >
                                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                    </svg>
                                </div>
                            </div>

                            <form autoComplete="off"
                                className='flex-row m-4'
                            // onSubmit={(x) => login(x)}
                            >
                                <div className="text-xl">
                                    Project Configuration
                                </div>

                                <div className='flex-row mb-5'>
                                    <label className='w-full text-xs ml-2' htmlFor="name">
                                        Project name
                                    </label>
                                    <div className='flex ml-2 outline-1 bg-neutral-800'>
                                        <FolderPen className="my-auto ml-3" width={20} height={20} />
                                        <input
                                            // disabled={loading}
                                            onChange={(e) => handleChange(e)}
                                            className='px-3 py-1 bg-transparent w-full outline-0 focus:outline-offset-0'
                                            type="text" name="name" id="name"
                                            value={projectInfo.name || ""}
                                        />
                                    </div>
                                </div>

                                <div className='flex-row mb-5'>
                                    <label className='w-full text-xs ml-2' htmlFor="visibility">
                                        Visibility
                                    </label>
                                    <div className='text-sm py-0.5 flex ml-2 outline-1 bg-neutral-800 select-none cursor-pointer'>
                                        <Eye className="my-auto ml-3" width={20} height={20} />
                                        <div
                                            className='px-3 py-1 bg-transparent w-full outline-0 focus:outline-offset-0'
                                            id="visibility"
                                        >
                                            {"Private (Only members with invitation)"}
                                        </div>
                                        <ArrowDownFromLine className="my-auto mr-3" width={20} height={20} />
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div >
                </div >
            }
        </>
    );
}

export default ProjectsSection;
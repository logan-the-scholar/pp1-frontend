import { zodValidate } from "@/helpers/zod/ZodValidate";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { createProject } from "@/services/projects";
import { ApiType } from "@/types/ApiResponse.type";
import { ProjectCreation } from "@/types/ProjectCreation.type";
import { IProjectCreation } from "@/types/zTypes";
import { ArrowDownFromLine, Eye, FolderPen } from "lucide-react";
import { FormEvent, useState } from "react";

const ProjectPopup: React.FC<{ setShowPopup: React.Dispatch<React.SetStateAction<boolean>>, showPopup: boolean }> = ({ setShowPopup, showPopup }) => {
    const [isDropDown, setIsDropDown] = useState<boolean>(false);
    const [projectInfo, setProjectInfo] = useState<IProjectCreation>({ name: "", visibility: "private", workspaceId: "" });
    const [selectedWorkspace] = useLocalStorage<ApiType.Workspace>("selected_workspace", null);
    const visibilityMessage: Map<string, string> = new Map([
        ["public", "Public (Anyone can see the project)"],
        ["private", "Private (Only members with invitation)"]
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        if ('target' in e && e.target instanceof HTMLInputElement) {
            setProjectInfo((prev) => {
                return {
                    ...prev,
                    name: (e as React.ChangeEvent<HTMLInputElement>).target.value
                }
            });

        } else if (e.target instanceof HTMLDivElement) {
            const currentVisibility = e.currentTarget.id;

            setProjectInfo((prev) => {
                return {
                    ...prev,
                    visibility: currentVisibility as "public" | "private"
                }
            });

        }
    };


    const handleCreate = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const [success, data] = zodValidate<IProjectCreation>({ ...projectInfo, workspaceId: selectedWorkspace.id }, ProjectCreation);
        
        if (!success) {
            console.error(data.errors);
            return;
        }

        createProject(data.data);

        setShowPopup(false);
    };


    const handlePopupView = (isOpen: boolean) => {
        setShowPopup(isOpen);
        if (!isOpen) {
            setIsDropDown(false);
            setProjectInfo((prev) => {
                return { ...prev, name: "", visibility: "private" }
            });
        }
    };


    return (
        <>
            {showPopup &&

                <div
                    onClick={(e) => handlePopupView(false)}
                    className="w-full h-full fixed inset-0 z-30 bg-[#0e0e0e70] flex items-center justify-center"
                >
                    <div
                        className="w-1/2 h-1/2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full h-full border z-40 border-neutral-400 bg-neutral-950">
                            <div className="w-full border-b border-neutral-400 content-end flex">
                                <div
                                    onClick={() => handlePopupView(false)}
                                    className="ml-auto cursor-pointer hover:bg-red-700 px-1"
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
                                onSubmit={(e) => handleCreate(e)}
                            >
                                <div className="text-xl">
                                    Project Configuration
                                </div>

                                {/* NAME SECTION */}
                                <div className='flex-row mb-5'>
                                    <label className='w-full text-xs ml-2' htmlFor="name">
                                        Project name
                                    </label>
                                    <div className='flex ml-2 outline-1 bg-neutral-800'>
                                        <FolderPen className="my-auto ml-3" width={20} height={20} />
                                        <input
                                            onChange={(e) => handleChange(e)}
                                            className='px-3 py-1 bg-transparent w-full outline-0 focus:outline-offset-0'
                                            type="text" name="name" id="name"
                                            value={projectInfo.name || ""}
                                        />
                                    </div>
                                </div>

                                {/* DROPDOWN SECTION */}
                                <div className='flex-row mb-10'>
                                    <label className='w-full text-xs ml-2' htmlFor="visibility">
                                        Visibility
                                    </label>

                                    {/* DROPDOWN */}
                                    <div
                                        onClick={() => setIsDropDown(!isDropDown)}
                                        className='relative flex-col text-sm py-0.5 ml-2 outline-1 bg-neutral-800 select-none cursor-pointer'
                                    >
                                        <div className="flex">
                                            <Eye className="my-auto ml-3" width={20} height={20} />
                                            <div
                                                className='px-3 py-1 bg-transparent w-full outline-0 focus:outline-offset-0'
                                                id="visibility"
                                            >
                                                {visibilityMessage.get(projectInfo.visibility)}
                                            </div>
                                            <ArrowDownFromLine
                                                className={`my-auto mr-3 origin-center ${isDropDown && "-rotate-180"}`}
                                                width={20} height={20}
                                            />
                                        </div>

                                        {
                                            isDropDown &&
                                            <div className="absolute border-t-0 border border-neutral-300 w-[calc(100%+2px)] -left-[1px] bg-neutral-800">
                                                {
                                                    Array.from(visibilityMessage.entries()).map((value) =>
                                                        <div
                                                            className="pl-2 py-1 hover:bg-neutral-700"
                                                            onClick={(e) => handleChange(e)}
                                                            id={value[0]}
                                                            key={value[0]}
                                                        >
                                                            {value[1]}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>

                                <div className="w-full flex justify-end">
                                    <button
                                        className="p-1 bg-amber-500 cursor-pointer"
                                        type="submit"
                                    >
                                        Create
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div >
            }
        </>
    );
};

export default ProjectPopup;
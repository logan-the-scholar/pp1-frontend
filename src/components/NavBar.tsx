"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ApiType } from "@/types/ApiResponse.type";
import { useEffect, useState } from "react";

const NavBar: React.FC<{ setShowPopup: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setShowPopup }) => {
    const [userData,] = useLocalStorage<ApiType.Login>("session", null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userDataState, setUserDataState] = useState<ApiType.Login | null>(null);
    const [workspaces,] = useLocalStorage<ApiType.Workspace[]>("workspaces", null);
    const [selectedWorkspace,] = useLocalStorage<ApiType.Workspace>("selected_workspace", null);
    const [selectedWorkspaceState, setSelectedWorkspace] = useState<ApiType.Workspace | null>(null);

    useEffect(() => {
        if (typeof window !== undefined && userData !== null) {
            setUserDataState(userData);

        }

    }, [userData]);

    useEffect(() => {
        if (typeof window !== undefined && workspaces !== null && selectedWorkspace !== null) {
            if (workspaces.find((w) => w.id === selectedWorkspace.id) !== undefined) {
                setSelectedWorkspace(selectedWorkspace);

            }
        }

    }, [selectedWorkspace]);

    return (
        <nav className="flex justify-around w-full">
            {selectedWorkspaceState !== null &&
                <div className="h-full">
                    <div className="bg-amber-400">
                        {selectedWorkspaceState.name}
                    </div>
                </div>
            }

            <button
                className="text-sm p-1 bg-amber-400 text-neutral-700 cursor-pointer text-nowrap"
                onClick={() => setShowPopup(true)}
            >
                new project
            </button>

            {
                userDataState !== null &&
                <div className="h-full w-10">
                    <img
                        className="rounded-full cursor-pointer h-full w-full"
                        src={userDataState.profileImage} alt="profile image"
                    />
                </div>
            }
        </nav>
    );
};

export default NavBar;
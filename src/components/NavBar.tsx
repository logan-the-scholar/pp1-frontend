"use client";
import { useDashboardContext } from "@/context/DashboardProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ApiType } from "@/types/Api.type";
import { StorageSession } from "@/types/zTypes/Login.type";
import { StorageWorkspace } from "@/types/zTypes/Workspace.type";
import { StorageWorkspaces } from "@/types/zTypes/Workspaces.type";
import { useEffect, useState } from "react";

const NavBar: React.FC = () => {
    const [, setShowPopup] = useDashboardContext();
    const [userData,] = useLocalStorage("session", StorageSession(), null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userDataState, setUserDataState] = useState<ApiType.Session | null>(null);
    const [workspaces,] = useLocalStorage("workspaces", StorageWorkspaces(), null);
    const [selectedWorkspace,] = useLocalStorage("selected_workspace", StorageWorkspace(), null);
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
        <nav className="h-full flex justify-around w-full border-b border-neutral-600 grid-cols-3">
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
                <div className="h-8 w-8">
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
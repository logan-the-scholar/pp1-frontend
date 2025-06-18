"use client";
import React, { createContext, useContext, useState } from "react";

const Context = createContext<[showPopup: boolean, setShowPopup: React.Dispatch<React.SetStateAction<boolean>>] | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [showPopup, setShowPopup] = useState<boolean>(false);

    return (
        <Context.Provider value={[showPopup, setShowPopup]}>
            {children}
        </Context.Provider>
    );
}

export const useDashboardContext = (() => useContext(Context)) as () => [
    showPopup: boolean, setShowPopup: React.Dispatch<React.SetStateAction<boolean>>
];
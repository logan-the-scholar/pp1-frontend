"use client";
import NavBar from "@/components/NavBar";
import Projects from "@/features/dashboard/Projects";
import { useState } from "react";

export default function Dashboard() {
    const [showPopup, setShowPopup] = useState<boolean>(false);

    return (
        <>
            <div className="w-full pt-2">
                <NavBar setShowPopup={setShowPopup} />
            </div>

            <div className="w-full h-full overflow-hidden">
                <div className="w-full h-full relative">
                    <Projects showPopup={showPopup} setShowPopup={setShowPopup}/>
                </div>
            </div>
        </>
    );
}
"use client";
import NavBar from "@/components/NavBar";
import Projects from "@/features/dashboard/Projects";
import { useState } from "react";

export default function Dashboard() {
    const [showPopup, setShowPopup] = useState<boolean>(false);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full pt-2 flex">
                <NavBar setShowPopup={setShowPopup} />
            </div>

            <div className="w-full overflow-hidden flex-1">
                <div className="w-full h-full relative">
                    <Projects showPopup={showPopup} setShowPopup={setShowPopup}/>
                </div>
            </div>
        </div>
    );
}
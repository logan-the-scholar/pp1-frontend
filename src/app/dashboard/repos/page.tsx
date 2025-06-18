"use client";
import { useDashboardContext } from "@/context/DashboardProvider";
import Projects from "@/features/dashboard/Projects";

export default function Dashboard() {
    const [showPopup, setShowPopup] = useDashboardContext();

    return (
        <Projects showPopup={showPopup} setShowPopup={setShowPopup} />
    );
}
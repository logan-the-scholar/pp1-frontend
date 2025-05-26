import NavBar from "@/components/NavBar";
import ProjectsSection from "@/features/dashboard/ProjectsSection";

export default function Dashboard() {
    return (
        <>
            <div className="py-8 w-1 h-1">
                <NavBar />
            </div>

            <div className="w-full h-full overflow-hidden">
                <div className="w-full h-full relative">
                    <ProjectsSection />
                </div>
            </div>
        </>
    );
}
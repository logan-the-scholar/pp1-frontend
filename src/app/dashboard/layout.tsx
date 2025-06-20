"use client";
import NavBar from "@/components/NavBar";
import { BookMarked, Users, Wrench } from "lucide-react";
import { DashboardProvider } from "../../context/DashboardProvider";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex flex-col w-full h-[100vh]">
            <Provider store={store}>
                <DashboardProvider>
                    <div className="w-full h-10 flex bg-neutral-900">
                        <NavBar />
                    </div>

                    <div className="w-full overflow-hidden flex flex-1 bg-neutral-950">
                        <div className="h-full w-5 bg-[#1e1e1e] border-r border-neutral-600"></div>
                        <div className="h-full w-fit bg-neutral-900 border-r border-neutral-600 py-8">
                            <ul className="text-base [&>li]:items-center [&>li>svg]:mr-1.5 [&>li]:flex [&>li]:cursor-pointer [&>li]:hover:bg-[#1e1e1e] [&>li]:px-4 [&>li]:py-1">
                                <li className=""><BookMarked size={16} />Repositories</li>
                                <li><Users size={16} />Members</li>
                                <li><Wrench size={16} /> Settings</li>
                                <li></li>
                            </ul>
                        </div>
                        <div className="h-full bg-neutral-900 w-full relative">
                            {children}
                        </div>
                    </div>
                </DashboardProvider>
            </Provider>
        </div>
    );
}
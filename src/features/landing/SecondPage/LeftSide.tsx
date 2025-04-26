"use client";
import { jetBrainsMono } from "@/helpers/FontLoader";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const LeftSide: React.FC<{ leftAnim: boolean, hidePanelState: boolean, hidePanelTriggerer: Dispatch<SetStateAction<boolean>> }> = ({ leftAnim = false, hidePanelState, hidePanelTriggerer }) => {
    const [animateDesc, setAnimateDesc] = useState(false);

    useEffect(() => {

        let timeout: NodeJS.Timeout;

        const startAnimation = () => {
            setAnimateDesc(false);
            setTimeout(() => setAnimateDesc(true), 7500);

            timeout = setTimeout(startAnimation, 15000);
        };

        startAnimation();

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <>
            <div
                className={`top-[50%] absolute left-0 h-fit flex ease-in-out ${hidePanelState ? "animate-re-shrink-300" : "animate-shrink-300 cursor-default"}`}
            >
                <div
                    onClick={() => hidePanelTriggerer(false)}
                    className="border-l border-neutral-700 my-auto py-3 transition-colors duration-100 ease-in-out cursor-pointer hover:bg-[#52525256]"
                >
                    <ChevronRight width={60} height={60} />
                </div>
            </div>
            {/* //TODO TRANSItIONATize THIS ANIMATIONS 
*/}
            <div className="overflow-hidden relative not-md:w-fit md:max-w-[35%] md:w-[35%]">
                <div
                    className={`h-full relative ease-linear animate-direction-30/1 duration-1200 ${leftAnim ? "transition-rise-100" : "transition-re-rise-100"}`}
                >
                    <div
                        className={`absolute px-5 pb-6 flex gap-3 flex-col w-full h-full py-2 justify-center ease-linear -animate-direction-200/200 ${hidePanelState ? "animate-slide-1500/10" : "animate-re-slide-1500/200"}`}
                    >
                        <div className={`rounded-full bg-[#f59e0b85] absolute ease-in-out transition-opacity duration-1200 -z-10 size-36 bottom-3 left-6 -rotate-45 ${leftAnim ? "delay-1200 opacity-100" : "delay-10 opacity-0"}`}>
                            <div className="shadow-[-9px_6px_0px_#0a0a0a] rounded-full bg-[#7e22fe85] w-full h-full left-6 absolute"></div>
                        </div>
                        <h1 className={`${jetBrainsMono.className} text-3xl font-bold`}
                        >
                            Fast & easy to use online pair programming tool
                        </h1>

                        <ul className="min-h-max py-2 list-none">

                            <li className={`text-base font-normal absolute! mt-3 ease-linear animate-direction-50/50 ${animateDesc ? "animate-re-rise-100/1500" : "animate-rise-1500/1500"}`}>
                                Code together in a variety of programming languages—collaborate, create, and learn!
                            </li>

                            <li
                                className={`relative text-base mt-2 font-normal transition-all ease-linear animate-direction-50/50 ${!animateDesc ? "animate-re-rise-500/1500" : "animate-rise-1500/1500"}`}>
                                Try it! the perfect editor provided by{" "}
                                <a target="_blank" rel="noopener noreferrer" href="https://github.com/react-monaco-editor/react-monaco-editor" className="underline font-semibold cursor-pointer inline-flex">
                                    Monaco Editor
                                    <span><ExternalLink strokeWidth={2} /></span>
                                </a>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>

        </>
    );
};

export default LeftSide;
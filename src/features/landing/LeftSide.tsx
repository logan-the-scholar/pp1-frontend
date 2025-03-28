"use client";
import { jetBrainsMono } from "@/helpers/Fonts";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const LeftSide: React.FC<{ hidePanelState: boolean, hidePanelTriggerer: Dispatch<SetStateAction<boolean>> }> = ({ hidePanelState, hidePanelTriggerer }) => {
    const animateRef = useRef<HTMLDivElement | null>(null);
    const [animate, setAnimate] = useState<boolean>(false);
    const [animateDesc, setAnimateDesc] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const observer = new IntersectionObserver(([entry]) => {
            console.log(entry.isIntersecting);
            setAnimate(entry.isIntersecting);
        },
            { threshold: 0.5 }
        );

        if (animateRef.current) observer.observe(animateRef.current);

        const startAnimation = () => {
            setAnimateDesc(false);
            setTimeout(() => setAnimateDesc(true), 7500);

            timeout = setTimeout(startAnimation, 15000);
        };

        startAnimation();

        return () => {
            clearTimeout(timeout);
            observer.disconnect();
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

            <div ref={animateRef} className="overflow-hidden relative not-md:w-fit md:max-w-[40%] md:w-[40%]">

                <div className={`h-full absolute ease-linear animate-direction-50/50 ${!animate ? "animate-re-rise-100/800" : "animate-rise-100/800"}`}>
                    <div
                        className={`absolute px-5 flex gap-3 flex-col w-full h-8/10 py-2 justify-center ease-linear -animate-direction-200/200 ${hidePanelState ? "animate-slide-1500/10" : "animate-re-slide-1500/200"}`}
                    >
                        <h1 className={`${jetBrainsMono.className} text-3xl font-bold`}
                        >
                            Fast & easy to use online pair programming tool
                        </h1>

                        <ul className="min-h-max py-2 list-none">
                            <li className={`text-base font-normal absolute! mt-3 ease-linear animate-direction-50/50 ${animateDesc ? "animate-re-rise-100/1500" : "animate-rise-1500/1500"}`}>
                                Code together in a variety of programming languages—collaborate, create, and learn!
                                {/* <div className="text-base font-normal">
                                </div> */}
                            </li>

                            <li
                                // onAnimationStart={() => setTitleAnimation(false)}
                                // onAnimationEnd={() => setTitleAnimation(true)}
                                className={`relative text-base mt-2 font-normal transition-all ease-linear animate-direction-50/50 ${!animateDesc ? "animate-re-rise-500/1500" : "animate-rise-1500/1500"}`}>
                                Try it! the perfect editor provided by{" "}
                                <a target="_blank" rel="noopener noreferrer" href="https://github.com/react-monaco-editor/react-monaco-editor" className="underline font-semibold cursor-pointer inline-flex">
                                    Monaco Editor
                                    <span><ExternalLink strokeWidth={2} /></span>
                                </a>
                            </li>
                        </ul>

                        {/* <div className="mt-6 mb-8">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus, iusto repellendus praesentium labore aperiam odio facilis ad alias at quibusdam voluptatum similique consequuntur commodi harum inventore quisquam nemo ea sint!
                        </div> */}

                    </div>
                </div>
            </div>

        </>
    );
};

export default LeftSide;
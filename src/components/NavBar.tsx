"use client";
import React, { useEffect, useRef, useState } from 'react'
import { User } from 'lucide-react';
import { jetBrainsMono } from '@/helpers/Fonts';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserDropDown from './UserDropDown';

const NavBar: React.FC<{ title?: string, minimize?: boolean }> = ({ title = "CodeSaucer0.1", minimize = false }) => {
    const path = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const mouseOut = (event: MouseEvent) => {
            if (
                divRef.current &&
                event.target instanceof Node &&
                !divRef.current.contains(event.relatedTarget as Node)
            ) {
                timeoutRef.current = setTimeout(() => {
                    setIsDropdownOpen(false);
                }, 2000);
            }
        };

        const clickOut = (event: MouseEvent) => {
            if (divRef.current && !divRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        const mouseEnter = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };

        const element = divRef.current;

        if (element) {
            element.addEventListener("mouseout", mouseOut);
            element.addEventListener("mouseover", mouseEnter);
        }
        document.addEventListener("mousedown", clickOut);

        return () => {
            if (element) {
                element.removeEventListener("mouseout", mouseOut);
                element.removeEventListener("mouseover", mouseEnter);
            }
            document.removeEventListener("mousedown", clickOut);
        };
    }, []);

    return (
        <>
            <nav className={`mx-auto bg-neutral-950 text-neutral-300 w-[calc(100%-48px)] relative flex transition-all px-12 duration-700 ${minimize ? "h-[80%]" : "h-full"}`}>

                {/*
                 //TODO cambiar el color del icono (pasarlo a svg talvez) 
                 */}
                <div className="h-full top-0 left-0 not-md:invisible not-md:w-0.5 md:w-fit">
                    <div className={`pr-2 pb-2`}>
                        <img src="/40964.svg" alt="icon.png" className={`-rotate-45 transition-all duration-500 invert-100 ${minimize ? "w-6 h-6 opacity-0" : "w-15 h-15 opacity-100"}`} />
                    </div>
                </div>

                <h1 className='select-none font-bold italic max-w-fit text-4xl mt-auto -ml-2 mb-2 typing-effect mr-2'>
                    {title}
                    <span className='blinking-cursor'>_</span>
                </h1>

                <div className={`${jetBrainsMono.className} ml-auto px-3 w-[50%] pt-3 flex justify-between z-20 mr-2 not-md:size-0 not-md:invisible`}>

                    <button
                        className={`bracket mt-3 h-fit py-1 px-3 transition-opacity duration-700 ease-in-out ${minimize ? "opacity-0" : "opacity-100"}`}
                    >
                        {
                            path === "/" ? "Home" :
                                <Link className='h-full' href={"/"}>
                                    Try it
                                </Link>
                        }
                    </button>

                    <button
                        className={`mt-3 bracket h-fit py-1 px-3 transition-opacity duration-700 ease-in-out ${minimize ? "opacity-0" : "opacity-100"}`}
                    >
                        {
                            path === "nowhere" ? "About" :
                                <Link href={"/nowhere"}>
                                    Pricing
                                </Link>
                        }
                    </button>

                    <button
                        className={`mt-3 bracket h-fit py-1 px-3 transition-opacity duration-700 ease-in-out ${minimize ? "opacity-0" : "opacity-100"}`}
                    >
                        {
                            path === "nowhere" ? "sandbox" :
                                <Link href={"/nowhere"}>
                                    Support
                                </Link>
                        }
                    </button>

                    <div
                        ref={divRef}
                        onClick={(event) => {
                            event.stopPropagation();
                            setIsDropdownOpen(!isDropdownOpen);
                        }}
                        className={`-z-10 relative max-h-5/6 key-button bg-violet-800 rounded-xl transition-opacity duration-700 ease-in-out ${minimize ? "opacity-0" : "opacity-100"}`}>
                        <button
                            className='z-20 h-full box-border hover:-translate-y-[0.33em] transition-transform duration-200 hover:-translate-x-[0.2em] active:translate-0 bg-violet-600 border border-violet-950 py-2 px-3 -translate-y-[0.2em] -translate-x-[0.1em] inline-block cursor-pointer rounded-xl'
                        >
                            <User color="#ffffff" strokeWidth={3} />
                        </button>
                        {
                            <div
                                className={`relative transition-all ${isDropdownOpen ? "" : ""}`}
                            >
                                <UserDropDown />
                            </div>
                        }
                    </div>

                </div>
                <div className={`absolute z-40 m-auto w-[calc(100%-48px)] pr-12 h-px flex justify-center ${minimize ? "-bottom-[1px]" : "-bottom-[1px]"}`}>
                    <div className={`h-px transition-all duration-1000 bg-neutral-700 ${minimize ? "w-1/3" : "w-11/11"}`}></div>
                </div>
            </nav >
        </>
    );
};

export default NavBar;
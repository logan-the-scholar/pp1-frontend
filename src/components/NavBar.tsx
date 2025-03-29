"use client";
import React, { useEffect, useState } from 'react'
import NavButton from './NavButton';
import { User } from 'lucide-react';
import { jetBrainsMono } from '@/helpers/Fonts';
import CodedText from './CodedText';

const NavBar: React.FC = () => {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav className='w-full flex h-full'>

                {/* <div className={`h-full top-0 left-0 not-md:invisible not-md:w-0.5 ${isSticky ? "md:w-fit md:-mr-10" : "w-max"}`}>
                    <div
                        className=
                        {`relative rounded-b-full rounded-r-full pr-2 pb-2 border-[0px] border-neutral-100 bg-gradient-to-br from-[#fa9726] via-[#ca2f2d] to-[#cf207b] transition-all duration-200${isSticky ? " rotate-90 scale-[55%] -top-[41%] -left-[22%]" : " -top-px -left-px"}`}>
                        <img src="/a-space-rocket--white-outline.svg" alt="icon.png" className='w-30 h-30 -rotate-90' />
                    </div>
                </div> */}

                <div className="h-full top-0 left-0 not-md:invisible ml-2 not-md:w-0.5 md:w-fit">
                    <div className={`pr-2 pb-2`}>
                        <img src="/40964.svg" alt="icon.png" className='w-15 h-15 -rotate-45 invert-100' />
                    </div>
                </div>

                <h1 className='font-bold italic max-w-fit text-4xl mt-auto -ml-2 mb-2 typing-effect mr-2'>CodeSaucer0.1<span className='blinking-cursor'>_</span></h1>

                <div className={`${jetBrainsMono.className} ml-auto px-3 w-[50%] pt-3 flex justify-between z-20 mr-6 not-md:size-0 not-md:invisible`}>

                    <button
                        className='gradient-button coded-button'
                    >
                        <CodedText className='z-40' content='Home' />
                    </button>

                    <button
                        className='coded-button gradient-button'
                    >
                        <CodedText content='About' />
                    </button>

                    <button
                        className='coded-button gradient-button'
                    >
                        <CodedText content='Code session' />
                    </button>

                    <div className='-z-10 relative max-h-5/6 key-button bg-violet-800 rounded-xl'>
                        <button
                            className='z-20 h-full box-border hover:-translate-y-[0.33em] transition-transform duration-200 hover:-translate-x-[0.2em] active:translate-0 bg-violet-600 border border-violet-950 py-2 px-3 -translate-y-[0.2em] -translate-x-[0.1em] inline-block cursor-pointer rounded-xl'
                        >
                            <User color="#ffffff" strokeWidth={3} />
                        </button>
                    </div>

                </div>

                <div className='absolute z-40 -bottom-[1px] right-0 m-auto w-7/11 h-px bg-neutral-800'></div>
            </nav >
        </>
    );
};

export default NavBar;
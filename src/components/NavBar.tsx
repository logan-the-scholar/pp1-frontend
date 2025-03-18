"use client";
import React, { useEffect, useState } from 'react'
import NavButton from './NavButton';
import { BookOpen, Braces, Sparkles, User, UserPlus } from 'lucide-react';
import { jetBrainsMono } from '@/helpers/Fonts';
import CodedText from './CodedText';
//sunset gradient
//#fa9726 naranja
//#ca2f2d salmon
//#cf207b magenta

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
            <nav className='sticky top-0 z-40 w-full border-[0px] border-neutral-100 flex h-[70px] bg-transparent backdrop-blur-sm'>

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

                    <NavButton
                        /* background: linear-gradient(to top right, rgba(161, 161, 161, 0.8), transparent); */
                        // overwrite={true}
                        className='gradient-button coded-button'
                    // onHover={() => <Sparkles vectorEffect={"non-scaling-stroke"} className="absolute -top-3 -right-6 -rotate-30 shaky" color="#ffffff" />}
                    >
                        {/* <span className='hover:-translate-y-[0.33em] hover:-translate-x-[0.2em] active:translate-0 px-[1.2em] box-border block py-[0.6em] border bg-[#050505] border-neutral-400 rounded-[0.75em] -translate-y-[0.2em] -translate-x-[0.1em] transition-all duration-100 ease-in'>
                            Home
                        </span> */}
                        <CodedText className='z-40' content='Home' />
                    </NavButton>

                    <NavButton
                        className='coded-button gradient-button'
                    // onHover={() => <BookOpen vectorEffect={"non-scaling-stroke"} className='absolute -top-3 -left-6 -rotate-30 shaky text-neutral-50' stroke="currentColor" />}
                    >
                        <CodedText content='About' />
                    </NavButton>

                    <NavButton
                        className='coded-button gradient-button'
                    // onHover={() => <Braces vectorEffect={"non-scaling-stroke"} className='absolute -top-3 -left-6 -rotate-30 shaky' color="#ffffff" />}
                    >
                        {/* <span className='hover:-translate-y-[0.33em] hover:-translate-x-[0.2em] active:translate-0 px-[1.2em] box-border block py-[0.6em] border bg-[#050505] border-neutral-400 rounded-[0.75em] -translate-y-[0.2em] -translate-x-[0.1em] transition-all duration-100 ease-in'>
                            Code session
                        </span> */}
                        <CodedText content='Code session' />
                    </NavButton>

                    {/* TODO darle vida a esto... */}
                    <NavButton
                        overwrite={true}
                        className='relative hover:scale-110 transition-transform duration-200 bg-transparent outline-2 outline-offset-0 max-h-5/6 outline-solid py-2 px-3 inline-block cursor-pointer rounded-full'
                    >
                        <User color="#ffffff" strokeWidth={3} />
                    </NavButton>

                </div>

                <div className='absolute z-40 -bottom-[1px] right-0 m-auto w-7/11 h-px bg-neutral-800'></div>
            </nav >
        </>
    );
};

export default NavBar;
"use client";
import React, { useEffect, useState } from 'react'
import NavButton from './NavButton';
import { BookOpen, Braces, Sparkles, User, UserPlus } from 'lucide-react';
//sunset gradient
//#fa9726 naranja
//#ca2f2d salmon
//#cf207b magenta
//https://svgsilh.com/image/158234.html

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

        <nav className='sticky top-0 w-full border-[0px] rounded-s-4xl border-neutral-100 flex h-[70px] bg-transparent backdrop-blur-sm'>

            <div className={`h-full top-0 left-0 not-md:invisible${isSticky ? " w-fit -mr-10" : " w-max"}`}>
                <div
                    className=
                    {`relative bg-[#050505] rounded-b-full rounded-r-full pr-2 pb-2 border-[0px] border-neutral-100 bg-gradient-to-br from-[#fa9726] via-[#ca2f2d] to-[#cf207b] transition-all duration-200${isSticky ? " rotate-90 scale-[55%] -top-[41%] -left-[22%]" : " -top-px -left-px"}`}>
                    <img src="/a-space-rocket--white-outline.svg" alt="icon.png" className='w-30 h-30 -rotate-90' />
                </div>
            </div>
            <h1 className='font-bold italic text-4xl my-auto max-w-fit z-20 typing-effect ml-2'>CodeSpace0.1v<span className='blinking-cursor'>_</span></h1>

            <div className='ml-auto p-3 w-[50%] flex justify-between z-20 mr-6'>
                <NavButton
                    className='relative'
                    attributes={{
                        onHover: (() => <Sparkles className="absolute -top-3 -left-6 -rotate-30 shaky" color="#ffffff" />)
                    }}
                >
                    Home
                </NavButton>

                <NavButton
                    className='relative'
                    attributes={{
                        onHover: (() => <BookOpen className='absolute -top-3 -left-6 -rotate-30 shaky text-neutral-50' stroke="currentColor" />)
                    }}
                >
                    About
                </NavButton>
                <NavButton
                    className='relative'
                    attributes={{
                        onHover: (() => <Braces className='absolute -top-3 -left-6 -rotate-30 shaky' color="#ffffff" />)
                    }}
                >
                    Code session
                </NavButton>

                <NavButton
                    overwrite={true}
                    className='relative hover:scale-110 transition-transform duration-200 bg-[#050505] outline-2 outline-offset-0 max-h-5/6 outline-solid py-2 px-3 inline-block cursor-pointer rounded-full'
                // attributes={{
                //     onHover: (() => <UserPlus className='absolute -top-3 -left-6 -rotate-30 shaky' color="#ffffff" />) 
                // }}
                >
                    <User color="#ffffff" />
                </NavButton>

            </div>

            {/* <div className='absolute w-[25%] h-full right-0'>
                <div className='h-full w-full grid-rows-3 grid grid-cols-3 border-[0.25px] border-neutral-300 overflow-hidden gap-0'>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => {
                        return (<div key={x} className='border-[0.25px] border-inherit'></div>);
                    })}
                </div>

                <div className='absolute left-0 bottom-0 h-full w-[100%] grid-gradiant'></div>
            </div> */}
        </nav >

    );
};

export default NavBar;
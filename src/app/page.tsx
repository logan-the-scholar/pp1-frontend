"use client";
import NavBar from "@/components/NavBar"
import React, { useCallback, useEffect, useState } from "react";
import LeftSide from "@/features/landing/LeftSide";
import SquareCanvas from "@/features/landing/SquareCanvas";
import { jetBrainsMono } from "@/helpers/Fonts";
import RightSide from "@/features/landing/RightSide";

export default function Home() {
  const [scroll, setScroll] = useState<number>(0);
  const [jumpPage, setJumPage] = useState<number>(0);
  const [actualPage, setActualPage] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (window.scrollY > 0 && scroll < window.innerHeight && actualPage === 1) {
      console.log(window.innerHeight)
      scrollTo(2);
      setActualPage(2);
      // console.log(window.scroll);
      // console.log(scroll);
    }
    // else if(window.scrollY > window.innerHeight && scroll < window.innerHeight * 2 && actualPage === 2) {
    //   console.log(window.innerHeight)
    //   scrollTo(1);
    //   setActualPage(1);
    // }

  }, [scroll]);


  const scrollTo = (page: number) => {
    const element = document.getElementById("page-" + page);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <NavBar />
      <div id="page-1" className={`${jetBrainsMono.className} italic text-8xl font-extrabold select-none flex items-center w-full h-[90vh]`}>
        <div className="mr-6 ml-auto w-full h-fit grid gap-10">

          <div className="flex w-fit mr-8 justify-self-center">
            Share your {"{"}
            <div className="h-full w-fit z-20 flex">
              <div className="relative w-fit max-h-1 -mx-6">
                <SquareCanvas />
              </div>
              <span>{"}"}</span>
            </div>
          </div>

          <div className="justify-self-end z-30 mr-7 w-fit">
            <span className="underline">thoughts</span> instantly.
          </div>
        </div>
      </div>

      <div id="page-2" className="not-md:flex-col not-md:gap-y-5 flex mt-16 justify-evenly h-[100vh]">
        <LeftSide />
        <RightSide />
      </div>
    </>
  );
};
"use client";
import NavBar from "@/components/NavBar"
import React, { useCallback, useEffect, useState } from "react";
import LeftSide from "@/features/landing/LeftSide";
import SquareCanvas from "@/features/landing/SquareCanvas";
import { jetBrainsMono } from "@/helpers/Fonts";
import RightSide from "@/features/landing/RightSide";
import HelicalCanvas from "@/features/landing/HelicalTube";
import { Tv } from "lucide-react";

export default function Home() {
  const [scrollDirection, setScrollDirection] = useState("Estático");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidePanelState, setHidePanelState] = useState<boolean>(false);
  const [text, setText] = useState<string | undefined>(undefined);
  const [finished, setFinished] = useState<boolean>(false);
  const [button, setButton] = useState<boolean>(false);
  const [hide, setHide] = useState<boolean>(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {

    let timeout: NodeJS.Timeout;

    const startAnimation = () => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 1000);

      timeout = setTimeout(startAnimation, 10000);
    };

    startAnimation();

    return () => clearTimeout(timeout);

    // const handleScroll = () => {
    //   if (window.scrollY > lastScrollY) {
    //     setScrollDirection("⬇ Bajando");
    //     console.log("⬇ Bajando");
    //   } else if (window.scrollY < lastScrollY) {
    //     setScrollDirection("⬆ Subiendo");
    //     console.log("⬆ Subiendo");
    //   }
    //   setLastScrollY(window.scrollY);
    // };

    // window.addEventListener("scroll", handleScroll);
    // return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    console.log(finished);
  }, [finished]);

  return (
    <>
      <NavBar />
      <div className={`${jetBrainsMono.className} italic text-8xl font-extrabold select-none flex items-center w-full h-[90vh]`}>
        <div className="mr-6 ml-auto w-full h-fit grid gap-10">

          <div className="flex w-fit mr-8 justify-self-center">
            Share your {"{"}
            <div className="h-full w-fit z-20 flex">
              <div className="relative w-fit max-h-1 -mx-6">

                <div className={`relative w-fit h-fit ${animate ? "" : ""}`}>
                  <SquareCanvas text={text} />
                </div>

                <div className={`absolute ${!animate ? "" : ""}`}>
                  Code
                </div>

              </div>
              <span>{"}"}</span>
            </div>
          </div>

          <div className="justify-self-end z-30 mr-7 w-fit">
            <span className="underline">thoughts</span> instantly.
          </div>

          <div className="text-2xl font-normal not-italic mt-[5vw] ml-9 w-fit flex">Show them how you {`{code}`} in real time <Tv className="ml-4" strokeWidth={3} /></div>

        </div>
      </div>
      <div className="w-4/5 border-b border-neutral-800 mx-auto"></div>

      {/* <div className="left-0 relative w-full h-1">
        <button
          className="p-3 absolute text-black cursor-pointer bg-amber-400"
          onClick={() => setButton(!button)}
        >
          {button ? "stop" : "continue"}
        </button>

        <div className="w-full -top-[60lvh] left-0 h-[120lvh] absolute -z-20">
          <HelicalCanvas hide={hide} setFinished={setFinished} button={button} />
        </div>
      </div> */}

      <div id="page-2" className={`relative not-md:flex-col not-md:gap-y-5 flex h-[100vh] pt-[100px] ${hidePanelState ? "justify-center gap-5" : "justify-center gap-5"}`}>
        <LeftSide hidePanelState={hidePanelState} hidePanelTriggerer={setHidePanelState} />
        <RightSide textSetter={setText} hidePanelState={hidePanelState} hidePanelTriggerer={setHidePanelState} />
      </div>

    </>
  );
};
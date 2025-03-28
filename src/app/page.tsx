"use client";
import NavBar from "@/components/NavBar"
import React, { useEffect, useRef, useState } from "react";
import LeftSide from "@/features/landing/LeftSide";
import SquareCanvas from "@/features/landing/SquareCanvas";
import { jetBrainsMono } from "@/helpers/Fonts";
import RightSide from "@/features/landing/RightSide";
import HelicalCanvas from "@/features/landing/HelicalTube";
import { Tv } from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
  // const [scrollDirection, setScrollDirection] = useState("Estático");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidePanelState, setHidePanelState] = useState<boolean>(false);
  const [text, setText] = useState<string | undefined>(undefined);
  const [finished, setFinished] = useState<boolean>(false);
  const [button, setButton] = useState<boolean>(false);
  const [hide, setHide] = useState<boolean>(false);
  const [animateCube, setAnimateCube] = useState(false);
  const animateRef = useRef<HTMLDivElement | null>(null);
  const [motdAnimate, setMotdAnimate] = useState<boolean>(false);
  const [motdAnimationEnd, setMotdAnimationEnd] = useState<boolean>(false);
  const perspectiveRef = useRef<HTMLDivElement>(null);

  const motdtext = "Show them how you {code} in real time";

  useEffect(() => {

    let timeout: NodeJS.Timeout;

    const observer = new IntersectionObserver(([entry]) => {
      setMotdAnimate(entry.isIntersecting);
      console.log(entry.isIntersecting);
    }, { threshold: 0.7 });

    if (animateRef.current) {
      observer.observe(animateRef.current);
    }

    const startAnimation = () => {
      setAnimateCube(false);
      setTimeout(() => setAnimateCube(true), 10000);

      timeout = setTimeout(startAnimation, 20000);
    };

    startAnimation();

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    }
  }, []);


  useEffect(() => {

    const handleScroll = () => {
      setLastScrollY(window.scrollY);
      // if (window.scrollY > lastScrollY) {
      //   setScrollDirection("⬇ Bajando");
      //   console.log("⬇ Bajando", window.scrollY);

      // } else if (window.scrollY < lastScrollY) {
      //   setScrollDirection("⬆ Subiendo");
      //   console.log("⬆ Subiendo", window.scrollY);

      // }

    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

  }, [lastScrollY]);

  return (
    <>
      <div
        //style={{ transform: `translateY(-${lastScrollY > 200 ? (lastScrollY - 200) * 0.25 : 0}px)`}} 
        className={`z-40 top-0 w-full sticky h-[70px] ease-in-out transition-transform duration-75 bg-transparent backdrop-blur-sm`}>
        <NavBar />
      </div>

      <div className="px-4">
        <div ref={animateRef} className={`${jetBrainsMono.className} italic text-8xl font-extrabold select-none flex items-center w-full h-[90vh]`}>
          <div className="relative mr-6 ml-auto w-full h-fit grid gap-10">

            <div className="flex w-fit ml-24 ease-in-out relative transition-all duration-1000">
              Share your {"{"}
              <div className="h-full w-fit z-20 flex transition-all ease-in-out duration-1000">
                <div className="relative w-fit delay-1500 max-h-1 -mx-6 transition-all duration-500">

                  <div className={`transition-all top-0 left-0 duration-1000 w-fit h-fit ease-in-out -animate-direction-1000/1000 ${animateCube ? "animate-abduct-100/1000 absolute" : "animate-re-abduct-300/1000 relative"}`}>
                    <SquareCanvas text={text} />
                  </div>

                  <div className={`transition-all duration-1000 top-0 left-0 px-4 w-fit text-center ease-in-out -animate-direction-1000/1000 ${animateCube ? "animate-re-abduct-100/1000 relative" : "animate-abduct-300/1000 absolute"}`}>
                    Code
                  </div>

                </div>
                <span>
                  {"}"}
                </span>
              </div>
            </div>

            <div className="justify-self-end z-30 mr-7 w-fit">
              <span className="underline">thoughts</span> instantly.
            </div>

            <div
              className={`text-2xl relative font-normal not-italic ease-in-out animate-direction-50/50 mt-[5vw] ml-9 w-fit flex ${!motdAnimate && "animate-re-rise-500/200"}`}
            >
              {
                !motdAnimate ?
                  <>
                    <span className="relative">
                      {motdtext}
                    </span>
                    <Tv className="ml-4" strokeWidth={3} />
                  </>
                  :
                  <>
                    {motdtext.split("").map((x, i) => {
                      return (
                        <span
                          style={{
                            opacity: 0,
                            animation: "rise 200ms linear forwards",
                            animationDelay: `${500 + (i * 50)}ms`,
                            transformOrigin: "top",
                          }}
                          className={`${x === " " ? "opacity-0!" : ""} relative ease-in-out animate-direction-50/50 ${!motdAnimate && "animate-re-rise-500/200"}`}
                          key={`${x === " " ? "_" : x}${i}`}
                        >
                          {x === " " ? "_" : x}
                        </span>
                      );
                    })}

                    <Tv
                      onAnimationEnd={(x) => setMotdAnimationEnd(true)}
                      style={{
                        opacity: 0,
                        animation: "rise 200ms linear forwards",
                        animationDelay: `${500 + ((motdtext.length - 1) * 50)}ms`,
                        transformOrigin: "top",
                      }}
                      className="ml-4" strokeWidth={3}
                    />
                  </>

              }

            </div>

          </div>
        </div>
        <div className="w-4/5 pb-[40px] border-t border-neutral-800 mx-auto"></div>

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

        <div ref={perspectiveRef} className={`relative not-md:flex-col not-md:gap-y-5 flex h-[100vh] mb-auto pt-[40px] ${hidePanelState ? "justify-center gap-5" : "justify-center gap-5"}`}>
          <LeftSide hidePanelState={hidePanelState} hidePanelTriggerer={setHidePanelState} />
          <RightSide textSetter={setText} hidePanelState={hidePanelState} hidePanelTriggerer={setHidePanelState} />
        </div>

        <div id="page-3" className="h-[100vh] flex">
          <div className="mb-6 mt-auto mx-5 flex justify-around">
            <button className="mt-auto mb-7 self-center h-fit w-fit relative key-button bg-violet-800 rounded-[0.75em] cursor-pointer">
              <span className="inline-block box-border hover:-translate-y-[0.33em] mb-[2px] mr-[2px] border hover:-translate-x-[0.2em] active:translate-0 py-[0.6em] px-5 bg-violet-600 border-violet-950 rounded-[0.75em] -translate-y-[0.2em] -translate-x-[0.1em] transition-all duration-100 ease-in">
                Create Account
              </span>
            </button>
            <button className="mt-auto mb-7 self-center h-fit w-fit relative key-button bg-violet-800 rounded-[0.75em] cursor-pointer">
              <span className="inline-block box-border hover:-translate-y-[0.33em] mb-[2px] mr-[2px] border hover:-translate-x-[0.2em] active:translate-0 py-[0.6em] px-5 bg-violet-600 border-violet-950 rounded-[0.75em] -translate-y-[0.2em] -translate-x-[0.1em] transition-all duration-100 ease-in">
                Log In
              </span>
            </button>
          </div>
        </div>

        <Footer />

      </div>
    </>
  );
};
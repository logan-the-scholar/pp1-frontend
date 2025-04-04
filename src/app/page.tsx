"use client";
import NavBar from "@/components/NavBar"
import React, { useEffect, useRef, useState } from "react";
import LeftSide from "@/features/landing/SecondPage/LeftSide";
import SquareCanvas from "@/features/landing/SquareCanvas";
import { jetBrainsMono } from "@/helpers/Fonts";
import RightSide from "@/features/landing/SecondPage/RightSide";
import { Tv } from "lucide-react";
import Footer from "@/components/Footer";
import ThirdPage from "@/features/landing/ThirdPage";
import { Parallax } from "react-scroll-parallax";
import SecondPage from "@/features/landing/SecondPage/SecondPage";

export default function Home() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [text, setText] = useState<string | undefined>(undefined);
  const [animateCube, setAnimateCube] = useState(false);
  const animateRef = useRef<HTMLDivElement | null>(null);
  const [motdAnimate, setMotdAnimate] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [light, setLight] = useState<boolean>(false);
  const [scroll, setScroll] = useState<"up" | "down">("up");

  const L_MAX_TIMEOUT = 24000;
  const L_MIN_TIMEOUT = 12000;
  const L_FLASH = 100;
  const ABDUCT_CICLE = 20000;
  const motdtext = "Show them how you {code} in real time";


  useEffect(() => {

    let abduct_timeout: NodeJS.Timeout;
    let light_timeout: NodeJS.Timeout;

    const observer = new IntersectionObserver(([entry]) => {
      setMotdAnimate(entry.isIntersecting);

    }, { threshold: 0.7 });

    animateRef.current ? observer.observe(animateRef.current) : null;

    const abductAnimation = () => {
      setAnimateCube(false);
      setTimeout(() => setAnimateCube(true), ABDUCT_CICLE / 2);

      abduct_timeout = setTimeout(abductAnimation, ABDUCT_CICLE);
    };

    const lightAnimation = () => {
      setLight(true);
      setTimeout(() => setLight(false), L_FLASH);

      light_timeout = setTimeout(lightAnimation, Math.floor(Math.random() * (L_MAX_TIMEOUT - L_MIN_TIMEOUT + 1)) + L_MIN_TIMEOUT);
    };

    abductAnimation();
    lightAnimation();

    return () => {
      clearTimeout(abduct_timeout);
      clearTimeout(light_timeout);
      observer.disconnect();
    }
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setLastScrollY(window.scrollY);
    };

    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      setScroll("down");
      console.log("down");
    } else if (currentScrollY < lastScrollY) {
      setScroll("up");
      console.log("up");
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

  }, [lastScrollY]);


  return (
    <>
      {/* bg-transparent backdrop-grayscale-100 backdrop-blur-sm */}
      <div
        className={`z-40 top-0 bg-neutral-950 w-full sticky h-[70px] ease-in-out transition-transform duration-75 `}>
        <NavBar />
      </div>

      <div>
        <div ref={animateRef} className={`${jetBrainsMono.className} px-4 italic text-8xl font-extrabold select-none flex items-center w-full h-[90vh]`}>
          <div className="relative mr-6 ml-auto w-full h-fit grid gap-10">
            {/*  PARALLAX AQUI, EFECTO DE LUZ SAUCER Y DIVIDIR A COMPONENTE (TALVEZ) */}

            <div className="flex w-fit ml-24 ease-in-out relative transition-all duration-1000">
              Share your
              <div className="ml-18 h-full w-fit z-20 flex transition-all ease-in-out duration-1000">
                <div className="relative w-0.5 delay-1500 max-h-1 -mx-6 transition-all duration-500">

                  <div className={`absolute -top-[350px] -left-[120px] test ${!light ? "" : "opacity-0"}`}></div>

                  <div className={`transition-all top-0 left-0 duration-1000 w-fit h-fit ease-in-out -animate-direction-1000/1000 ${animateCube ? "animate-abduct-100/1000 absolute" : "animate-re-abduct-300/1000 relative"}`}>
                    <SquareCanvas text={text} />
                  </div>

                  <div className={`[text-shadow:_0_12px_0px_#0a0a0a] transition-all duration-1000 top-0 left-0 px-4 w-fit text-center ease-in-out -animate-direction-1000/1000 ${animateCube ? "animate-re-abduct-100/1000 relative" : "animate-abduct-300/1000 absolute"}`}>
                    Code
                  </div>

                </div>
              </div>
            </div>

            <div className="justify-self-end z-30 mr-7 w-fit">
              <span className="underline">thoughts</span> instantly.
            </div>

            <div
              className={`text-2xl relative font-normal not-italic ease-in-out animate-direction-50/50 mt-[5vw] ml-9 w-fit flex ${!motdAnimate && "animate-re-rise-500/200"}`}
            >
              {
                //TODO hacer esto despues de montaje
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
                            // transition: "opacity 200ms ease-out, transform 200ms ease-out",
                            animation: "rise 200ms linear forwards",
                            animationDelay: `${500 + (i * 50)}ms`
                          }}
                          className={`${x === " " ? "opacity-0!" : ""} relative ease-in-out animate-direction-50/50`}
                          key={`${x === " " ? "_" : x}${i}`}
                        >
                          {x === " " ? "_" : x}
                        </span>
                      );
                    })}

                    <Tv
                      ref={svgRef}
                      style={{
                        opacity: 0,
                        animation: "rise 200ms linear forwards",
                        animationDelay: `${500 + ((motdtext.length - 1) * 50)}ms`,
                        transformOrigin: "top"
                      }}
                      className="ml-4" strokeWidth={3}
                    />
                  </>
              }

            </div>

            <div className="before:w-full bg-neutral-950 before:h-full before:-z-10 before:border before:border-0 before:absolute before:-right-3 before:-bottom-3 right-0 bottom-0 absolute border border-0">
              {/* <div className="ml-auto text-base not-italic w-fit mr-1 bg-inherit">- x</div> */}
              {/* <div className="border-t font-normal border-0 text-center text-base not-italic">Are you ready?</div> */}
              <div className="py-3 flex text-base font-normal gap-3 px-8 bg-inherit">
                
                <button className="shadow-violet-700 h-12 key-sh-violet-900 key-bg-violet-700 key-button-[45deg] rounded-[8px] cursor-pointer">
                  <span className="hover:-translate-y-[0.33em] mb-[2px] mr-[2px] border hover:-translate-x-[0.2em] active:translate-0 py-[0.6em] px-5 bg-violet-600 border-violet-950 -translate-y-[0.2em] -translate-x-[0.1em] transition-all duration-100 ease-in">
                    Create Account
                  </span>
                </button>
                {/* shadow-[0_15px_30px_-12px] */}
                <button className="shadow-violet-700 h-12 key-sh-violet-900 key-bg-violet-700 key-button-[60deg] bg-violet-800 rounded-[8px] cursor-pointer">
                  <span className="hover:-translate-y-[0.33em] mb-[2px] mr-[2px] hover:-translate-x-[0.2em] active:translate-0 py-[0.6em] px-5 bg-violet-600 border border-violet-950 -translate-y-[0.2em] -translate-x-[0.1em] transition-all duration-100 ease-in">
                    Log In
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
        {/* <div className="w-4/5 pb-1 border-t border-neutral-800 mx-auto"></div> */}

        <SecondPage setText={setText} />

        {/* <ThirdPage /> */}

        {/* <div className="w-full p-10 bg-violet-700"></div> */}
        {/* <Footer /> */}

      </div>
    </>
  );
};
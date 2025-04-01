"use client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import { Parallax, ParallaxProvider } from "react-scroll-parallax";

const SecondPage: React.FC<{ setText: Dispatch<SetStateAction<string | undefined>> }> = ({ setText }) => {
    const [hidePanelState, setHidePanelState] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);
    const [opacity, setOpacity] = useState(0);
    const [scrollEl, setScrollElement] = useState<HTMLDivElement | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setScrollElement(ref.current);
    }, []);

    // useEffect(() => {
    //     const observer = new IntersectionObserver((entries) => {
    //         entries.forEach((entry) => {
    //             setOpacity(entry.isIntersecting ? 1 : 0);
    //         });
    //     }, { threshold: [0.34, 0.7] });

    //     const observer2 = new IntersectionObserver((entries) => {
    //         entries.forEach((entry) => {
    //             setOpacity(entry.isIntersecting ? 0.5 : 0);
    //         });
    //     }, { threshold: [0.1, 0.33] });

    //     if (divRef.current) {
    //         observer.observe(divRef.current);
    //         observer2.observe(divRef.current);
    //     }

    //     return () => {
    //         observer.disconnect();
    //         observer2.disconnect();
    //     };
    // }, []);

    const START = 0.15 // AQUI DEBE INICIAR EN 0
    const END = 0.85 // AQUI DEBE ESTAR EN 0
    const OP_OFFSET = 0.4; //de 0.4 a 0.6 = opacity = 1; PASAR ESTO A PORCENTAJES 40% 60%
    const AMP = (END - START) / 2;

    return (
        <Parallax
            onProgressChange={(progress) => {
                console.log("default: ", progress);
                console.log("fixed: ",
                    (progress <= OP_OFFSET ?
                        progress
                        :
                        progress > OP_OFFSET && progress < OP_OFFSET ?
                            0.5
                            :
                            0.5 - (progress - 0.5)
                    )
                );
                setOpacity(progress);
            }}
        >
            <div
                style={{ opacity }}
                // ref={scrollEl}
                className={`transition-opacity ease-out duration-800 relative not-md:flex-col not-md:gap-y-5 flex h-[100vh] mb-auto ${hidePanelState ? "justify-center gap-5" : "justify-center gap-5"}`}>
                <LeftSide hidePanelState={hidePanelState} hidePanelTriggerer={setHidePanelState} />
                <RightSide textSetter={setText} hidePanelState={hidePanelState} hidePanelTriggerer={setHidePanelState} />
            </div>
        </Parallax>
    );
};
export default SecondPage;
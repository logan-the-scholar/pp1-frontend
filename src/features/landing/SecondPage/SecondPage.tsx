"use client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import { Parallax, ParallaxProvider } from "react-scroll-parallax";

const SecondPage: React.FC<{ setText: Dispatch<SetStateAction<string | undefined>> }> = ({ setText }) => {
    const [hidePanelState, setHidePanelState] = useState<boolean>(false);
    // const [opacity, setOpacity] = useState(0);
    const [leftAnim, setLeftAnim] = useState<boolean>(false);
    const [rightAnim, setRightAnim] = useState<boolean>(false);

    // const START = 0.15 // AQUI DEBE INICIAR EN 0
    // const END = 0.85 // AQUI DEBE ESTAR EN 0
    // const OP_OFFSET = 0.4;
    // const AMP = (END - START) / 2; //MITAD DE START Y END //* 0.35
    // const OFFSET = AMP + START; //* 0.5
    //entrada 0.4
    //salida 0.1192411924119241  <-  0.8807588075880759

    // onProgressChange={(progress) => {
    //     const reClamped = (progress - START) / ((END - (OFFSET - OP_OFFSET)) - START);
    //     //* 0.23 - 0.15 = 0.08 / 0.7 = 0.11
    //     const fixed = (progress <= START || progress >= END || reClamped <= 0 ?
    //         0 // fuera de limite, arriba o abajo
    //         :
    //         reClamped < OP_OFFSET ?
    //             reClamped // mitad mas baja
    //             :
    //             reClamped > (1 - OP_OFFSET) ?
    //                 OP_OFFSET - (reClamped - (1 - OP_OFFSET)) // mitad mas alta
    //                 :
    //                 OP_OFFSET // intermedio
    //     )
    //     console.log(fixed, " <- ", reClamped, " <- ", progress);
    //     setOpacity(fixed * 3.4);
    // }}

    return (
        <Parallax
            onProgressChange={(progress) => {
                setRightAnim(progress >= 0.28);
                setLeftAnim(progress >= 0.32);
            }}
        >
            <div
                className={`pb-20 relative not-md:flex-col not-md:gap-y-5 flex h-[100vh] mb-auto justify-center gap-10`}
            >
                <LeftSide leftAnim={leftAnim} hidePanelState={hidePanelState} hidePanelTriggerer={setHidePanelState} />
                <RightSide rightAnim={rightAnim} textSetter={setText} hidePanelState={hidePanelState} hidePanelTriggerer={setHidePanelState} />
            </div>
        </Parallax >
    );
};
export default SecondPage;
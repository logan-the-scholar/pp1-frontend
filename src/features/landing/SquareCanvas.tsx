"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { CanvasTexture } from "three";

const SquareCanvas: React.FC = () => {
    const [text, setText] = useState("");

    return (
        <div className="w-[22lvw] h-[22lvw] overflow-visible relative -top-22">
            <div className="w-full h-full absolute">
                <Canvas gl={{ antialias: true }} camera={{
                    rotation: [-3.122030503361542, 0.2447202523201633, 3.1368524703838427],
                    position: [1.2282148810912677, 0.22800254116173175, -5.3079953542595515],
                    zoom: 1.9
                }}
                >
                    {/* <OrbitControls /> */}
                    {/* <CameraController /> */}

                    <ambientLight intensity={1.5} />
                    <directionalLight position={[3, 3, -3]} intensity={3} />
                    {/* <BigBoxx /> */}
                    <RotatingCube text={text || "ctx.fillText(text.slice((i * fiting_text_lenght) + (i === 0 ? 0 : 1),((i + 1) * fiting_text_lenght + 1) - (i > 0 ? 0 : 1)).trimStart(),(6 / 100) * canvas.width,first_roll + (font_he"} />
                </Canvas>
            </div >
            {/* <div className="w-full h-full absolute bg-transparent backdrop-blur-xs z-30">

            </div> */}
            {/* <div className="absolute -top-10 left-0 bg-amber-50 w-2/3">
                <input
                    className="w-full h-6 bg-amber-50 text-black"
                    type="text"
                    value={text}
                    onChange={(x) => setText(x.currentTarget.value)}
                />
            </div> */}
        </div>
    );
};
export default SquareCanvas;


const CameraController = () => {
    const { camera } = useThree();

    useFrame(() => {
        // camera.rotation.z += 0.2;
        // console.log(camera.rotation);
    });
    return null;
};


const RotatingCube: React.FC<{ text: string }> = ({ text }) => {
    const cubeRef = useRef<any>(null!);
    const [texture, setTexture] = useState<CanvasTexture | null>(null);
    const [refText, setRefText] = useState<string>("");

    useFrame(() => {
        if (text !== refText) {
            setRefText(text);

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d")!;
            canvas.width = 512;
            canvas.height = 512;

            ctx.fillStyle = "#171717";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "white";
            ctx.font = "40px Consolas";
            ctx.textBaseline = "middle";

            const text_measure = ctx.measureText(text);
            const writing_bound = canvas.width - Math.round(((6 / 100) * 2) * canvas.width);

            const font_height = text_measure.fontBoundingBoxAscent + text_measure.fontBoundingBoxDescent;
            const first_roll = ((6 / 100) * canvas.width) + font_height;
            const back_rolls = Math.round(text_measure.width / writing_bound);
            const fiting_text_lenght = Math.floor(writing_bound / ctx.measureText("o").width);

            for (let i = 0; i <= back_rolls; i++) {
                if (i == 0) {
                    console.log("writing_bound: ", writing_bound);
                    console.log("text_measure: ", text_measure.width);
                    console.log("char_width: ", ctx.measureText("o").width);
                    console.log("fiting_text_lenght", fiting_text_lenght);
                    // console.log("backrolls: ", Math.floor(text_measure.width / writing_bound));
                    console.log("raw_backrolls: ", text_measure.width / writing_bound);
                }

                //? aqui deberia traerme el ultimo indice al que se hizo corte, y usarlo en el siguiente dibujado de linea.
                //? extra: hacer que funcione con saltos de linea y tabuladores
                ctx.fillText(
                    text.slice(
                        (i * fiting_text_lenght) + (i === 0 ? 0 : 1),
                        (//text.at((i + 1) * fiting_text_lenght - 1)?.includes(" ") &&  ?
                            // text.lastIndexOf(" ", (i + 1) * fiting_text_lenght - 1)
                            // ((i + 1) * fiting_text_lenght) - 1
                            // nose()
                            // :
                            // sise()
                            (i + 1) * fiting_text_lenght + 1
                        ) - (i > 0 ? 0 : 1)
                    ).trimStart(),
                    (6 / 100) * canvas.width,
                    first_roll + (font_height * i)
                );
            }

            const newTexture = new CanvasTexture(canvas);
            newTexture.needsUpdate = true;

            setTexture(newTexture);
        }

        if (cubeRef.current) {
            cubeRef.current.rotation.x -= 0.001;
            cubeRef.current.rotation.y += 0.001;
        }
    });

    return (
        <mesh ref={cubeRef} >
            <boxGeometry args={[2.4, 2.4, 2.4]} scale={[4.0, 4.0, 4.0]} />
            {texture && <meshBasicMaterial map={texture} />}
        </mesh>
    );
};


const BigBoxx = () => {
    const cubeRef = useRef<any>(null!);

    useFrame(() => {
        if (cubeRef.current) {
            cubeRef.current.rotation.z += 0.001;
        }
    });

    return (
        <mesh ref={cubeRef} position={[0, 0, 16]} rotation={[0, 0, -5]}>
            <boxGeometry args={[13, 13, 66, 5, 5, 5]} />
            <meshStandardMaterial color="#171717" wireframe wireframeLinewidth={1} />
        </mesh>
    );
};
import { OrbitControls, Tube } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { BufferGeometry, CatmullRomCurve3, FrontSide, Material, MathUtils, Mesh, NormalBufferAttributes, Object3DEventMap, Quaternion, Vector3 } from "three/webgpu";

const HelicalTube: React.FC<{
    setFinished: Dispatch<SetStateAction<boolean>>,
    hide: boolean,
    button: boolean,
    turns: number,
    radius: number,
    tubeRadius: number,
    spacing: number
}> =
    ({ setFinished, hide = false, button = false, turns = 5, radius = 1, tubeRadius = 0.2, spacing = 2 }) => {
        const cubeRef = useRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap> | null>(null!);
        const cubeRef2 = useRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap> | null>(null!);
        const timeXref = useRef(0);

        const curve = useMemo(() => {
            const points = [];
            const step = 100;

            for (let i = 0; i <= step * turns; i++) {
                const angle = (i / step) * Math.PI * 2;
                const x = Math.cos(angle) * radius;
                const y = i * (spacing / step);
                const z = Math.sin(angle) * radius;
                points.push(new Vector3(x, y, z));

            }

            return new CatmullRomCurve3(points);

        }, [turns, radius, spacing]);

        const zAngle = -1.300;

        useEffect(() => {
            if (cubeRef.current && cubeRef2.current) {
                cubeRef.current.rotation.z += zAngle;
                cubeRef2.current.rotation.z += zAngle;
            }
        }, [zAngle]);

        const lastXref = useRef(5);
        const MIN = -3;
        const MAX = 5;
        //*8  /  2 =
        const AMPLITUDE = (MAX - MIN) / 2; //*4
        const OFFSET = MIN + AMPLITUDE;  //*1
        // * rango: 0,0024448 a 0,0154717 = 0,013026880815
        const MIN_ = 0.002044819185;// 0,002044819185;//0.002444819185 - 0.0004;
        const MAX_ = 0.0194717;// 0,0194717;//0.0154717 + 0.004;
        //*0,016626880815 / 2 =
        const AMPLITUDE_ = (MAX_ - MIN_) / 2; //*0,0107582595925    0,021516519185
        const OFFSET_ = AMPLITUDE_ + MIN_; //*0,0087134404075  
        const lastRYref = useRef(0.002444819185);

        useFrame(() => {

            const move = () => {

                if (!button && lastXref.current <= MIN + 0.01) {
                    setFinished(true);
                    return 0.002044819185;
                } else if (!button && lastXref.current >= MAX - 0.01) {
                    setFinished(true);
                    return 0.002044819185;
                }

                timeXref.current += 0.005;

                const sine = Math.sin(timeXref.current);
                lastXref.current = sine * AMPLITUDE + OFFSET;
                lastRYref.current = (sine * AMPLITUDE_ + OFFSET_) * (hide ? -1 : 1);

                if (cubeRef.current && cubeRef2.current) {
                    cubeRef.current.position.x = lastXref.current;
                    cubeRef2.current.position.x = lastXref.current;
                }
                return lastRYref.current;
            }

            const rotation = move();
            console.log(rotation);

            if (cubeRef.current && cubeRef2.current) {
                cubeRef.current.rotateOnAxis(new Vector3(0, 1, 0), rotation);
                cubeRef2.current.rotateOnAxis(new Vector3(0, 1, 0), rotation);
            }

        });

        return (
            <>
                <Tube ref={cubeRef} args={[curve, 150, tubeRadius, 8, false]}>
                    <meshBasicMaterial color="#404040" wireframe={true} />
                </Tube>
                <Tube ref={cubeRef2} args={[curve, 150, tubeRadius - 0.01, 8, false]}>
                    <meshBasicMaterial color="#171717" />
                </Tube>
            </>
        );
    };

const HelicalCanvas: React.FC<{ setFinished: Dispatch<SetStateAction<boolean>>; button: boolean; hide: boolean }> = ({ setFinished, button, hide = false }) => {
    const [turns, setTurns] = useState(7);
    const [radius, setRadius] = useState(1);
    const [tubeRadius, setTubeRadius] = useState(0.4);
    const [spacing, setSpacing] = useState(4);

    return (
        <>
            <Canvas camera={{
                rotation: [-3.122030503361542, 0.6447202523201633, -6.1368524703838427],
                position: [4.2282148810912677, 1.08800254116173175, -7.7079953542595515],
                zoom: 1.9
            }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <HelicalTube hide={hide} setFinished={setFinished} button={button} turns={turns} radius={radius} tubeRadius={tubeRadius} spacing={spacing} />
                {/* <OrbitControls /> */}
            </Canvas>
        </>
    );
};

export default HelicalCanvas;
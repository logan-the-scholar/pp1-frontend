import { OrbitControls, Tube } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { CatmullRomCurve3, FrontSide, Vector3 } from "three/webgpu";

const HelicalTube = ({ turns = 5, radius = 1, tubeRadius = 0.2, spacing = 2 }) => {
    const cubeRef = useRef<any>(null!);
    const cubeRef2 = useRef<any>(null!);

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

    useFrame(() => {
        if (cubeRef.current) {
            cubeRef.current.rotation.y += 0.001;
            cubeRef2.current.rotation.y += 0.001;
        }
    });

    return (
        <>
            <Tube ref={cubeRef} args={[curve, 150, tubeRadius, 8, false]}>
                <meshBasicMaterial color="white" wireframe={true} />
            </Tube>
            <Tube ref={cubeRef2} args={[curve, 150, tubeRadius - 0.01, 8, false]}>
                <meshBasicMaterial color="#171717" />
            </Tube>
        </>
    );
};

const HelicalCanvas = () => {
    const [turns, setTurns] = useState(5);
    const [radius, setRadius] = useState(1);
    const [tubeRadius, setTubeRadius] = useState(0.4);
    const [spacing, setSpacing] = useState(4);

    return (
        <>
            <Canvas camera={{
                rotation: [-3.122030503361542, 0.2447202523201633, -6.1368524703838427],
                position: [1.2282148810912677, 3.22800254116173175, -5.3079953542595515],
                zoom: 1.9
            }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <HelicalTube turns={turns} radius={radius} tubeRadius={tubeRadius} spacing={spacing} />
                {/* <OrbitControls /> */}
            </Canvas>
        </>
    );
};

export default HelicalCanvas;
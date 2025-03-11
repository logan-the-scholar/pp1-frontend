"use client";
import NavBar from "@/components/NavBar"
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import React from "react";
import * as THREE from 'three';

export default function Home() {

  return (
    <>
      <NavBar />
      <div className="absolute -z-20 inset-0">
        <Canvas camera={{ position: [0, 0, -5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <RotatingCube />
          <OrbitControls />
          <BigBoxx />
          {/* <Number /> */}
          {/* <mesh position={[-3.4, -3, 0]} scale={[0.1, 0.1, 0.1]} rotation={[Math.PI / 10, 0, 0]}>
            <torusKnotGeometry args={[10, 3, 23, 5]} />
            <meshStandardMaterial color="white" wireframe />
          </mesh> */}
          {/* <mesh position={[2.4, 1.3, 0]} rotation={[Math.PI / 0.3, 4, 0]}>
            <tetrahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial color="magenta" wireframe wireframeLinewidth={1} />
          </mesh> */}
        </Canvas>
      </div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
      <div>landing</div>
    </>
  );
}

const RotatingCube = () => {
  const cubeRef = useRef<any>(null!);

  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x -= 0.001;
      cubeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[2.4, 2.4, 2.4]} scale={[4.0, 4.0, 4.0]} />
      <meshStandardMaterial color="gray" wireframe wireframeLinewidth={2} />
    </mesh>
  );
};

const BigBoxx = () => {
  const cubeRef = useRef<any>(null!);

  useFrame(() => {
    if (cubeRef.current) {
      // cubeRef.current.rotation.x -= 0.001;
      cubeRef.current.rotation.z += 0.001;
    }
  });

  return (
    <mesh ref={cubeRef} position={[0, 0, 6]} rotation={[0, 0, -5]}>
      <boxGeometry args={[13, 13, 33, 5, 5, 5]} />
      <meshStandardMaterial color="gray" wireframe wireframeLinewidth={1} />
    </mesh>
  );
};

const Number = () => {
  const cubeRef = useRef<any>(null!);

  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={cubeRef} visible userData={{ hello: 'world' }} position={[0, 0, 0]} rotation={[Math.PI / 1, 0, 0]}>
      {/* <sphereGeometry args={[1, 6, 6]} /> */}
      <octahedronGeometry args={[1, 2]} />
      <meshStandardMaterial color="gray" wireframe wireframeLinewidth={2} />
    </mesh>
  );
};
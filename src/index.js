import ReactDOM from 'react-dom'
import { useState, useRef } from 'react';
import { Canvas, useThree } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { CubeCamera, Environment, OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Suspense } from "react";

import {
  CubeTextureLoader,
  Vector3,
} from "three";

import { FlyControls, PerspectiveCamera } from '@react-three/drei';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { useFrame } from '@react-three/fiber';


function SkyBox() {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
  const texture = loader.load([
    "./space.jpg",
    "./space.jpg",
    "./space.jpg",
    "./space.jpg",
    "./space.jpg",
    "./space.jpg",
  ]);

  // Set the scene background property to the resulting texture.
  scene.background = texture;
  return null;
}


const Scene = () => {
  const gltf = useLoader(GLTFLoader, "./scene.gltf");

  return <primitive object={gltf.scene} scale={8} />;
};
const dummy = new Vector3()

const Ship = () => {

  const rot = useRef()

  //useFrame((state, delta) => (rot.current.rotation.y += 0.01))

  const [active, setActive] = useState(false);

  const fbx = useLoader(FBXLoader, "./X-Wing.fbx");

  //Math.sin(clock.elapsedTime) 
  useFrame((state) => {
    rot.current.position.z -= 0.015;
    
    state.camera.position.lerp(dummy.set(0,0,0), 0.001)
  })

  const { viewport } = useThree()


 

  return (
      <mesh
        ref={rot}
        scale={active ? 1.5 : 1}
        onClick={() => setActive(!active)}
        position={[0, 0, 15]}
        rotation={[0, Math.PI, 0]}
      >
        <primitive object={fbx} scale={0.0005} />
      </mesh>
  );
};

let prevX = 0;
let prevY = 0;

function Dodecahedron() {
  const { viewport } = useThree()
  // viewport = canvas in 3d units (meters)

  const ref = useRef()

  
  useFrame(({ mouse }) => {
    const x = (mouse.x * viewport.width) / 100;
    const y = (mouse.y * viewport.height) / 100;
    // Besides testing, how am I supposed to know which positional argument is position vs point?
    ref.current.position.set(x, y, 0)
    ref.current.rotation.set(y, -x, 0)
  })


  return (
    <mesh ref={ref}>
      <Ship />
    </mesh>
  )
}


function App() {
  let starGeo;


  return (
    <div style={{ height: '100vh' }}>
      <Canvas camera={{ fov: 75, position: [0, 0, 16]}}>
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} />
        <Suspense fallback={null}>

          <Scene />

          <SkyBox />

          <Dodecahedron />
        </Suspense>
      </Canvas>
    </div >
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
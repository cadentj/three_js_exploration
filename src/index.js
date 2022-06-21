import ReactDOM from 'react-dom'
import { useRef, Suspense } from 'react';
import { Canvas, useThree, useLoader, useFrame } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CubeTextureLoader, Vector3 } from "three";

function SkyBox() {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
  const texture = loader.load([
    "./square.png",
    "./square.png",
    "./square.png",
    "./square.png",
    "./square.png",
    "./square.png",
  ]);

  // Set the scene background property to the resulting texture.
  scene.background = texture;
  return null;
}

const Planets = () => {
  const gltf = useLoader(GLTFLoader, "./scene.gltf");

  const ref = useRef();
  useFrame((state) => (ref.current.rotation.y += 0.01));


  const planetMesh = <mesh
    ref={ref}
    position={[10, 0, 10]}
  >
    <primitive object={gltf.scene} position={[-5, 0, 12.5]} scale={8} />
  </mesh>;




  return planetMesh;
};



const dummy = new Vector3()

const Milky = () => {
  const gltf = useLoader(GLTFLoader, "./need_some_space/scene.gltf");

  const ref = useRef();
  useFrame((state) => (ref.current.rotation.y += 0.005));

  return <mesh
    ref={ref}
  >
    <primitive object={gltf.scene} position={[-2140, -2140, 2130]} scale={1500} />
  </mesh>;
};

const Ship = () => {

  const ref = useRef()


  const fbx = useLoader(FBXLoader, "./X-Wing.fbx");

  useFrame((state) => {
    //ref.current.position.z -= 0.013;

    //state.camera.position.lerp(dummy.set(0, 0, 0), 0.001)
  })

  return (
    <mesh
      ref={ref}
      position={[0, 2, 15]}
      rotation={[0, Math.PI, 0]}
    >
      <primitive object={fbx} scale={0.0005} />
    </mesh>
  );
};

let x = 0;
let y = 0;

const MouseTrackingShip = () => {

  const { viewport } = useThree()
  const ref = useRef()

  useFrame((state) => {
    const mouse = state.mouse;
    const xChange = (mouse.x * viewport.width) / 10000;
    const yChange = (mouse.y * viewport.width) / 10000;
    x += (x < 0.25 && x > -0.25) ? xChange : ((x >= 0) ? -0.0002 : 0.0002);
    y += (y < 0.10 && y > -0.20) ? yChange : ((y >= 0) ? -0.0002 : 0.0002);
    // Besides testing, how am I supposed to know which positional argument is position vs point?
    ref.current.rotation.set(-y, x, 0)
  })

  return (
    <mesh ref={ref}>
      <Ship />
    </mesh>
  )
}


function App() {
  return (
    <div style={{ height: '100vh' }}>
      <Canvas camera={{ fov: 70, position: [0, 2, 18] }}>

        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} />

        <Suspense fallback={null}>
          <MouseTrackingShip />
          <OrbitControls />
          <SkyBox />
          <Planets />

          <Milky />

        </Suspense>
      </Canvas>
    </div >
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
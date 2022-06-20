import ReactDOM from 'react-dom'
import { useRef, Suspense } from 'react';
import { Canvas, useThree, useLoader, useFrame } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CubeTextureLoader, Vector3, } from "three";

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

const Planets = () => {
  const gltf = useLoader(GLTFLoader, "./scene.gltf");

  return <primitive object={gltf.scene} scale={8} />;
};
const dummy = new Vector3()


const Ship = () => {

  const ref = useRef()


  const fbx = useLoader(FBXLoader, "./X-Wing.fbx");

  useFrame((state) => {
    ref.current.position.z -= 0.013;

    state.camera.position.lerp(dummy.set(0, 0, 0), 0.001)
  })
  
  return (
    <mesh
      ref={ref}
      position={[0, 0, 15]}
      rotation={[0, Math.PI, 0]}
    >
      <primitive object={fbx} scale={0.0005} />
    </mesh>
  );
};

const MouseTrackingShip = () => {

  const { viewport } = useThree()
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
  return (
    <div style={{ height: '100vh' }}>
      <Canvas camera={{ fov: 70, position: [0, 0, 16] }}>

        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} />

        <Suspense fallback={null}>

          <Planets />
          <SkyBox />

          <MouseTrackingShip />
        </Suspense>
      </Canvas>
    </div >
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
import React, { useState, useEffect, useRef } from 'react';
import QrScanner from 'react-qr-scanner';
import { Canvas, extend, useThree, useFrame } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

extend({ OrbitControls });

function Model({ gltf }) {
  return <primitive object={gltf.scene} />;
}

function Controls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useFrame(() => controlsRef.current.update());

  return <orbitControls ref={controlsRef} args={[camera, gl.domElement]} />;
}

function App() {
  const [result, setResult] = useState('');
  const [gltf, setGltf] = useState(null);
  const loader = useRef(new GLTFLoader());

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  useEffect(() => {
    if (result) {
      loader.current.load('/Astronaut.glb', setGltf, undefined, console.error);
    }
  }, [result]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {!result ? (
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      ) : (
        <Canvas style={{ width: '800px', height: '600px' }} backgroundColor="lightblue">
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          {gltf && <Model gltf={gltf} />}
          <Controls />
        </Canvas>
      )}
    </div>
  );
}

export default App;

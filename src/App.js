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

  const [setIsFrontCamera] = useState(false);

  const handleCameraChange = () => {
    setIsFrontCamera((prev) => !prev);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {!result ? (
        <div>
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
            
          />
              <button
            onClick={handleCameraChange}
            style={{
              backgroundColor: 'grey',
              color: 'white',
              borderRadius: '100%',
              border: 'none',
              cursor: 'pointer',
              width: '50px',
              height: '50px'
            }}
          >
            ...
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <Canvas style={{ width: '800px', height: '600px' }}>
            <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Controls/>
            {gltf && <Model gltf={gltf} />}
          </Canvas>
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'white',
              padding: '10px',
              borderRadius: '5px',
              fontWeight: 'bold',
            }}
          >
            {result.text}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
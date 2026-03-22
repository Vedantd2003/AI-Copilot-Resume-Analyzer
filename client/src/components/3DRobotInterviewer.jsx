import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Torus, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Smooth Robot Head Component with Smile
const RobotHead = ({ position, isSpeaking, isWaving }) => {
  const headRef = useRef();
  const eyeLeftRef = useRef();
  const eyeRightRef = useRef();
  const smileRef = useRef();
  const antennaRef = useRef();
  const mouthRef = useRef();
  const [blink, setBlink] = useState(false);

  // Blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Speaking and idle animations
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Gentle head movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.3) * 0.05;
      headRef.current.rotation.x = Math.sin(time * 0.2) * 0.02;
    }
    
    // Eye tracking with smooth movement
    if (eyeLeftRef.current && eyeRightRef.current) {
      const eyeX = Math.sin(time * 0.4) * 0.03;
      const eyeY = Math.sin(time * 0.3) * 0.02;
      eyeLeftRef.current.position.x = eyeX;
      eyeLeftRef.current.position.y = eyeY;
      eyeRightRef.current.position.x = eyeX;
      eyeRightRef.current.position.y = eyeY;
    }
    
    // Speaking animation - smooth mouth movement
    if (isSpeaking && mouthRef.current) {
      const scale = 1 + Math.sin(time * 12) * 0.15;
      mouthRef.current.scale.y = scale;
      mouthRef.current.scale.x = scale;
    }
    
    // Gentle antenna glow
    if (antennaRef.current) {
      const glow = 0.8 + Math.sin(time * 2) * 0.2;
      antennaRef.current.material.emissiveIntensity = glow;
    }
  });

  return (
    <group position={position} ref={headRef}>
      {/* Main Head - Smooth rounded shape */}
      <RoundedBox args={[1.6, 1.8, 1.4]} radius={0.3} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#6366f1" 
          metalness={0.4} 
          roughness={0.2}
          emissive="#6366f1"
          emissiveIntensity={0.1}
        />
      </RoundedBox>
      
      {/* Face Plate - Smooth */}
      <RoundedBox args={[1.4, 1.6, 1.3]} radius={0.2} position={[0, 0, 0.71]}>
        <meshStandardMaterial 
          color="#4f46e5" 
          metalness={0.6} 
          roughness={0.15}
          emissive="#4f46e5"
          emissiveIntensity={0.05}
        />
      </RoundedBox>
      
      {/* Eyes - Larger and more expressive */}
      <Sphere args={[0.18, 32, 32]} position={[-0.35, 0.15, 0.71]} ref={eyeLeftRef}>
        <meshStandardMaterial 
          color={blink ? "#4f46e5" : "#60a5fa"} 
          emissive={blink ? "#000000" : "#60a5fa"}
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.1}
        />
      </Sphere>
      <Sphere args={[0.18, 32, 32]} position={[0.35, 0.15, 0.71]} ref={eyeRightRef}>
        <meshStandardMaterial 
          color={blink ? "#4f46e5" : "#60a5fa"}
          emissive={blink ? "#000000" : "#60a5fa"}
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.1}
        />
      </Sphere>
      
      {/* Friendly Smile */}
      <Torus args={[0.3, 0.08, 16, 32]} position={[0, -0.25, 0.72]} rotation={[0, 0, Math.PI]} ref={smileRef}>
        <meshStandardMaterial 
          color="#f59e0b" 
          emissive="#f59e0b"
          emissiveIntensity={0.4}
          metalness={0.2}
          roughness={0.3}
        />
      </Torus>
      
      {/* Speaking Mouth */}
      <Sphere args={[0.12, 16, 16]} position={[0, -0.25, 0.72]} ref={mouthRef}>
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#10b981"
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.2}
        />
      </Sphere>
      
      {/* Sleek Antenna */}
      <Cylinder args={[0.06, 0.06, 0.9]} position={[0, 1.2, 0]}>
        <meshStandardMaterial 
          color="#8b5cf6" 
          metalness={0.7} 
          roughness={0.1}
        />
      </Cylinder>
      <Sphere args={[0.15, 16, 16]} position={[0, 1.65, 0]} ref={antennaRef}>
        <meshStandardMaterial 
          color="#ec4899" 
          emissive="#ec4899"
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.2}
        />
      </Sphere>
    </group>
  );
};

// Smooth Robot Body Component
const RobotBody = ({ position }) => {
  return (
    <group position={position}>
      {/* Torso - Smooth rounded */}
      <RoundedBox args={[2.2, 2.6, 1.7]} radius={0.3} position={[0, -1.5, 0]}>
        <meshStandardMaterial 
          color="#6366f1" 
          metalness={0.5} 
          roughness={0.2}
          emissive="#6366f1"
          emissiveIntensity={0.05}
        />
      </RoundedBox>
      
      {/* Chest Panel */}
      <RoundedBox args={[1.7, 2.0, 1.6]} radius={0.2} position={[0, -1.5, 0.86]}>
        <meshStandardMaterial 
          color="#4f46e5" 
          metalness={0.7} 
          roughness={0.15}
          emissive="#4f46e5"
          emissiveIntensity={0.03}
        />
      </RoundedBox>
      
      {/* Control Panel */}
      <RoundedBox args={[1.4, 0.9, 1.5]} radius={0.15} position={[0, -1.2, 0.87]}>
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.8} 
          roughness={0.1}
          emissive="#1e293b"
          emissiveIntensity={0.02}
        />
      </RoundedBox>
      
      {/* LED Lights - More vibrant */}
      <Sphere args={[0.1, 16, 16]} position={[-0.35, -1.2, 0.88]}>
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#10b981"
          emissiveIntensity={1.0}
          metalness={0.4}
          roughness={0.2}
        />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[0, -1.2, 0.88]}>
        <meshStandardMaterial 
          color="#3b82f6" 
          emissive="#3b82f6"
          emissiveIntensity={1.0}
          metalness={0.4}
          roughness={0.2}
        />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[0.35, -1.2, 0.88]}>
        <meshStandardMaterial 
          color="#f59e0b" 
          emissive="#f59e0b"
          emissiveIntensity={1.0}
          metalness={0.4}
          roughness={0.2}
        />
      </Sphere>
    </group>
  );
};

// Improved Robot Arms with better hands
const RobotArms = ({ position, isWaving }) => {
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftHandRef = useRef();
  const rightHandRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Gentle idle movement for left arm
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
    }
    
    // Waving animation for right arm - more natural
    if (isWaving && rightArmRef.current) {
      rightArmRef.current.rotation.z = Math.sin(time * 6) * 0.8 - 0.8;
      if (rightHandRef.current) {
        rightHandRef.current.rotation.z = Math.sin(time * 6) * 0.3;
      }
    } else if (rightArmRef.current) {
      // Gentle idle movement
      rightArmRef.current.rotation.z = Math.sin(time * 0.4) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Left Arm */}
      <group ref={leftArmRef}>
        <Cylinder args={[0.18, 0.18, 1.3]} position={[-1.4, -1.5, 0]}>
          <meshStandardMaterial 
            color="#6366f1" 
            metalness={0.4} 
            roughness={0.2}
            emissive="#6366f1"
            emissiveIntensity={0.03}
          />
        </Cylinder>
        {/* Left Hand */}
        <Sphere args={[0.22, 16, 16]} position={[-1.4, -2.2, 0]} ref={leftHandRef}>
          <meshStandardMaterial 
            color="#8b5cf6" 
            metalness={0.5} 
            roughness={0.3}
            emissive="#8b5cf6"
            emissiveIntensity={0.1}
          />
        </Sphere>
        {/* Fingers */}
        <Sphere args={[0.08, 8, 8]} position={[-1.6, -2.3, 0]}>
          <meshStandardMaterial color="#8b5cf6" metalness={0.4} roughness={0.3} />
        </Sphere>
        <Sphere args={[0.08, 8, 8]} position={[-1.5, -2.35, 0]}>
          <meshStandardMaterial color="#8b5cf6" metalness={0.4} roughness={0.3} />
        </Sphere>
        <Sphere args={[0.08, 8, 8]} position={[-1.4, -2.35, 0]}>
          <meshStandardMaterial color="#8b5cf6" metalness={0.4} roughness={0.3} />
        </Sphere>
      </group>
      
      {/* Right Arm (waving) */}
      <group ref={rightArmRef} position={[1.4, -1.5, 0]}>
        <Cylinder args={[0.18, 0.18, 1.3]} position={[0, 0, 0]} rotation={[0, 0, -0.3]}>
          <meshStandardMaterial 
            color="#6366f1" 
            metalness={0.4} 
            roughness={0.2}
            emissive="#6366f1"
            emissiveIntensity={0.03}
          />
        </Cylinder>
        {/* Right Hand */}
        <Sphere args={[0.22, 16, 16]} position={[0.3, -0.8, 0]} ref={rightHandRef}>
          <meshStandardMaterial 
            color="#8b5cf6" 
            metalness={0.5} 
            roughness={0.3}
            emissive="#8b5cf6"
            emissiveIntensity={0.1}
          />
        </Sphere>
        {/* Fingers */}
        <Sphere args={[0.08, 8, 8]} position={[0.5, -0.9, 0]}>
          <meshStandardMaterial color="#8b5cf6" metalness={0.4} roughness={0.3} />
        </Sphere>
        <Sphere args={[0.08, 8, 8]} position={[0.4, -0.95, 0]}>
          <meshStandardMaterial color="#8b5cf6" metalness={0.4} roughness={0.3} />
        </Sphere>
        <Sphere args={[0.08, 8, 8]} position={[0.3, -0.95, 0]}>
          <meshStandardMaterial color="#8b5cf6" metalness={0.4} roughness={0.3} />
        </Sphere>
      </group>
    </group>
  );
};

// Enhanced Robot Base with hover effect
const RobotBase = ({ position }) => {
  const baseRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Gentle hover animation
    if (baseRef.current) {
      baseRef.current.position.y = Math.sin(time * 2) * 0.05;
    }
    
    // Rotating ring
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group position={position} ref={baseRef}>
      {/* Main Base */}
      <Cylinder args={[1.7, 2.0, 0.9]} position={[0, -3.5, 0]}>
        <meshStandardMaterial 
          color="#4f46e5" 
          metalness={0.8} 
          roughness={0.15}
          emissive="#4f46e5"
          emissiveIntensity={0.05}
        />
      </Cylinder>
      
      {/* Hover Effect Ring - Animated */}
      <Torus args={[2.1, 0.12, 16, 32]} position={[0, -3.0, 0]} rotation={[Math.PI / 2, 0, 0]} ref={ringRef}>
        <meshStandardMaterial 
          color="#3b82f6" 
          emissive="#3b82f6"
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </Torus>
      
      {/* Enhanced Wheels */}
      <Cylinder args={[0.35, 0.35, 0.25]} position={[-0.9, -3.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#1e293b"
          emissiveIntensity={0.02}
        />
      </Cylinder>
      <Cylinder args={[0.35, 0.35, 0.25]} position={[0.9, -3.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#1e293b"
          emissiveIntensity={0.02}
        />
      </Cylinder>
    </group>
  );
};

// Complete Enhanced Robot
const Robot = ({ isSpeaking, isWaving }) => {
  return (
    <group position={[0, 2, 0]}>
      <RobotHead position={[0, 0, 0]} isSpeaking={isSpeaking} isWaving={isWaving} />
      <RobotBody position={[0, 0, 0]} />
      <RobotArms position={[0, 0, 0]} isWaving={isWaving} />
      <RobotBase position={[0, 0, 0]} />
    </group>
  );
};

// Enhanced Virtual Interview Room
const InterviewRoom = ({ children }) => {
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[0, 0, -8]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      
      {/* Side Walls */}
      <mesh position={[-10, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[10, 0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 7.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 5]} intensity={1.2} castShadow color="#60a5fa" />
      <pointLight position={[-5, 3, -5]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[5, 3, -5]} intensity={0.8} color="#10b981" />
      <pointLight position={[0, 2, 0]} intensity={0.3} color="#f59e0b" />
      
      {/* Interview Table */}
      <RoundedBox args={[4.2, 0.15, 2.2]} position={[0, -1, 2]} radius={0.1} castShadow receiveShadow>
        <meshStandardMaterial 
          color="#475569" 
          metalness={0.4} 
          roughness={0.3}
        />
      </RoundedBox>
      
      {/* Table Legs */}
      <Cylinder args={[0.12, 0.12, 1]} position={[-1.9, -1.5, 2]} castShadow>
        <meshStandardMaterial 
          color="#334155" 
          metalness={0.6} 
          roughness={0.2}
        />
      </Cylinder>
      <Cylinder args={[0.12, 0.12, 1]} position={[1.9, -1.5, 2]} castShadow>
        <meshStandardMaterial 
          color="#334155" 
          metalness={0.6} 
          roughness={0.2}
        />
      </Cylinder>
      
      {/* Enhanced Holographic Screen */}
      <RoundedBox args={[3.2, 2.2, 0.15]} position={[0, 0, -7.9]} radius={0.1}>
        <meshStandardMaterial 
          color="#1e293b" 
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
          metalness={0.6}
          roughness={0.2}
        />
      </RoundedBox>
      
      {children}
    </>
  );
};

// Main Enhanced 3D Robot Interviewer Component
const RobotInterviewer = ({ isSpeaking, isWaving }) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        shadows
        className="w-full h-full"
      >
        <InterviewRoom>
          <Robot isSpeaking={isSpeaking} isWaving={isWaving} />
        </InterviewRoom>
        
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 3}
          minAzimuthAngle={-Math.PI / 6}
          maxAzimuthAngle={Math.PI / 6}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default RobotInterviewer;

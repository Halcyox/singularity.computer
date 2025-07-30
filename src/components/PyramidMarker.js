import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Text, Billboard } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

const getMonthName = (month) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
  return monthNames[month - 1];
};

// Diagonal prism marker component with advanced lighting and hover effects
const PyramidMarker = ({ 
  position, 
  color, 
  title, 
  description, 
  year,
  month,
  category,
  importance,
  isSelected, 
  onClick 
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Animation for selection and hover - just scale and minimal glow
  const { scale, glow } = useSpring({
    scale: isSelected ? 1.5 : hovered ? 1.2 : 1,
    glow: isSelected ? 0.3 : hovered ? 0.15 : 0,
    config: { tension: 300, friction: 15 }
  });
  
  // Simple pulse animation for selection feedback
  const { pulse } = useSpring({
    pulse: isSelected ? 1 : 0,
    from: { pulse: 0 },
    config: { duration: 1000, loop: isSelected },
  });
  
  // Breathing animation
  const { breathScale } = useSpring({
    breathScale: 1.05,
    from: { breathScale: 0.95 },
    loop: { reverse: true },
    config: { duration: 2000 + Math.random() * 1000 }
  });
  
  // Floating animation
  const { floatY } = useSpring({
    floatY: 0.1,
    from: { floatY: -0.1 },
    loop: { reverse: true },
    config: { duration: 3000 + Math.random() * 1500 }
  });
  
  // Size based on importance (1-10)
  const baseHeight = 0.12 + (importance / 25);
  const baseWidth = baseHeight * 0.6;
  const baseDepth = baseHeight * 1.6;
  
  // Calculate text offset based on importance to avoid overlap
  const textVerticalOffset = baseHeight + 0.4;
  
  // Set opacity for text based on hover/selected state
  const textOpacity = isSelected ? 1 : hovered ? 0.9 : 0.7;
  
  // Store event data in the mesh
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData = { title, description, year, month, category };
    }
  }, [title, description, year, month, category]);
  
  // Create a combined position with floating effect
  const animatedPosition = useMemo(() => {
    return [position[0], position[1], position[2]];
  }, [position]);
  
  // Simple color handling
  const markerColor = useMemo(() => new THREE.Color(color), [color]);
  
  // Format title to be more compact if needed
  const formattedTitle = useMemo(() => {
    // For very long titles, truncate or split into multiple lines
    if (title.length > 25) {
      const words = title.split(' ');
      const half = Math.ceil(words.length / 2);
      return words.slice(0, half).join(' ') + '\n' + words.slice(half).join(' ');
    }
    return title;
  }, [title]);
  
  // Calculate date label
  const dateLabel = `${getMonthName(month)} ${year}`;
  
  return (
    <animated.group 
      position={animatedPosition} 
      scale={scale}
      renderOrder={isSelected ? 10 : 0}
    >
      <animated.group 
        position-y={floatY} 
        scale={breathScale}
      >
        {/* The marker prism */}
        <animated.mesh 
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          rotation={[Math.PI * 0.1, Math.PI * 0.25, 0]} // Fixed diagonal orientation
          castShadow
          receiveShadow
        >
          <boxGeometry args={[baseWidth, baseHeight, baseDepth]} />
          <animated.meshStandardMaterial 
            color={markerColor}
            emissive={markerColor}
            emissiveIntensity={glow}
            transparent={true}
            opacity={0.95}
          />
        </animated.mesh>
        
        {/* Simple glow light for selection feedback */}
        {isSelected && (
          <pointLight 
            position={[0, 0, 0]} 
            color={markerColor} 
            intensity={0.8}
            distance={1.5}
            decay={2}
          />
        )}
        
        {/* Simple outline when hovered */}
        {(hovered || isSelected) && (
          <mesh 
            rotation={[Math.PI * 0.1, Math.PI * 0.25, 0]}
            renderOrder={isSelected ? 11 : 1}
          >
            <boxGeometry args={[baseWidth * 1.05, baseHeight * 1.05, baseDepth * 1.05]} />
            <meshBasicMaterial 
              color={markerColor} 
              wireframe={true} 
              transparent 
              opacity={isSelected ? 0.8 : 0.5}
            />
          </mesh>
        )}
        
        {/* Text label with Billboard to ensure it faces the camera */}
        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
        >
          {/* Only show the title text for better clarity */}
          <Text
            position={[0, textVerticalOffset, 0]}
            fontSize={isSelected ? 0.18 : 0.14}
            font="/fonts/Inter-Medium.woff"
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
            lineHeight={1.2}
            letterSpacing={0.02}
            textAlign="center"
            outlineWidth={0.02}
            outlineColor="rgba(0,0,0,0.8)"
            outlineOpacity={0.8}
            depthTest={false}
            renderOrder={20}
            material-transparent={true}
            material-opacity={textOpacity}
          >
            {formattedTitle}
          </Text>
          
          {/* Only show date for selected or hovered items */}
          {(isSelected || hovered) && (
            <Text
              position={[0, textVerticalOffset - 0.25, 0]}
              fontSize={0.11}
              font="/fonts/Inter-Regular.woff"
              color="rgba(255,255,255,0.8)"
              anchorX="center"
              anchorY="middle"
              depthTest={false}
              renderOrder={20}
              material-transparent={true}
              material-opacity={textOpacity * 0.8}
            >
              {dateLabel}
            </Text>
          )}
        </Billboard>
      </animated.group>
    </animated.group>
  );
};

export default PyramidMarker; 
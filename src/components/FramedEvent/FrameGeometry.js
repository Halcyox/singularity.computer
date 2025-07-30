import React from 'react';
import * as THREE from 'three';

/**
 * FrameGeometry - Handles the 3D mesh structure of the frame
 */
const FrameGeometry = ({ 
  width, 
  height, 
  borderWidth, 
  frameColor, 
  matteColor, 
  inlayColor, 
  opacityFactor,
  isFocused,
  distanceFactor 
}) => {
  const innerWidth = width - (borderWidth * 2);
  const innerHeight = height - (borderWidth * 2);
  
  return (
    <>
      {/* Outer Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <meshPhysicalMaterial 
          color={frameColor} 
          roughness={0.4}
          metalness={0.2}
          reflectivity={0.5}
          clearcoat={0.5}
          transparent
          opacity={opacityFactor}
        />
      </mesh>
      
      {/* Inner Matte */}
      <mesh position={[0, 0, 0.051]}>
        <boxGeometry args={[innerWidth, innerHeight, 0.01]} />
        <meshStandardMaterial 
          color={matteColor}
          roughness={0.7}
          metalness={0}
          transparent
          opacity={opacityFactor}
        />
      </mesh>
      
      {/* Frame Inlay Accent - only show for focused or nearby items */}
      {(isFocused || distanceFactor < 4) && (
        <mesh position={[0, innerHeight/2 - 0.1, 0.06]}>
          <boxGeometry args={[innerWidth, 0.05, 0.01]} />
          <meshStandardMaterial 
            color={inlayColor}
            emissive={inlayColor}
            emissiveIntensity={0.2}
            transparent
            opacity={opacityFactor}
          />
        </mesh>
      )}
    </>
  );
};

export default FrameGeometry; 
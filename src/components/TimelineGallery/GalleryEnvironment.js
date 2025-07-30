import React from 'react';
import { Environment } from '@react-three/drei';

/**
 * GalleryEnvironment - Handles the lighting and environment for the gallery
 */
const GalleryEnvironment = () => {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light - simulates sunlight/gallery lighting */}
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={0.7} 
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Soft fill light from opposite side */}
      <directionalLight 
        position={[-5, 3, -5]} 
        intensity={0.3} 
        color="#b0c8ff"
      />
      
      {/* Environment map for reflections */}
      <Environment preset="city" />
    </>
  );
};

export default GalleryEnvironment; 
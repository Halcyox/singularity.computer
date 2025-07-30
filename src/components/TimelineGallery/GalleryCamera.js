import React, { useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';

/**
 * GalleryCamera - Handles the camera setup for the gallery
 */
const GalleryCamera = ({ currentIndex, zoom }) => {
  const cameraRef = useRef();
  
  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, 5]} 
      fov={45}
      near={0.1}
      far={100}
    />
  );
};

export default GalleryCamera; 
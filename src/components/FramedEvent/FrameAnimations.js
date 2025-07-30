import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * FrameAnimations - Handles floating and hover animations for the frame
 */
const FrameAnimations = ({ 
  frameRef, 
  isVisible, 
  isFocused, 
  distanceFactor, 
  position 
}) => {
  // Subtle floating animation
  useFrame((state, delta) => {
    if (frameRef.current && isVisible) {
      // Only apply floating effect to focused or nearby items
      if (isFocused || distanceFactor < 2) {
        frameRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.0005;
        frameRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.01;
      }
    }
  });

  return null; // This component only handles animations, no rendering
};

export default FrameAnimations; 
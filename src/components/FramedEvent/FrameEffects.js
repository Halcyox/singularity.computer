import React from 'react';
import { animated } from '@react-spring/three';

/**
 * FrameEffects - Handles glow and lighting effects for the frame
 */
const FrameEffects = ({ 
  inlayColor, 
  hovered, 
  isFocused 
}) => {
  return (
    <>
      {/* Glow effect for hover/selection */}
      <animated.pointLight
        position={[0, 0, 0.5]}
        color={inlayColor}
        intensity={hovered ? 1 : isFocused ? 0.5 : 0}
        distance={3}
        decay={2}
      />
    </>
  );
};

export default FrameEffects; 
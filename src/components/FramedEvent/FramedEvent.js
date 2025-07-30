import React, { useRef, useState, useMemo } from 'react';
import { animated } from '@react-spring/three';
import * as THREE from 'three';

// Import modular components
import FrameGeometry from './FrameGeometry';
import FrameContent from './FrameContent';
import FrameAnimations from './FrameAnimations';
import FrameEffects from './FrameEffects';
import FRAME_STYLES from './FrameStyles';
import useFrameScale from './useFrameScale';
import useFrameVisibility from './useFrameVisibility';

/**
 * FramedEvent - A framed document/portrait for timeline events
 * Now modularized with clear separation of concerns
 */
const FramedEvent = ({
  position,
  rotation = [0, 0, 0],
  width = 3,
  height = 4,
  event,
  isFocused = false,
  isVisible = true,
  distanceFromCenter = 0,
  onSelect,
  depthFactor = 1.5  // How quickly frames recede into the distance
}) => {
  const frameRef = useRef();
  const contentRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Get the frame style based on category
  const frameStyle = FRAME_STYLES[event.category] || FRAME_STYLES.tech;
  const borderWidth = frameStyle.borderWidth;
  
  // Calculate dimensions
  const innerWidth = width - (borderWidth * 2);
  const innerHeight = height - (borderWidth * 2);
  
  // Calculate z position based on distance from center for depth effect
  const zPosition = distanceFromCenter * depthFactor;
  
  // Use custom hooks for scaling and visibility
  const { scale } = useFrameScale(isFocused, distanceFromCenter, event.title);
  const { opacityFactor, detailLevel, textBlur, distanceFactor } = useFrameVisibility(distanceFromCenter, isFocused);

  // Actual frame with content
  return (
    <animated.group 
      position={[position[0], position[1], position[2] + zPosition]}
      rotation={rotation}
      visible={isVisible}
    >
      {/* Frame */}
      <animated.group 
        ref={frameRef} 
        position-z={hovered ? 0.1 : 0}
        scale={scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onSelect}
      >
        {/* Frame Geometry */}
        <FrameGeometry
          width={width}
          height={height}
          borderWidth={borderWidth}
          frameColor={frameStyle.frameColor}
          matteColor={frameStyle.matteColor}
          inlayColor={frameStyle.inlayColor}
          opacityFactor={opacityFactor}
          isFocused={isFocused}
          distanceFactor={distanceFactor}
        />
        
        {/* Content */}
        <animated.group 
          ref={contentRef} 
          position-z={hovered ? 0.15 : 0.05}
          opacity={isFocused ? 1 : opacityFactor}
        >
          <FrameContent
            event={event}
            innerWidth={innerWidth}
            innerHeight={innerHeight}
            isFocused={isFocused}
            distanceFactor={distanceFactor}
            opacityFactor={opacityFactor}
            detailLevel={detailLevel}
            textBlur={textBlur}
            inlayColor={frameStyle.inlayColor}
          />
        </animated.group>
      </animated.group>
      
      {/* Frame Effects */}
      <FrameEffects
        inlayColor={frameStyle.inlayColor}
        hovered={hovered}
        isFocused={isFocused}
      />
      
      {/* Frame Animations */}
      <FrameAnimations
        frameRef={frameRef}
        isVisible={isVisible}
        isFocused={isFocused}
        distanceFactor={distanceFactor}
        position={position}
      />
    </animated.group>
  );
};

export default FramedEvent; 
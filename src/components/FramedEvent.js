import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Text, useTexture, MeshDistortMaterial } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

// Frame categories with different visual styles
const FRAME_STYLES = {
  tech: {
    frameColor: '#34495e',
    matteColor: '#ecf0f1',
    borderWidth: 0.1,
    cornerStyle: 'modern',
    inlayColor: '#3498db'
  },
  science: {
    frameColor: '#2c3e50',
    matteColor: '#f5f5f5',
    borderWidth: 0.12,
    cornerStyle: 'rounded',
    inlayColor: '#27ae60'
  },
  society: {
    frameColor: '#7f8c8d',
    matteColor: '#f9f3e3',
    borderWidth: 0.08,
    cornerStyle: 'classic',
    inlayColor: '#f1c40f'
  },
  environment: {
    frameColor: '#8e44ad',
    matteColor: '#e8f8f5',
    borderWidth: 0.1,
    cornerStyle: 'natural',
    inlayColor: '#16a085'
  },
  ai: {
    frameColor: '#2c3e50',
    matteColor: '#f0f0f0',
    borderWidth: 0.1,
    cornerStyle: 'tech',
    inlayColor: '#9b59b6'
  }
};

// Format a date string with month and year
const formatDate = (month, year) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${monthNames[month - 1]} ${year}`;
};

/**
 * FramedEvent - A framed document/portrait for timeline events
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
  const { camera } = useThree();

  // Get the frame style based on category
  const frameStyle = FRAME_STYLES[event.category] || FRAME_STYLES.tech;
  const borderWidth = frameStyle.borderWidth;
  
  // Calculate dimensions
  const innerWidth = width - (borderWidth * 2);
  const innerHeight = height - (borderWidth * 2);
  
  // Calculate z position based on distance from center for depth effect
  const zPosition = distanceFromCenter * depthFactor;
  
  // Calculate opacity and detail level based on distance from center
  const distanceFactor = Math.abs(distanceFromCenter);
  const opacityFactor = Math.max(0.3, 1 - Math.min(distanceFactor * 0.15, 0.7)); // Minimum 30% opacity
  const detailLevel = Math.max(0.5, 1 - Math.min(distanceFactor * 0.2, 0.5)); // Minimum 50% detail
  
  // Calculate scale based on focus and distance
  const baseScale = useMemo(() => {
    const scale = isFocused ? 2.5 : Math.max(0.6, 1 - distanceFactor * 0.2); // Much larger difference
    console.log(`FramedEvent ${event.title}: isFocused=${isFocused}, distanceFactor=${distanceFactor}, baseScale=${scale}`);
    return scale;
  }, [isFocused, distanceFactor, event.title]);
  
  // Calculate target scale directly
  const targetScale = useMemo(() => {
    const scale = isFocused ? 2.5 : Math.max(0.6, 1 - distanceFactor * 0.2);
    console.log(`Target scale for ${event.title}: isFocused=${isFocused}, scale=${scale}`);
    return scale;
  }, [isFocused, distanceFactor, event.title]);

  // Simple spring for smooth animation
  const { scale } = useSpring({
    scale: targetScale,
    config: {
      tension: 280,
      friction: 30
    }
  });

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

  // Determine text blur and opacity based on distance from center
  const textBlur = useMemo(() => {
    // No blur for any frames - keep them all clear and readable
    return 0;
  }, []);

  // Show different levels of detail based on distance
  const showFullContent = isFocused || distanceFactor < 3;
  const showTitleOnly = distanceFactor >= 3 && distanceFactor < 6;
  const showMinimal = distanceFactor >= 6;

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
        {/* Outer Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width, height, 0.1]} />
          <meshPhysicalMaterial 
            color={frameStyle.frameColor} 
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
            color={frameStyle.matteColor}
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
              color={frameStyle.inlayColor}
              emissive={frameStyle.inlayColor}
              emissiveIntensity={0.2}
              transparent
              opacity={opacityFactor}
            />
          </mesh>
        )}
        
        {/* Content */}
        <animated.group 
          ref={contentRef} 
          position-z={hovered ? 0.15 : 0.05}
          opacity={isFocused ? 1 : opacityFactor}
        >
          {/* Event Title - always visible */}
          <Text
            position={[0, innerHeight/2 - 0.5, 0.07]}
            fontSize={0.25 * detailLevel}
            maxWidth={innerWidth - 0.4}
            lineHeight={1.2}
            letterSpacing={0.02}
            color="#1a1a1a"
            font="/fonts/Inter-Bold.woff"
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            outlineBlur={textBlur}
            outlineColor="#ffffff"
            outlineOpacity={0.1}
            opacity={isFocused ? 1 : opacityFactor}
          >
            {event.title}
          </Text>
          
          {/* Date - show for focused and nearby items */}
          {(isFocused || distanceFactor < 4) && (
            <Text
              position={[0, innerHeight/2 - 0.8, 0.07]}
              fontSize={0.15 * detailLevel}
              color="#555555"
              font="/fonts/Inter-Regular.woff"
              textAlign="center"
              anchorX="center"
              anchorY="middle"
              outlineBlur={textBlur}
              opacity={isFocused ? 1 : opacityFactor}
            >
              {formatDate(event.month, event.year)}
            </Text>
          )}
          
          {/* Divider - only for focused items */}
          {isFocused && (
            <mesh position={[0, innerHeight/2 - 1, 0.07]}>
              <boxGeometry args={[innerWidth - 1, 0.01, 0.001]} />
              <meshBasicMaterial color="#dddddd" />
            </mesh>
          )}
          
          {/* Description - only for focused items */}
          {showFullContent && (
            <Text
              position={[0, 0, 0.07]}
              fontSize={0.16 * detailLevel}
              maxWidth={innerWidth - 0.6}
              lineHeight={1.3}
              color="#333333"
              font="/fonts/Inter-Regular.woff"
              textAlign="justify"
              anchorX="center"
              anchorY="middle"
              outlineBlur={textBlur}
              opacity={isFocused ? 1 : opacityFactor}
            >
              {event.description}
            </Text>
          )}
          
          {/* Category Badge - show for focused and nearby items */}
          {(isFocused || distanceFactor < 4) && (
            <>
              <mesh position={[0, -innerHeight/2 + 0.3, 0.07]}>
                <planeGeometry args={[1, 0.3]} />
                <meshBasicMaterial color={frameStyle.inlayColor} transparent opacity={0.2} />
              </mesh>
              
              <Text
                position={[0, -innerHeight/2 + 0.3, 0.08]}
                fontSize={0.14 * detailLevel}
                color="#000000"
                font="/fonts/Inter-Medium.woff"
                textAlign="center"
                anchorX="center"
                anchorY="middle"
                outlineBlur={textBlur}
                opacity={isFocused ? 1 : opacityFactor}
              >
                {event.category.toUpperCase()}
              </Text>
            </>
          )}
          
          {/* Importance Indicator - only for focused items */}
          {isFocused && (
            <>
              <mesh position={[0, -innerHeight/2 + 0.7, 0.07]}>
                <planeGeometry args={[innerWidth - 1, 0.05]} />
                <meshBasicMaterial color="#dddddd" />
              </mesh>
              
              <mesh position={[-innerWidth/2 + 0.5 + ((event.importance / 10) * (innerWidth - 1)) / 2, -innerHeight/2 + 0.7, 0.075]}>
                <planeGeometry args={[(event.importance / 10) * (innerWidth - 1), 0.05]} />
                <meshBasicMaterial color={frameStyle.inlayColor} />
              </mesh>
            </>
          )}
        </animated.group>
      </animated.group>
      
      {/* Glow effect for hover/selection */}
      <animated.pointLight
        position={[0, 0, 0.5]}
        color={frameStyle.inlayColor}
        intensity={hovered ? 1 : isFocused ? 0.5 : 0}
        distance={3}
        decay={2}
      />
    </animated.group>
  );
};

export default FramedEvent; 
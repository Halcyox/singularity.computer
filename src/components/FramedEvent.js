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
  
  // Calculate opacity and blur based on distance from center
  const distanceFactor = Math.abs(distanceFromCenter);
  const opacityFactor = 1 - Math.min(distanceFactor * 0.2, 0.6);
  
  // Springs for animations
  const { frameSpring, contentSpring, glowSpring } = useSpring({
    frameSpring: {
      positionZ: hovered ? 0.1 : 0,
      scale: hovered ? 1.03 : 1,
      color: hovered ? 0xffffff : 0xcccccc
    },
    contentSpring: {
      positionZ: hovered ? 0.15 : 0.05,
      opacity: isFocused ? 1 : opacityFactor
    },
    glowSpring: {
      intensity: hovered ? 1 : isFocused ? 0.5 : 0,
    },
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
    if (isFocused) return 0;
    return Math.min(distanceFactor * 2, 6);
  }, [isFocused, distanceFactor]);

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
        position-z={frameSpring.positionZ} 
        scale={frameSpring.scale}
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
          />
        </mesh>
        
        {/* Inner Matte */}
        <mesh position={[0, 0, 0.051]}>
          <boxGeometry args={[innerWidth, innerHeight, 0.01]} />
          <meshStandardMaterial 
            color={frameStyle.matteColor}
            roughness={0.7}
            metalness={0}
          />
        </mesh>
        
        {/* Frame Inlay Accent */}
        <mesh position={[0, innerHeight/2 - 0.1, 0.06]}>
          <boxGeometry args={[innerWidth, 0.05, 0.01]} />
          <meshStandardMaterial 
            color={frameStyle.inlayColor}
            emissive={frameStyle.inlayColor}
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Content */}
        <animated.group 
          ref={contentRef} 
          position-z={contentSpring.positionZ}
          opacity={contentSpring.opacity}
        >
          {/* Event Title */}
          <Text
            position={[0, innerHeight/2 - 0.5, 0.07]}
            fontSize={0.25}
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
            opacity={contentSpring.opacity}
          >
            {event.title}
          </Text>
          
          {/* Date */}
          <Text
            position={[0, innerHeight/2 - 0.8, 0.07]}
            fontSize={0.15}
            color="#555555"
            font="/fonts/Inter-Regular.woff"
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            outlineBlur={textBlur}
            opacity={contentSpring.opacity}
          >
            {formatDate(event.month, event.year)}
          </Text>
          
          {/* Divider */}
          <mesh position={[0, innerHeight/2 - 1, 0.07]}>
            <boxGeometry args={[innerWidth - 1, 0.01, 0.001]} />
            <meshBasicMaterial color="#dddddd" />
          </mesh>
          
          {/* Description */}
          <Text
            position={[0, 0, 0.07]}
            fontSize={0.16}
            maxWidth={innerWidth - 0.6}
            lineHeight={1.3}
            color="#333333"
            font="/fonts/Inter-Regular.woff"
            textAlign="justify"
            anchorX="center"
            anchorY="middle"
            outlineBlur={textBlur}
            opacity={contentSpring.opacity}
          >
            {event.description}
          </Text>
          
          {/* Category Badge */}
          <mesh position={[0, -innerHeight/2 + 0.3, 0.07]}>
            <planeGeometry args={[1, 0.3]} />
            <meshBasicMaterial color={frameStyle.inlayColor} transparent opacity={0.2} />
          </mesh>
          
          <Text
            position={[0, -innerHeight/2 + 0.3, 0.08]}
            fontSize={0.14}
            color="#000000"
            font="/fonts/Inter-Medium.woff"
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            outlineBlur={textBlur}
            opacity={contentSpring.opacity}
          >
            {event.category.toUpperCase()}
          </Text>
          
          {/* Importance Indicator */}
          <mesh position={[0, -innerHeight/2 + 0.7, 0.07]}>
            <planeGeometry args={[innerWidth - 1, 0.05]} />
            <meshBasicMaterial color="#dddddd" />
          </mesh>
          
          <mesh position={[-innerWidth/2 + 0.5 + ((event.importance / 10) * (innerWidth - 1)) / 2, -innerHeight/2 + 0.7, 0.075]}>
            <planeGeometry args={[(event.importance / 10) * (innerWidth - 1), 0.05]} />
            <meshBasicMaterial color={frameStyle.inlayColor} />
          </mesh>
        </animated.group>
      </animated.group>
      
      {/* Glow effect for hover/selection */}
      <animated.pointLight
        position={[0, 0, 0.5]}
        color={frameStyle.inlayColor}
        intensity={glowSpring.intensity}
        distance={3}
        decay={2}
      />
    </animated.group>
  );
};

export default FramedEvent; 
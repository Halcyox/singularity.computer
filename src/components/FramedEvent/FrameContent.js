import React from 'react';
import { Text } from '@react-three/drei';

// Format a date string with month and year
const formatDate = (month, year) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${monthNames[month - 1]} ${year}`;
};

/**
 * FrameContent - Handles all text and UI elements inside the frame
 */
const FrameContent = ({ 
  event, 
  innerWidth, 
  innerHeight, 
  isFocused, 
  distanceFactor, 
  opacityFactor, 
  detailLevel, 
  textBlur,
  inlayColor 
}) => {
  // Show different levels of detail based on distance
  const showFullContent = isFocused || distanceFactor < 3;
  
  return (
    <>
      {/* Event Title - always visible */}
      <Text
        position={[0, innerHeight/2 - 0.5, 0.07]}
        fontSize={0.25 * detailLevel}
        maxWidth={innerWidth - 0.4}
        lineHeight={1.2}
        letterSpacing={0.02}
        color="#1a1a1a"
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
            <meshBasicMaterial color={inlayColor} transparent opacity={0.2} />
          </mesh>
          
          <Text
            position={[0, -innerHeight/2 + 0.3, 0.08]}
            fontSize={0.14 * detailLevel}
            color="#000000"
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
            <meshBasicMaterial color={inlayColor} />
          </mesh>
        </>
      )}
    </>
  );
};

export default FrameContent; 
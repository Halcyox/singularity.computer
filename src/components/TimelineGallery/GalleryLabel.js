import React from 'react';
import { Text } from '@react-three/drei';

/**
 * GalleryLabel - 3D timeline label rendered inside the Canvas
 */
const GalleryLabel = () => {
  return (
    <Text
      position={[0, 2.5, 0]}
      rotation={[0, 0, 0]}
      fontSize={0.5}
      color="white"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="black"
      outlineOpacity={0.8}
    >
      Interactive Timeline: 2020-2030
    </Text>
  );
};

export default GalleryLabel; 
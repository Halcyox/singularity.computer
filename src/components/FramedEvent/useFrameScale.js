import { useMemo } from 'react';
import { useSpring } from '@react-spring/three';

/**
 * useFrameScale - Custom hook for frame scaling logic
 */
export const useFrameScale = (isFocused, distanceFactor, eventTitle) => {
  // Calculate target scale directly
  const targetScale = useMemo(() => {
    const scale = isFocused ? 2.5 : Math.max(0.6, 1 - distanceFactor * 0.2);
    console.log(`Target scale for ${eventTitle}: isFocused=${isFocused}, scale=${scale}`);
    return scale;
  }, [isFocused, distanceFactor, eventTitle]);

  // Simple spring for smooth animation
  const { scale } = useSpring({
    scale: targetScale,
    config: {
      tension: 280,
      friction: 30
    }
  });

  return { scale, targetScale };
};

export default useFrameScale; 
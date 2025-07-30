import { useMemo } from 'react';

/**
 * useFrameVisibility - Custom hook for frame visibility and opacity calculations
 */
export const useFrameVisibility = (distanceFromCenter, isFocused) => {
  // Calculate opacity and detail level based on distance from center
  const distanceFactor = Math.abs(distanceFromCenter);
  const opacityFactor = Math.max(0.3, 1 - Math.min(distanceFactor * 0.15, 0.7)); // Minimum 30% opacity
  const detailLevel = Math.max(0.5, 1 - Math.min(distanceFactor * 0.2, 0.5)); // Minimum 50% detail
  
  // Determine text blur and opacity based on distance from center
  const textBlur = useMemo(() => {
    // No blur for any frames - keep them all clear and readable
    return 0;
  }, []);

  return {
    opacityFactor,
    detailLevel,
    textBlur,
    distanceFactor
  };
};

export default useFrameVisibility; 
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * GalleryControls - Handles navigation controls for the gallery
 */
const GalleryControls = ({ setCurrentIndex, currentIndex, maxIndex, zoom, setZoom }) => {
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startIndexRef = useRef(0);
  const { camera, gl } = useThree();
  
  // Handle wheel event for zooming through frames
  const handleWheel = useCallback((e) => {
    // Determine direction
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    setZoom(prev => Math.max(0.1, Math.min(10, prev * zoomFactor)));
  }, [setZoom]);
  
  // Handle drag operation for moving through frames (mouse)
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startIndexRef.current = currentIndex;
    gl.domElement.style.cursor = 'grabbing';
  }, [currentIndex, gl.domElement.style]);
  
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    // Calculate movement
    const deltaX = e.clientX - startXRef.current;
    const indexDelta = -deltaX / 100; // How fast to move through frames
    
    // Update current index
    const newIndex = Math.max(0, Math.min(maxIndex, startIndexRef.current + indexDelta));
    setCurrentIndex(newIndex);
  }, [isDragging, maxIndex, setCurrentIndex]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    gl.domElement.style.cursor = 'grab';
    
    // Snap to nearest integer index
    setCurrentIndex(Math.round(currentIndex));
  }, [currentIndex, gl.domElement.style, setCurrentIndex]);
  
  // Handle touch events for mobile
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      startXRef.current = e.touches[0].clientX;
      startIndexRef.current = currentIndex;
    }
  }, [currentIndex]);
  
  const handleTouchMove = useCallback((e) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    e.preventDefault(); // Prevent scrolling
    
    // Calculate movement
    const deltaX = e.touches[0].clientX - startXRef.current;
    const indexDelta = -deltaX / 80; // Slightly faster for touch
    
    // Update current index
    const newIndex = Math.max(0, Math.min(maxIndex, startIndexRef.current + indexDelta));
    setCurrentIndex(newIndex);
  }, [isDragging, maxIndex, setCurrentIndex]);
  
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    
    // Snap to nearest integer index
    setCurrentIndex(Math.round(currentIndex));
  }, [currentIndex, setCurrentIndex]);
  
  // Set up event listeners
  useEffect(() => {
    const canvas = gl.domElement;
    
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    
    // Initial style
    canvas.style.cursor = 'grab';
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gl, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd]);
  
  // Position camera to look at current frame
  useFrame(() => {
    // Smoothly animate camera target to current index position
    const targetX = currentIndex * 4; // 4 units between frames
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);

    // Smoothly adjust camera zoom - bring it closer for better scaling visibility
    const baseDistance = 4; // Closer for better scaling visibility
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, baseDistance * zoom, 0.05);

    // Always look straight ahead
    camera.lookAt(new THREE.Vector3(camera.position.x, 0, 0));
  });
  
  return null;
};

export default GalleryControls; 
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Environment, 
  Text
} from '@react-three/drei';
import { 
  EffectComposer, 
  DepthOfField, 
  Bloom 
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import timelineData from './TimelineData';
import FramedEvent from './FramedEvent';

// The ambient environment for our gallery
const GalleryEnvironment = () => {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light - simulates sunlight/gallery lighting */}
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={0.7} 
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Soft fill light from opposite side */}
      <directionalLight 
        position={[-5, 3, -5]} 
        intensity={0.3} 
        color="#b0c8ff"
      />
      
      {/* Environment map for reflections */}
      <Environment preset="city" />
      
      {/* Gallery floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Backdrop "wall" */}
      <mesh position={[0, 0, -6]} receiveShadow>
        <planeGeometry args={[100, 20]} />
        <meshStandardMaterial color="#141428" roughness={0.95} metalness={0.05} />
      </mesh>
    </>
  );
};

// Controls for navigating the gallery
const GalleryControls = ({ setCurrentIndex, currentIndex, maxIndex }) => {
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startIndexRef = useRef(0);
  const { camera, gl } = useThree();
  
  // Handle wheel event for zooming through frames
  const handleWheel = useCallback((e) => {
    // Determine direction
    const direction = e.deltaY > 0 ? 1 : -1;
    setCurrentIndex(prev => Math.max(0, Math.min(maxIndex, prev + direction)));
  }, [setCurrentIndex, maxIndex]);
  
  // Handle drag operation for moving through frames
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
  
  // Set up event listeners
  useEffect(() => {
    const canvas = gl.domElement;
    
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Initial style
    canvas.style.cursor = 'grab';
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gl, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);
  
  // Position camera to look at current frame
  useFrame(() => {
    // Smoothly animate camera target to current index position
    const targetX = currentIndex * 4; // 4 units between frames
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    
    // Always look straight ahead
    camera.lookAt(new THREE.Vector3(camera.position.x, 0, 0));
  });
  
  return null;
};

// The camera with depth of field effects
const GalleryCamera = ({ currentIndex, dof }) => {
  const cameraRef = useRef();
  const { size } = useThree();
  
  // Calculate focus distance based on current index
  const focusDistance = useMemo(() => {
    // Focus on the z-position where frames are located
    return 5;
  }, []);
  
  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0, 5]} 
        fov={45}
        near={0.1}
        far={100}
      />
      
      {dof && (
        <EffectComposer>
          <DepthOfField
            focusDistance={focusDistance}
            focalLength={0.02}
            bokehScale={2}
            height={size.height}
          />
          <Bloom 
            intensity={0.1} 
            luminanceThreshold={0.9} 
            luminanceSmoothing={0.025} 
          />
        </EffectComposer>
      )}
    </>
  );
};

// The main gallery component
const TimelineGallery = ({ activeCategories = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [depthOfFieldEnabled, setDepthOfFieldEnabled] = useState(true);
  
  // Filter events by active categories
  const filteredEvents = useMemo(() => {
    return timelineData.events.filter(event => 
      activeCategories.length === 0 || activeCategories.includes(event.category)
    ).sort((a, b) => {
      // Sort by year and month
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }, [activeCategories]);
  
  // Handle frame selection
  const handleSelectFrame = useCallback((eventId) => {
    setSelectedEvent(eventId);
    
    // Find index of the selected event and focus on it
    const eventIndex = filteredEvents.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      setCurrentIndex(eventIndex);
    }
  }, [filteredEvents]);
  
  // Position frames along the gallery
  const framePositions = useMemo(() => {
    return filteredEvents.map((event, index) => {
      // Space frames evenly along X axis
      return [index * 4, 0, 0]; // 4 units apart
    });
  }, [filteredEvents]);
  
  return (
    <div className="timeline-container">
      <Canvas shadows>
        <GalleryCamera currentIndex={currentIndex} dof={depthOfFieldEnabled} />
        <GalleryEnvironment />
        <GalleryControls 
          setCurrentIndex={setCurrentIndex} 
          currentIndex={currentIndex} 
          maxIndex={filteredEvents.length - 1} 
        />
        
        {/* Frames */}
        {filteredEvents.map((event, index) => (
          <FramedEvent
            key={event.id}
            position={framePositions[index]}
            event={event}
            isFocused={index === Math.round(currentIndex)}
            isVisible={Math.abs(index - currentIndex) < 5} // Only show nearby frames
            distanceFromCenter={index - currentIndex}
            onSelect={() => handleSelectFrame(event.id)}
          />
        ))}
        
        {/* Timeline label */}
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
          font="/fonts/Inter-Bold.woff"
        >
          Interactive Timeline: 2020-2030
        </Text>
      </Canvas>
      
      <div className="timeline-ui">
        <div className="timeline-controls">
          <h3>Gallery Navigation</h3>
          <p>• Scroll wheel to move through time</p>
          <p>• Click and drag to navigate gallery</p>
          <p>• Click on a frame to focus</p>
          <button 
            onClick={() => setDepthOfFieldEnabled(!depthOfFieldEnabled)}
            className="effect-toggle"
          >
            {depthOfFieldEnabled ? "Disable" : "Enable"} Depth of Field
          </button>
        </div>
        
        {selectedEvent && (
          <div className="event-details-panel">
            <div 
              className="category-indicator" 
              style={{ 
                backgroundColor: timelineData.categories.find(
                  c => c.id === filteredEvents.find(e => e.id === selectedEvent)?.category
                )?.color 
              }}
            />
            <h3>{filteredEvents.find(e => e.id === selectedEvent)?.title}</h3>
            <p className="event-description">
              {filteredEvents.find(e => e.id === selectedEvent)?.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineGallery; 
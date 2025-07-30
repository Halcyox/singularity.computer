import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  useHelper, 
  Box, 
  Environment,
  Sparkles,
  ContactShadows,
  useTexture
} from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import timelineData from './TimelineData';
import PyramidMarker from './PyramidMarker';
import CategoryFilter from './CategoryFilter';
import EventDetailsPanel from './EventDetailsPanel';
import './TimelineComponent.css';

// Helper function to get month name - left here for other components in this file
const getMonthName = (month) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
  return monthNames[month - 1];
};

// Timeline line component with enhanced visuals
const TimelineLine = () => {
  return (
    <mesh position={[0, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[10, 0.03, 0.03]} />
      <meshStandardMaterial color="#cccccc" />
    </mesh>
  );
};

// Year markers along the timeline
const YearMarkers = ({ startYear, endYear, timelineWidth }) => {
  // Create markers only once using useMemo
  const yearMarkers = useMemo(() => {
    const minX = -timelineWidth / 2;
    const maxX = timelineWidth / 2;
    const markers = [];
    
    for (let year = startYear; year <= endYear; year++) {
      const normalizedPosition = (year - startYear) / (endYear - startYear);
      const xPos = minX + normalizedPosition * (maxX - minX);
      
      markers.push(
        <group key={year} position={[xPos, -0.4, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.24}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.woff"
            outlineWidth={0.015}
            outlineColor="#000000"
            outlineOpacity={0.6}
            fillOpacity={0.9}
            className="year-label"
            renderOrder={30}
            depthTest={false}
          >
            {year}
          </Text>
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.01, 0.15, 0.01]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      );
    }
    
    return markers;
  }, [startYear, endYear, timelineWidth]);
  
  return <>{yearMarkers}</>;
};

// Selective volume component with enhanced visuals
const SelectiveVolume = ({ volumeSize, position, focusScale, onResize }) => {
  const boxRef = useRef();
  useHelper(boxRef, THREE.BoxHelper, "cyan");
  
  // Handle resize with controls
  const handleResize = (direction, delta) => {
    const newSize = { ...volumeSize };
    newSize.x += direction === 'x' ? delta : 0;
    newSize.y += direction === 'y' ? delta : 0;
    newSize.z += direction === 'z' ? delta : 0;
    onResize(newSize);
  };
  
  return (
    <group position={position}>
      {/* Main volume box */}
      <Box
        ref={boxRef}
        args={[volumeSize.x, volumeSize.y, volumeSize.z]}
        position={[0, 0, 0]}
      >
        <meshPhysicalMaterial 
          color="cyan" 
          transparent 
          opacity={0.15} 
          metalness={0.2}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.2}
          transmission={0.95}
          depthWrite={false}
          depthTest={true}
          side={THREE.DoubleSide}
        />
      </Box>
      
      {/* Resize handles */}
      <mesh position={[volumeSize.x/2, 0, 0]} onClick={() => handleResize('x', 0.5)}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshPhysicalMaterial 
          color="red" 
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          emissive="red"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[-volumeSize.x/2, 0, 0]} onClick={() => handleResize('x', -0.5)}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshPhysicalMaterial 
          color="red" 
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          emissive="red"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};

// Scene environment component for lighting and effects
const SceneEnvironment = () => {
  return (
    <>
      {/* Simple background color instead of environment map */}
      <color attach="background" args={['#0a0a2e']} />
      
      {/* Basic ambient light for overall illumination */}
      <ambientLight intensity={0.6} color="#ffffff" />
      
      {/* Main light */}
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={0.8} 
        color="#ffffff"
        castShadow 
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Soft fill light */}
      <directionalLight 
        position={[-5, 5, -2]} 
        intensity={0.3} 
        color="#b0c8ff"
      />
      
      {/* Subtle sparkles for space atmosphere */}
      <Sparkles 
        count={100} 
        size={2} 
        scale={[15, 5, 5]} 
        position={[0, 0, 0]} 
        speed={0.2} 
        opacity={0.08}
        color="#ffffff"
      />
    </>
  );
};

// Custom timeline controller that only allows horizontal zooming and reversed panning
const TimelineControls = ({ timeScale, setTimeScale }) => {
  const { camera, gl, scene } = useThree();
  const controlsRef = useRef();
  const startPanRef = useRef(null);
  const lastPanPositionRef = useRef(null);
  const zoomSpeedRef = useRef(0.1);
  
  // Set up controls with custom handlers
  useEffect(() => {
    const canvas = gl.domElement;
    
    // Zoom handler - only affects timeline width
    const handleWheel = (e) => {
      e.preventDefault();
      
      // Determine zoom direction
      const zoomIn = e.deltaY < 0;
      
      // Calculate new scale factor
      const zoomDelta = zoomIn ? 1 + zoomSpeedRef.current : 1 - zoomSpeedRef.current;
      const newTimeScale = Math.min(Math.max(timeScale * zoomDelta, 0.5), 5); // Limit zoom range
      
      // Update time scale
      setTimeScale(newTimeScale);
    };
    
    // Pan handler - reversed direction (dragging left moves timeline right)
    const handleMouseDown = (e) => {
      if (e.button === 0) { // Left mouse button
        startPanRef.current = {
          x: e.clientX,
          y: e.clientY
        };
        lastPanPositionRef.current = camera.position.clone();
        canvas.style.cursor = 'grabbing';
        
        // Add temporary event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };
    
    const handleMouseMove = (e) => {
      if (startPanRef.current) {
        // Calculate movement delta
        const deltaX = (e.clientX - startPanRef.current.x) / 100;
        
        // Apply reversed movement (only on x-axis)
        camera.position.x = lastPanPositionRef.current.x - deltaX * camera.position.z * 0.5;
        
        // Look at the same point on timeline
        camera.lookAt(new THREE.Vector3(camera.position.x, 0, 0));
      }
    };
    
    const handleMouseUp = () => {
      startPanRef.current = null;
      canvas.style.cursor = 'grab';
      
      // Remove temporary event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Add event listeners
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    
    // Set initial cursor
    canvas.style.cursor = 'grab';
    
    // Cleanup
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gl, camera, timeScale, setTimeScale]);
  
  return null;
};

// Main timeline scene
const TimelineScene = ({ activeCategories, onSelectEvent }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [volumeSize, setVolumeSize] = useState({ x: 10, y: 2, z: 2 });
  const [volumePosition, setVolumePosition] = useState([0, 0, 0]);
  const [focusScale, setFocusScale] = useState(1);
  const [timeScale, setTimeScale] = useState(1.5); // Increased default width scale from 1.0 to 1.5
  const { camera } = useThree();
  
  // Filter events by active categories
  const filteredEvents = useMemo(() => {
    return timelineData.events.filter(event => 
      activeCategories.length === 0 || activeCategories.includes(event.category)
    );
  }, [activeCategories]);
  
  // Get category color for an event
  const getCategoryColor = useCallback((categoryId) => {
    const category = timelineData.categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#ffffff';
  }, []);
  
  // Apply timeline scaling to positions
  const timelineWidth = 12 * timeScale; // Increased base width from 10 to 12, scale based on zoom
  
  // Position events along the timeline with month-level precision
  const eventPositions = useMemo(() => {
    // Use grid positioning to prevent overlapping
    // Group events by year and month to detect potential overlaps
    const eventsByDate = {};
    
    filteredEvents.forEach(event => {
      const key = `${event.year}-${event.month}`;
      if (!eventsByDate[key]) {
        eventsByDate[key] = [];
      }
      eventsByDate[key].push(event);
    });
    
    return filteredEvents.map((event, index) => {
      const minX = -timelineWidth / 2;
      const maxX = timelineWidth / 2;
      const startYear = timelineData.timeRange.start;
      const endYear = timelineData.timeRange.end;
      const totalMonths = (endYear - startYear + 1) * 12;
      const eventMonthOffset = (event.year - startYear) * 12 + (event.month - 1);
      const normalizedPosition = eventMonthOffset / totalMonths;
      
      // Base X position along timeline - now uses scaled width
      const xPos = minX + normalizedPosition * (maxX - minX);
      
      // Find events in the same month/year for offset calculation
      const key = `${event.year}-${event.month}`;
      const sameMonthEvents = eventsByDate[key];
      const eventIndexInMonth = sameMonthEvents.findIndex(e => e.id === event.id);
      const totalEventsInMonth = sameMonthEvents.length;
      
      // Calculate offset based on position in same-month group
      let xOffset = 0;
      if (totalEventsInMonth > 1) {
        // Spread events in same month, but less widely
        xOffset = ((eventIndexInMonth / (totalEventsInMonth - 1)) - 0.5) * 0.7;
      }
      
      // Calculate Y position based on multiple factors to create a visually pleasing pattern
      const categoryIndex = timelineData.categories.findIndex(cat => cat.id === event.category);
      // Drastically reduced vertical category separation from 0.5 to 0.2
      const baseCategoryOffset = (categoryIndex - 2) * 0.2;
      
      // Minimal wave pattern with very small amplitude (from 0.4 to 0.15)
      const yWave = Math.sin(eventMonthOffset * 0.4) * 0.15;
      
      // Minimal importance variation
      const importanceVariation = (event.importance / 30) - 0.15;
      
      // Combine all Y factors - results in much flatter placement
      const yPos = baseCategoryOffset + yWave + importanceVariation;
      
      // Z position - maintain some depth variation for visual interest
      const zOffset = Math.cos(eventMonthOffset * 0.5) * 0.5;
      const zPos = baseCategoryOffset * 0.9 + zOffset;
      
      return [xPos + xOffset, yPos, zPos];
    });
  }, [filteredEvents, timelineData.categories, timelineData.timeRange, timelineWidth]);
  
  // Scale the timeline line based on zoom level
  const timelineLineScale = useMemo(() => [timeScale, 1, 1], [timeScale]);
  
  // Handle event selection
  const handleEventClick = useCallback((event) => {
    const newSelectedEvent = event.id === selectedEvent ? null : event.id;
    setSelectedEvent(newSelectedEvent);
    
    // Notify parent component
    if (onSelectEvent) {
      onSelectEvent(newSelectedEvent);
    }
    
    // If selecting an event, adjust camera and volume to focus on it
    if (event.id !== selectedEvent) {
      const eventIndex = filteredEvents.findIndex(e => e.id === event.id);
      if (eventIndex !== -1) {
        const eventPosition = eventPositions[eventIndex];
        
        // Center volume around selected event - make it smaller for clearer focus
        setVolumePosition([eventPosition[0], 0, 0]);
        
        // Increase volume size to better accommodate wider event spacing
        setVolumeSize({ x: 4, y: 3, z: 4 }); // Increased from 3×2×3 to 4×3×4
        setFocusScale(1.5);
        
        // Smoothly move camera to a better viewing position without changing zoom level
        const targetPosition = new THREE.Vector3(
          eventPosition[0], // Keep X position focused on the event
          camera.position.y, // Maintain current Y height
          camera.position.z  // Maintain current Z distance
        );
        
        // Animate camera movement
        const startPosition = camera.position.clone();
        const startTime = Date.now();
        const duration = 800; // 0.8 seconds
        
        const animateCamera = () => {
          const now = Date.now();
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);
          
          // Ease in-out function
          const easeProgress = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;
          
          // Interpolate position (only X coordinate)
          camera.position.x = startPosition.x + (targetPosition.x - startPosition.x) * easeProgress;
          
          // Look at the timeline at the event position
          camera.lookAt(new THREE.Vector3(eventPosition[0], 0, 0));
          
          if (progress < 1) {
            requestAnimationFrame(animateCamera);
          }
        };
        
        animateCamera();
      }
    } else {
      // Reset to full timeline view when deselecting
      setVolumePosition([0, 0, 0]);
      setVolumeSize({ x: timelineWidth, y: 2, z: 2 }); // Match timeline width
      setFocusScale(1);
      
      // Reset camera position to center
      const targetPosition = new THREE.Vector3(0, camera.position.y, camera.position.z);
      const startPosition = camera.position.clone();
      const startTime = Date.now();
      const duration = 800; // 0.8 seconds
      
      const animateCamera = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        
        // Ease in-out function
        const easeProgress = progress < 0.5 
          ? 2 * progress * progress 
          : -1 + (4 - 2 * progress) * progress;
        
        // Interpolate position (only X coordinate)
        camera.position.x = startPosition.x + (targetPosition.x - startPosition.x) * easeProgress;
        
        // Look at center
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        
        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        }
      };
      
      animateCamera();
    }
  }, [selectedEvent, filteredEvents, eventPositions, onSelectEvent, camera, timelineWidth]);
  
  // Handle volume resize
  const handleVolumeResize = useCallback((newSize) => {
    setVolumeSize(newSize);
  }, []);
  
  return (
    <>
      {/* Scene environment including lights and effects */}
      <SceneEnvironment />
      
      {/* Timeline base line - now scales with zoom */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow scale={timelineLineScale}>
        <boxGeometry args={[10, 0.03, 0.03]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      
      {/* Year markers - positioned based on timeline scale */}
      <YearMarkers 
        startYear={timelineData.timeRange.start} 
        endYear={timelineData.timeRange.end} 
        timelineWidth={timelineWidth}
      />
      
      {/* Timeline events */}
      {filteredEvents.map((event, index) => (
        <PyramidMarker
          key={event.id}
          position={eventPositions[index]}
          color={getCategoryColor(event.category)}
          title={event.title}
          description={event.description}
          year={event.year}
          month={event.month}
          category={event.category}
          importance={event.importance}
          isSelected={selectedEvent === event.id}
          onClick={() => handleEventClick(event)}
        />
      ))}
      
      {/* Selective volume */}
      <SelectiveVolume
        volumeSize={volumeSize}
        position={volumePosition}
        focusScale={focusScale}
        onResize={handleVolumeResize}
      />
      
      {/* Custom timeline controls instead of OrbitControls */}
      <TimelineControls 
        timeScale={timeScale}
        setTimeScale={setTimeScale}
      />
    </>
  );
};

// Main timeline component with UI elements
const TimelineComponent = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeCategories, setActiveCategories] = useState([]);
  
  // Toggle category filter
  const handleToggleCategory = useCallback((categoryId) => {
    setActiveCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  }, []);
  
  return (
    <div className="timeline-container">
      <Canvas 
        shadows 
        camera={{ position: [0, 1.5, 12], fov: 42 }} // Lower camera height from 2 to 1.5 and narrower FOV
        gl={{ 
          antialias: true,
          alpha: false,
          toneMapping: THREE.NoToneMapping,
          outputEncoding: THREE.sRGBEncoding,
        }}
        dpr={[1, 2]}
      >
        <TimelineScene 
          activeCategories={activeCategories}
          onSelectEvent={setSelectedEvent} 
        />
      </Canvas>
      
      <div className="timeline-ui">
        <div className="timeline-controls">
          <h3>Interactive Timeline: 2020-2030</h3>
          <p>• Mouse wheel to zoom in/out</p>
          <p>• Left-click + drag to pan</p>
          <p>• Click on events to focus</p>
          <p>• Hover over events for details</p>
          <p>• Drag red handles to resize focus volume</p>
        </div>
        
        <CategoryFilter 
          categories={timelineData.categories} 
          activeCategories={activeCategories}
          onToggleCategory={handleToggleCategory}
        />
        
        {selectedEvent && (
          <EventDetailsPanel selectedEventId={selectedEvent} />
        )}
      </div>
    </div>
  );
};

export default TimelineComponent; 
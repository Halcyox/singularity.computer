import React from 'react';
import { Canvas } from '@react-three/fiber';

// Import modular components
import GalleryEnvironment from './GalleryEnvironment';
import GalleryControls from './GalleryControls';
import GalleryCamera from './GalleryCamera';
import GalleryUI from './GalleryUI';
import GalleryLabel from './GalleryLabel';
import useGalleryState from './useGalleryState';
import FramedEvent from '../FramedEvent';
import timelineData from '../TimelineData';

/**
 * TimelineGallery - Main gallery component for the timeline
 * Now modularized with clear separation of concerns
 */
const TimelineGallery = ({ activeCategories = [] }) => {
  // Use custom hook for state management
  const {
    filteredEvents,
    currentIndex,
    setCurrentIndex,
    selectedEvent,
    zoom,
    setZoom,
    handleSelectFrame,
    framePositions,
    maxIndex
  } = useGalleryState(activeCategories);
  
  return (
    <div className="timeline-container">
      <Canvas shadows>
        <GalleryCamera currentIndex={currentIndex} zoom={zoom} />
        <GalleryEnvironment />
        <GalleryControls 
          setCurrentIndex={setCurrentIndex} 
          currentIndex={currentIndex} 
          maxIndex={maxIndex}
          zoom={zoom}
          setZoom={setZoom}
        />
        
        {/* 3D Timeline Label */}
        <GalleryLabel />
        
        {/* Frames */}
        {filteredEvents.map((event, index) => {
          const isFocused = index === Math.round(currentIndex);
          console.log(`Frame ${index} (${event.title}): isFocused=${isFocused}, currentIndex=${currentIndex}, rounded=${Math.round(currentIndex)}`);
          return (
            <FramedEvent
              key={event.id}
              position={framePositions[index]}
              event={event}
              isFocused={isFocused}
              isVisible={true} // Always show all frames
              distanceFromCenter={index - currentIndex}
              onSelect={() => handleSelectFrame(event.id)}
            />
          );
        })}
      </Canvas>
      
      {/* 2D UI Overlay */}
      <GalleryUI
        zoom={zoom}
        setZoom={setZoom}
        selectedEvent={selectedEvent}
        filteredEvents={filteredEvents}
        timelineData={timelineData}
      />
    </div>
  );
};

export default TimelineGallery; 
import { useState, useMemo, useCallback } from 'react';
import timelineData from '../TimelineData';

/**
 * useGalleryState - Custom hook for gallery state management
 */
export const useGalleryState = (activeCategories = []) => {
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
  
  // Calculate initial currentIndex from the FILTERED events array
  const initialIndex = useMemo(() => {
    const index = filteredEvents.findIndex(e => e.year === 2024);
    console.log('Filtered events:', filteredEvents.map(e => `${e.year}-${e.month}: ${e.title}`));
    console.log('Initial index for 2024:', index);
    return index;
  }, [filteredEvents]);
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [zoom, setZoom] = useState(1.0); // Start with default zoom
  
  console.log('Current state - currentIndex:', currentIndex, 'initialIndex:', initialIndex);
  
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
  
  return {
    filteredEvents,
    currentIndex,
    setCurrentIndex,
    selectedEvent,
    setSelectedEvent,
    zoom,
    setZoom,
    handleSelectFrame,
    framePositions,
    maxIndex: filteredEvents.length - 1
  };
};

export default useGalleryState; 
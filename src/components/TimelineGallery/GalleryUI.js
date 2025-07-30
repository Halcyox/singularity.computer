import React from 'react';

/**
 * GalleryUI - Handles the 2D UI elements for the gallery
 */
const GalleryUI = ({ zoom, setZoom, selectedEvent, filteredEvents, timelineData }) => {
  return (
    <div className="timeline-ui">
      <div className="timeline-controls">
        <h3>Gallery Navigation</h3>
        <p>• Scroll wheel to zoom in/out</p>
        <p>• Click and drag to navigate gallery</p>
        <p>• Click on a frame to focus</p>
        
        <div className="zoom-controls">
          <label htmlFor="zoom-slider">Zoom Level: {zoom.toFixed(1)}x</label>
          <input
            id="zoom-slider"
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="zoom-slider"
          />
          <div className="zoom-buttons">
            <button onClick={() => setZoom(0.5)} className="zoom-btn">50%</button>
            <button onClick={() => setZoom(1)} className="zoom-btn">100%</button>
            <button onClick={() => setZoom(2)} className="zoom-btn">200%</button>
            <button onClick={() => setZoom(5)} className="zoom-btn">500%</button>
          </div>
        </div>
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
  );
};

export default GalleryUI; 
import React, { useMemo } from 'react';
import timelineData from './TimelineData';
import './TimelineComponent.css';

const getMonthName = (month) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
  return monthNames[month - 1];
};

const EventDetailsPanel = ({ selectedEventId }) => {
  const event = useMemo(() => 
    timelineData.events.find(e => e.id === selectedEventId), 
    [selectedEventId]
  );
  
  if (!event) return null;
  
  const category = useMemo(() => 
    timelineData.categories.find(c => c.id === event.category),
    [event.category]
  );
  
  return (
    <div className="event-details-panel">
      <div 
        className="category-indicator" 
        style={{ backgroundColor: category ? category.color : '#888' }}
      />
      <h3>{event.title}</h3>
      <div className="event-meta">
        <span className="event-date">{getMonthName(event.month)} {event.year}</span>
        <span className="event-category">{category ? category.name : 'Uncategorized'}</span>
      </div>
      <p className="event-description">{event.description}</p>
      <div className="event-importance">
        Significance: 
        <div className="importance-bar">
          <div 
            className="importance-level" 
            style={{ width: `${event.importance * 10}%`, backgroundColor: category ? category.color : '#888' }}
          />
        </div>
      </div>
    </div>
  );
};



export default EventDetailsPanel; 
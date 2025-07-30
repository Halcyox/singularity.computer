// Main components
import TimelineGallery from './TimelineGallery';
import FramedEvent from './FramedEvent';
import CategoryFilter from './CategoryFilter';
import EventDetailsPanel from './EventDetailsPanel';

// Gallery sub-components
export { 
  GalleryEnvironment, 
  GalleryControls, 
  GalleryCamera, 
  GalleryUI, 
  useGalleryState 
} from './TimelineGallery';

// Frame sub-components
export { 
  FrameGeometry, 
  FrameContent, 
  FrameAnimations, 
  FrameEffects, 
  FRAME_STYLES, 
  useFrameScale, 
  useFrameVisibility 
} from './FramedEvent';

export { 
  TimelineGallery,
  FramedEvent,
  CategoryFilter,
  EventDetailsPanel
};

// Default export
export default TimelineGallery; 
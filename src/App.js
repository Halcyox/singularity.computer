// App.js

import React, { useState } from 'react';
import { TimelineGallery } from './components';
import './components/TimelineGallery.css';

const App = () => {
  const [activeCategories, setActiveCategories] = useState([]);

  // Toggle category filter
  const handleToggleCategory = (categoryId) => {
    if (activeCategories.includes(categoryId)) {
      setActiveCategories(activeCategories.filter(id => id !== categoryId));
    } else {
      setActiveCategories([...activeCategories, categoryId]);
    }
  };

  return (
    <div className="app">
      <TimelineGallery activeCategories={activeCategories} />
      <div className="canvas-overlay"></div>
    </div>
  );
};

export default App;

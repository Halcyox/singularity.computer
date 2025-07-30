import React from 'react';
import './TimelineComponent.css';

const CategoryFilter = ({ categories, activeCategories, onToggleCategory }) => {
  return (
    <div className="category-filters">
      <h4>Filter by Category:</h4>
      <div className="filter-buttons">
        {categories.map(category => (
          <button 
            key={category.id}
            className={`filter-button ${activeCategories.includes(category.id) ? 'active' : ''}`}
            style={{ 
              backgroundColor: activeCategories.includes(category.id) ? category.color : 'transparent',
              borderColor: category.color
            }}
            onClick={() => onToggleCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};



export default CategoryFilter; 
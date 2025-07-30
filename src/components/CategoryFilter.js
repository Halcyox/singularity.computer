import React from 'react';
import PropTypes from 'prop-types';
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

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired,
  activeCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleCategory: PropTypes.func.isRequired
};

export default CategoryFilter; 
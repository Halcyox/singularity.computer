import React from 'react';
import './TimelineSlider.css';

export interface TimelineSliderProps {
  minYear: number;
  maxYear: number;
  value: number;
  onChange: (year: number) => void;
  label?: string;
  'aria-label'?: string;
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  minYear,
  maxYear,
  value,
  onChange,
  label = 'Year',
  'aria-label': ariaLabel = 'Timeline year',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const y = parseInt(e.target.value, 10);
    if (!Number.isNaN(y)) onChange(y);
  };

  return (
    <div className="timeline-slider" role="group" aria-label={ariaLabel}>
      <label className="timeline-slider__label" htmlFor="timeline-year-slider">
        {label}
      </label>
      <div className="timeline-slider__row">
        <span className="timeline-slider__min" aria-hidden>
          {minYear}
        </span>
        <input
          id="timeline-year-slider"
          type="range"
          min={minYear}
          max={maxYear}
          value={value}
          onChange={handleChange}
          className="timeline-slider__input"
          aria-valuemin={minYear}
          aria-valuemax={maxYear}
          aria-valuenow={value}
          aria-valuetext={`${value}`}
        />
        <span className="timeline-slider__max" aria-hidden>
          {maxYear}
        </span>
      </div>
      <output className="timeline-slider__value" htmlFor="timeline-year-slider" aria-live="polite">
        {value}
      </output>
    </div>
  );
};

export default TimelineSlider;

import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import './AxisCorner.css';

export interface AxisCornerProps {
  /** When false, nothing is rendered. */
  visible: boolean;
  /**
   * When true, render via portal to document.body (viewport-fixed, whole page).
   * When false, render in place with absolute positioning inside the graph container.
   * Default true so the axis uses the full viewport and scales with zoom/resize.
   */
  usePortal?: boolean;
  /**
   * Optional scale factor (e.g. from container width). Transform-origin is bottom-left
   * so the axis scales from the corner. Combined with vmin-based CSS for zoom/resize.
   */
  scale?: number;
}

function AxisContent({ scale }: { scale?: number }) {
  const root = (
    <div className="axis-corner-root" role="img" aria-label="Progress scale: Tier 0 to 5 vertical, TRL 1 to 9 horizontal">
      <div className="axis-corner-title">Progress scale</div>
      <div className="axis-corner-layout">
        <div className="axis-corner-spine" aria-hidden="true" />
        <div className="axis-corner-y">
          <span className="axis-corner-caption">Tier</span>
          <div className="axis-corner-ticks axis-corner-ticks-y">
            {[0, 1, 2, 3, 4, 5].map((t) => (
              <span key={t} className="axis-corner-tick">{t}</span>
            ))}
          </div>
        </div>
        <div className="axis-corner-x">
          <span className="axis-corner-caption">TRL</span>
          <div className="axis-corner-ticks axis-corner-ticks-x">
            {[1, 3, 5, 7, 9].map((t) => (
              <span key={t} className="axis-corner-tick">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  if (scale != null && scale > 0 && scale !== 1) {
    return (
      <div className="axis-corner-scale" style={{ transform: `scale(${scale})` }}>
        {root}
      </div>
    );
  }
  return root;
}

/**
 * Tier / TRL scale in the bottom-left of the viewport.
 * Uses the whole page (viewport): portaled to document.body by default, with vmin-based
 * CSS so it scales on window resize and browser zoom. Optional scale prop for container-based scaling.
 */
export const AxisCorner: React.FC<AxisCornerProps> = ({ visible, usePortal = true, scale }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  if (!visible) return null;

  const content = <AxisContent scale={scale} />;

  if (usePortal) {
    return createPortal(content, document.body);
  }

  return (
    <div ref={wrapperRef} className="axis-corner-wrapper">
      {content}
    </div>
  );
};

export default AxisCorner;

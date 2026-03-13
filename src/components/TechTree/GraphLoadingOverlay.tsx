import React from 'react';

export interface GraphLoadingOverlayProps {
  /** When true, the loading overlay is shown. */
  show: boolean;
}

export const GraphLoadingOverlay: React.FC<GraphLoadingOverlayProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="tech-tree-loading" aria-live="polite" aria-busy="true">
      <div className="loading-spinner" aria-hidden />
      <span>Initializing visualization...</span>
    </div>
  );
};

export default GraphLoadingOverlay;

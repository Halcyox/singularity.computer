import React, { useMemo } from 'react';
import { TECH_TREE } from '../../data';
import type { NodeStatus } from '../../types';
import { STATUS_ORDER, STATUS_LABELS, STATUS_COLORS } from '../../constants/status';
import './Header.css';

export type ViewMode = 'graph' | 'embedding';

export interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onFitView?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ viewMode, onViewModeChange, onFitView }) => {
  const { metadata } = TECH_TREE;

  const statusCounts = useMemo(() => {
    const c: Record<NodeStatus, number> = {
      achieved: 0,
      in_progress: 0,
      theoretical: 0,
      speculative: 0,
    };
    TECH_TREE.nodes.forEach((n) => {
      if (c[n.status] !== undefined) c[n.status]++;
    });
    return c;
  }, []);

  return (
    <header className="tech-tree-header">
      <div className="header-brand">
        <h1 className="header-title">
          <span className="title-main">singularity</span>
          <span className="title-dot">.</span>
          <span className="title-tld">computer</span>
        </h1>
        <p className="header-subtitle">
          Tracking humanity's progress toward the technological singularity
        </p>
        <p className="header-progress" aria-live="polite">
          {STATUS_ORDER.map((status, i) => (
            <span key={status} className="header-progress-item">
              {i > 0 && <span className="header-progress-sep"> · </span>}
              <span className="header-progress-dot" style={{ color: STATUS_COLORS[status] }} aria-hidden />
              <span>{STATUS_LABELS[status]} </span>
              <span className="header-progress-count">{statusCounts[status]}</span>
            </span>
          ))}
        </p>
      </div>

      <div className="header-stats">
        <div className="stat">
          <span className="stat-value">{metadata.totalNodes}</span>
          <span className="stat-label">Technologies</span>
        </div>
        <div className="stat">
          <span className="stat-value">{metadata.totalLinks}</span>
          <span className="stat-label">Connections</span>
        </div>
      </div>

      <div className="header-actions">
        <div className="header-view-toggle" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'graph'}
            className={`header-btn ${viewMode === 'graph' ? 'active' : ''}`}
            onClick={() => onViewModeChange('graph')}
            title="Force-directed graph"
          >
            Graph
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'embedding'}
            className={`header-btn ${viewMode === 'embedding' ? 'active' : ''}`}
            onClick={() => onViewModeChange('embedding')}
            title="Embedding-style scatter"
          >
            Embedding
          </button>
        </div>
        <button className="header-btn" onClick={onFitView} title="Reset View">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="header-btn"
          title="GitHub"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>
    </header>
  );
};

export default Header;

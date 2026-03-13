import React, { useRef, useEffect } from 'react';
import { TechNode } from '../../types';
import { DOMAINS } from '../../data/domains';
import { NODE_MAP } from '../../data';
import { STATUS_LABELS, STATUS_COLORS } from '../../constants/status';
import { getNodeTRL } from '../../utils/trl';
import './NodeDetail.css';

export interface NodeDetailProps {
  node: TechNode;
  onClose: () => void;
  /** When provided, dependency and source links become clickable to open that node. */
  onSelectNodeId?: (nodeId: string) => void;
}

export const NodeDetail: React.FC<NodeDetailProps> = ({
  node,
  onClose,
  onSelectNodeId,
}) => {
  const domain = DOMAINS[node.domain];
  const statusColor = STATUS_COLORS[node.status];
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [node.id]);

  return (
    <div ref={panelRef} className="node-detail">
      <button className="node-detail-close" onClick={onClose}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>

      <div className="node-detail-header">
        <span
          className="node-detail-domain"
          style={{ backgroundColor: domain.color }}
        >
          {domain.name}
        </span>
        <h2 className="node-detail-title">{node.name}</h2>
        <p className="node-detail-description">{node.description}</p>
      </div>

      <div className="node-detail-meta">
        <div className="meta-item">
          <span className="meta-label">Status</span>
          <span className="meta-value" style={{ color: statusColor }}>
            {STATUS_LABELS[node.status]}
          </span>
        </div>

        {node.progress !== undefined && (
          <div className="meta-item">
            <span className="meta-label">Progress</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${node.progress}%`,
                  backgroundColor: domain.color
                }}
              />
            </div>
            <span className="meta-value">{node.progress}%</span>
          </div>
        )}

        {node.progressMetric && (
          <div className="meta-item">
            <span className="meta-label">{node.progressMetric}</span>
            <span className="meta-value">{node.progressValue}</span>
          </div>
        )}

        {node.yearAchieved && (
          <div className="meta-item">
            <span className="meta-label">Achieved</span>
            <span className="meta-value">{node.yearAchieved}</span>
          </div>
        )}

        {node.yearEstimated && !node.yearAchieved && (
          <div className="meta-item">
            <span className="meta-label">Estimated</span>
            <span className="meta-value">~{node.yearEstimated}</span>
          </div>
        )}

        <div className="meta-item">
          <span className="meta-label">Tier</span>
          <span className="meta-value">{node.tier}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">TRL</span>
          <span className="meta-value">{getNodeTRL(node)}</span>
        </div>
      </div>

      {node.keyPlayers && node.keyPlayers.length > 0 && (
        <div className="node-detail-section">
          <h3>Key Players</h3>
          <div className="key-players">
            {node.keyPlayers.map((player, idx) => (
              <span key={idx} className="player-tag">{player}</span>
            ))}
          </div>
        </div>
      )}

      {node.milestones && node.milestones.length > 0 && (
        <div className="node-detail-section">
          <h3>Milestones</h3>
          <div className="milestones">
            {node.milestones.map((milestone, idx) => (
              <div key={idx} className="milestone">
                <div className="milestone-date">
                  {new Date(milestone.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="milestone-content">
                  <div className="milestone-title">
                    {milestone.title}
                    {milestone.source && (
                      <a
                        href={milestone.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="milestone-source-link"
                        title="View source"
                        aria-label={`Source for ${milestone.title}`}
                      >
                        <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                  <div className="milestone-description">{milestone.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {node.dependencies && node.dependencies.length > 0 && (
        <div className="node-detail-section">
          <h3>Dependencies</h3>
          <div className="dependencies">
            {node.dependencies.map((depId) => {
              const dep = NODE_MAP.get(depId);
              const label = dep?.name ?? depId;
              if (onSelectNodeId && dep) {
                return (
                  <button
                    key={depId}
                    type="button"
                    className="dep-tag dep-tag-clickable"
                    onClick={() => onSelectNodeId(depId)}
                  >
                    {label}
                  </button>
                );
              }
              return (
                <span key={depId} className="dep-tag">
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {node.sources && node.sources.length > 0 && (
        <div className="node-detail-section">
          <h3>Sources</h3>
          <ul className="sources-list">
            {node.sources.map((source, idx) => (
              <li key={idx}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link"
                >
                  {source.title}
                </a>
                {source.type && (
                  <span className="source-type">{source.type}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NodeDetail;

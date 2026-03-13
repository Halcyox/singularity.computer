import React from 'react';
import { DomainId } from '../../types';
import { DOMAIN_LIST } from '../../data/domains';
import './DomainFilter.css';

export interface DomainFilterProps {
  activeDomains: DomainId[];
  onToggle: (domainId: DomainId) => void;
  onClear: () => void;
}

export const DomainFilter: React.FC<DomainFilterProps> = ({
  activeDomains,
  onToggle,
  onClear,
}) => {
  return (
    <div className="domain-filter">
      <div className="domain-filter-header">
        <span className="domain-filter-title">Domains</span>
        {activeDomains.length > 0 && (
          <button className="domain-filter-clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      <div className="domain-filter-list">
        {DOMAIN_LIST.map(domain => {
          const isActive = activeDomains.length === 0 || activeDomains.includes(domain.id);
          return (
            <button
              key={domain.id}
              className={`domain-filter-item ${isActive ? 'active' : 'inactive'}`}
              onClick={() => onToggle(domain.id)}
              style={{
                '--domain-color': domain.color,
              } as React.CSSProperties}
            >
              <span
                className="domain-indicator"
                style={{ backgroundColor: domain.color }}
              />
              <span className="domain-name">{domain.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DomainFilter;

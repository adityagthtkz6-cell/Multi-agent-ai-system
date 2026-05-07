import React from 'react';

export default function AgentCard({ agent, isActive, onClick, isSelected }) {
  return (
    <div
      onClick={() => onClick(agent.id)}
      style={{
        background: isSelected ? agent.bgColor : '#0d1117',
        border: `1.5px solid ${isSelected ? agent.borderColor : isActive ? agent.color : '#1e293b'}`,
        borderRadius: 12,
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isActive && (
        <span style={{
          position: 'absolute', top: 8, right: 8,
          width: 8, height: 8, borderRadius: '50%',
          background: agent.color,
          boxShadow: `0 0 6px ${agent.color}`,
          animation: 'blink 1s ease-in-out infinite',
        }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>{agent.icon}</span>
        <div>
          <div style={{ color: agent.color, fontWeight: 700, fontSize: 13 }}>{agent.name}</div>
          <div style={{ color: '#64748b', fontSize: 11 }}>{agent.role}</div>
        </div>
      </div>
      <p style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.5 }}>{agent.description}</p>
    </div>
  );
}

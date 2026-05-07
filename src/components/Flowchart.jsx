import React, { useState, useEffect, useRef } from 'react';
import { AGENTS } from '../agentSystem';

const FLOW_EDGES = [
  { from: 'orchestrator', to: 'planner', label: 'Task Brief', color: '#6366f1', curve: -30 },
  { from: 'planner', to: 'orchestrator', label: 'Plan', color: '#06b6d4', curve: 30 },
  { from: 'orchestrator', to: 'researcher', label: 'Query', color: '#6366f1', curve: -30 },
  { from: 'researcher', to: 'orchestrator', label: 'Data', color: '#10b981', curve: 30 },
  { from: 'orchestrator', to: 'executor', label: 'Action', color: '#6366f1', curve: -30 },
  { from: 'executor', to: 'critic', label: 'Draft', color: '#f59e0b', curve: 0 },
  { from: 'critic', to: 'refiner', label: 'Feedback', color: '#ec4899', curve: 0 },
  { from: 'refiner', to: 'critic', label: 'Revised', color: '#a855f7', curve: 40 },
  { from: 'critic', to: 'orchestrator', label: 'PASS ✓', color: '#10b981', curve: 30 },
  { from: 'executor', to: 'error_handler', label: 'Error', color: '#ef4444', curve: 40 },
  { from: 'error_handler', to: 'orchestrator', label: 'Recover', color: '#ef4444', curve: -40 },
  { from: 'orchestrator', to: 'memory', label: 'Store', color: '#64748b', curve: 0 },
  { from: 'memory', to: 'orchestrator', label: 'Recall', color: '#94a3b8', curve: 40 },
];

const NODE_W = 130;
const NODE_H = 60;
const SVG_W = 900;
const SVG_H = 560;

function getPos(agentId) {
  const a = AGENTS[agentId.toUpperCase()] || AGENTS[Object.keys(AGENTS).find(k => AGENTS[k].id === agentId)];
  if (!a) return { x: 0, y: 0 };
  return {
    x: (a.position.x / 100) * SVG_W,
    y: (a.position.y / 100) * SVG_H,
  };
}

function QuadraticEdge({ edge, animated, activeAgents }) {
  const from = getPos(edge.from);
  const to = getPos(edge.to);
  const active = activeAgents.includes(edge.from) || activeAgents.includes(edge.to);

  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * (edge.curve || 0);
  const cy = my + ny * (edge.curve || 0);

  const d = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;

  const dashId = `dash-${edge.from}-${edge.to}`;
  const opacity = active ? 1 : 0.3;

  return (
    <g opacity={opacity}>
      <defs>
        <marker id={`arrow-${edge.from}-${edge.to}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={edge.color} />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={edge.color}
        strokeWidth={active ? 2.5 : 1.5}
        strokeOpacity={0.7}
        markerEnd={`url(#arrow-${edge.from}-${edge.to})`}
        strokeDasharray={active ? "6 3" : "none"}
        style={active ? { animation: `dashMove 1s linear infinite` } : {}}
      />
      {edge.label && (
        <text x={cx} y={cy - 8} fill={edge.color} fontSize="10" textAnchor="middle" fontWeight="600">
          {edge.label}
        </text>
      )}
    </g>
  );
}

function AgentNode({ agent, isActive, isSelected, onClick }) {
  const pos = getPos(agent.id);
  const pulse = isActive;

  return (
    <g
      transform={`translate(${pos.x - NODE_W / 2}, ${pos.y - NODE_H / 2})`}
      onClick={() => onClick(agent.id)}
      style={{ cursor: 'pointer' }}
    >
      {pulse && (
        <rect
          x={-4} y={-4} width={NODE_W + 8} height={NODE_H + 8}
          rx={14} ry={14}
          fill="none"
          stroke={agent.color}
          strokeWidth={2}
          opacity={0.5}
          style={{ animation: 'pulseRing 1.5s ease-out infinite' }}
        />
      )}
      <rect
        x={0} y={0} width={NODE_W} height={NODE_H}
        rx={10} ry={10}
        fill={agent.bgColor}
        stroke={isSelected ? '#ffffff' : agent.borderColor}
        strokeWidth={isSelected ? 2.5 : 1.5}
      />
      <text x={NODE_W / 2} y={22} fill={agent.color} fontSize="18" textAnchor="middle">{agent.icon}</text>
      <text x={NODE_W / 2} y={40} fill="#f1f5f9" fontSize="11" textAnchor="middle" fontWeight="700">
        {agent.name}
      </text>
      <text x={NODE_W / 2} y={54} fill="#94a3b8" fontSize="9" textAnchor="middle">
        {agent.role}
      </text>
    </g>
  );
}

export default function Flowchart({ activeAgents = [], onAgentSelect, selectedAgent }) {
  return (
    <div style={{ position: 'relative', width: '100%', background: '#0d1117', borderRadius: 16, overflow: 'hidden', border: '1px solid #1e293b' }}>
      <style>{`
        @keyframes dashMove { to { stroke-dashoffset: -18; } }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.15); opacity: 0; }
        }
      `}</style>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ display: 'block' }}
      >
        {FLOW_EDGES.map((edge, i) => (
          <QuadraticEdge key={i} edge={edge} animated={true} activeAgents={activeAgents} />
        ))}
        {Object.values(AGENTS).map(agent => (
          <AgentNode
            key={agent.id}
            agent={agent}
            isActive={activeAgents.includes(agent.id)}
            isSelected={selectedAgent === agent.id}
            onClick={onAgentSelect}
          />
        ))}
      </svg>
      <div style={{
        position: 'absolute', bottom: 12, left: 16,
        display: 'flex', gap: 16, flexWrap: 'wrap'
      }}>
        {[
          { color: '#6366f1', label: 'Orchestration' },
          { color: '#10b981', label: 'Return / Pass' },
          { color: '#ec4899', label: 'Feedback Loop' },
          { color: '#ef4444', label: 'Error Flow' },
          { color: '#64748b', label: 'Memory' },
        ].map(l => (
          <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8' }}>
            <span style={{ width: 24, height: 2, background: l.color, display: 'inline-block', borderRadius: 2 }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

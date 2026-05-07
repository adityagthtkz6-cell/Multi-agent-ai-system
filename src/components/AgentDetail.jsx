import React from 'react';

function Tag({ text, color }) {
  return (
    <span style={{
      background: color + '22',
      border: `1px solid ${color}55`,
      color: color,
      borderRadius: 6,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 600,
    }}>
      {text}
    </span>
  );
}

export default function AgentDetail({ agent }) {
  if (!agent) {
    return (
      <div style={{
        background: '#0d1117', border: '1px solid #1e293b', borderRadius: 16,
        padding: 32, textAlign: 'center', color: '#475569',
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>👆</div>
        <div style={{ fontSize: 14 }}>Click any agent in the flowchart or grid to inspect its role, I/O, and decision logic.</div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#0d1117', border: `1.5px solid ${agent.borderColor}`,
      borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{
          fontSize: 36, background: agent.bgColor, border: `1px solid ${agent.borderColor}`,
          borderRadius: 12, width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>{agent.icon}</span>
        <div>
          <h2 style={{ color: agent.color, fontSize: 20, fontWeight: 800 }}>{agent.name}</h2>
          <div style={{ color: '#64748b', fontSize: 12 }}>{agent.role}</div>
        </div>
      </div>

      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, borderLeft: `3px solid ${agent.color}`, paddingLeft: 12 }}>
        {agent.description}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Section title="Inputs" color="#06b6d4" items={agent.inputs} dot="▶" />
        <Section title="Outputs" color="#10b981" items={agent.outputs} dot="◀" />
      </div>

      <div>
        <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: agent.color }}>⚡</span> Decision Logic
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {agent.decisionLogic.map((rule, i) => (
            <div key={i} style={{
              background: agent.bgColor, border: `1px solid ${agent.borderColor}33`,
              borderRadius: 8, padding: '8px 12px',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <span style={{
                background: agent.color + '22', color: agent.color,
                borderRadius: '50%', minWidth: 22, height: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800,
              }}>{i + 1}</span>
              <span style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.6 }}>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ title, color, items, dot }) {
  return (
    <div style={{ background: '#0a0a0f', borderRadius: 10, padding: 14 }}>
      <div style={{ color, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>{dot} {title}</div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item, i) => (
          <li key={i} style={{
            color: '#94a3b8', fontSize: 11,
            paddingLeft: 10, borderLeft: `2px solid ${color}44`,
          }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

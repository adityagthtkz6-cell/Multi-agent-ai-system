import React, { useState, useCallback } from 'react';
import { AGENTS } from './agentSystem';
import Flowchart from './components/Flowchart';
import AgentCard from './components/AgentCard';
import AgentDetail from './components/AgentDetail';
import PipelineSimulator from './components/PipelineSimulator';
import ErrorScalabilityPanel from './components/ErrorScalabilityPanel';

const TABS = [
  { id: 'overview', label: '🗺️ Flowchart', desc: 'Visual Architecture' },
  { id: 'agents', label: '🤖 Agents', desc: 'Roles & Logic' },
  { id: 'simulate', label: '▶ Simulate', desc: 'Live Pipeline' },
  { id: 'resilience', label: '🛡️ Resilience', desc: 'Error & Scale' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeAgents, setActiveAgents] = useState([]);

  const handleAgentSelect = useCallback((id) => {
    setSelectedAgent(prev => prev === id ? null : id);
    if (activeTab !== 'agents') setActiveTab('agents');
  }, [activeTab]);

  const handleActiveAgentsChange = useCallback((agents) => {
    setActiveAgents(agents);
  }, []);

  const selectedAgentData = selectedAgent
    ? Object.values(AGENTS).find(a => a.id === selectedAgent)
    : null;

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      color: '#f1f5f9', fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <header style={{
        borderBottom: '1px solid #1e293b',
        padding: '0 32px',
        background: '#0d1117',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 24, height: 64 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                fontSize: 22, fontWeight: 900, letterSpacing: -0.5,
              }}>
                Multi-Agent AI System
              </span>
              <span style={{
                background: '#6366f122', border: '1px solid #6366f144',
                color: '#818cf8', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700,
              }}>v1.0</span>
            </div>
            <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>
              8 Specialized Agents · Feedback Loops · Error Recovery · Horizontal Scaling
            </div>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: 'none',
                  background: activeTab === tab.id ? '#6366f122' : 'transparent',
                  color: activeTab === tab.id ? '#818cf8' : '#475569',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: 12, cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 32px' }}>

        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { label: 'Active Agents', value: '8', icon: '🤖', color: '#6366f1' },
                { label: 'Feedback Loops', value: '3', icon: '↺', color: '#ec4899' },
                { label: 'Max Refinements', value: '5×', icon: '✨', color: '#a855f7' },
                { label: 'Error Strategies', value: '6', icon: '🛡️', color: '#ef4444' },
              ].map(s => (
                <div key={s.label} style={{
                  background: '#0d1117', border: `1px solid ${s.color}33`,
                  borderRadius: 12, padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <span style={{
                    fontSize: 24, background: s.color + '22',
                    borderRadius: 10, width: 44, height: 44,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{s.icon}</span>
                  <div>
                    <div style={{ color: s.color, fontSize: 24, fontWeight: 900 }}>{s.value}</div>
                    <div style={{ color: '#475569', fontSize: 11 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <Flowchart
              activeAgents={activeAgents}
              onAgentSelect={handleAgentSelect}
              selectedAgent={selectedAgent}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FlowSection title="🔄 Core Pipeline" color="#6366f1" items={[
                'User task → Orchestrator receives & decomposes',
                'Planner builds dependency graph',
                'Researcher fetches relevant context in parallel',
                'Executor performs actions with tool access',
                'Critic evaluates output (score 0-100)',
                'Refiner improves on feedback (up to 5 iterations)',
                'Orchestrator aggregates → delivers final response',
              ]} />
              <FlowSection title="↺ Feedback Loops" color="#ec4899" items={[
                'Loop 1: Critic → Refiner → Critic (quality gate)',
                'Loop 2: Error Handler → Orchestrator (fault recovery)',
                'Loop 3: Memory → All Agents (context enrichment)',
                'Exit condition: Score ≥ 80 OR max 5 iterations',
                'Hard stop: Unrecoverable error → graceful degradation',
                'Human escalation: triggered after 3 consecutive failures',
              ]} />
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ color: '#475569', fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>SELECT AN AGENT</div>
              {Object.values(AGENTS).map(agent => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isActive={activeAgents.includes(agent.id)}
                  isSelected={selectedAgent === agent.id}
                  onClick={handleAgentSelect}
                />
              ))}
            </div>
            <div style={{ position: 'sticky', top: 80 }}>
              <AgentDetail agent={selectedAgentData} />
            </div>
          </div>
        )}

        {activeTab === 'simulate' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Flowchart
                activeAgents={activeAgents}
                onAgentSelect={handleAgentSelect}
                selectedAgent={selectedAgent}
              />
              <AgentDetail agent={selectedAgentData} />
            </div>
            <div style={{ position: 'sticky', top: 80 }}>
              <PipelineSimulator onActiveAgentsChange={handleActiveAgentsChange} />
            </div>
          </div>
        )}

        {activeTab === 'resilience' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <ErrorScalabilityPanel />
          </div>
        )}
      </main>
    </div>
  );
}

function FlowSection({ title, color, items }) {
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${color}33`, borderRadius: 14, padding: 20 }}>
      <div style={{ color, fontWeight: 700, fontSize: 14, marginBottom: 14 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, alignItems: 'flex-start',
            color: '#94a3b8', fontSize: 12, lineHeight: 1.5,
          }}>
            <span style={{ color: color + '99', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

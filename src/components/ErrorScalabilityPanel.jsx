import React, { useState } from 'react';
import { ERROR_STRATEGIES, SCALABILITY_FEATURES } from '../agentSystem';

export default function ErrorScalabilityPanel() {
  const [tab, setTab] = useState('error');

  return (
    <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #1e293b' }}>
        {[
          { id: 'error', label: '🛡️ Error Handling', color: '#ef4444' },
          { id: 'scale', label: '📈 Scalability', color: '#10b981' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '14px 20px', border: 'none',
              background: tab === t.id ? '#0a0a0f' : 'transparent',
              color: tab === t.id ? t.color : '#475569',
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
              borderBottom: tab === t.id ? `2px solid ${t.color}` : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 20 }}>
        {tab === 'error' && (
          <>
            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>
              Every agent failure is intercepted by the <strong style={{ color: '#ef4444' }}>Error Handler</strong> agent. 
              Errors are classified and routed to specific recovery strategies before re-entering the pipeline.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {ERROR_STRATEGIES.map((e, i) => (
                <div key={i} style={{
                  background: '#0a0a0f',
                  border: `1px solid ${e.color}33`,
                  borderRadius: 12, padding: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{e.icon}</span>
                    <span style={{ color: e.color, fontWeight: 700, fontSize: 12 }}>{e.type}</span>
                  </div>
                  <div style={{
                    background: e.color + '15', border: `1px solid ${e.color}33`,
                    borderRadius: 8, padding: '6px 10px',
                    color: '#94a3b8', fontSize: 11,
                  }}>
                    → {e.strategy}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, background: '#1f0a0a', border: '1px solid #ef444433', borderRadius: 12, padding: 16 }}>
              <div style={{ color: '#f87171', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>🔁 Error Flow Sequence</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 12, color: '#94a3b8' }}>
                {['Agent Fails', '→', 'Error Classified', '→', 'Recovery Strategy Applied', '→', 'Retry / Re-route', '→', 'Max retries?', '→', 'Graceful Degradation', '→', 'Incident Log + Alert'].map((item, i) => (
                  <span key={i} style={{ color: item === '→' ? '#475569' : '#f1f5f9', fontWeight: item !== '→' ? 600 : 400 }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'scale' && (
          <>
            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>
              The system is designed for <strong style={{ color: '#10b981' }}>cloud-native horizontal scaling</strong>. 
              Each agent is stateless, independently deployable, and communicates asynchronously.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {SCALABILITY_FEATURES.map((f, i) => (
                <div key={i} style={{
                  background: '#0a0a0f', border: '1px solid #1e293b',
                  borderRadius: 12, padding: 16,
                }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
                  <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{f.title}</div>
                  <div style={{ color: '#64748b', fontSize: 11, lineHeight: 1.6 }}>{f.description}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, background: '#0a1f16', border: '1px solid #10b98133', borderRadius: 12, padding: 16 }}>
              <div style={{ color: '#34d399', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>🏗️ Architecture Stack</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
                {[
                  ['Orchestration', 'Kubernetes + Helm'],
                  ['Messaging', 'Apache Kafka / Redis Streams'],
                  ['Memory', 'Pinecone + Redis Cache'],
                  ['Observability', 'OpenTelemetry + Grafana'],
                  ['LLM Backend', 'OpenAI API / Local vLLM'],
                  ['API Gateway', 'Kong / AWS API Gateway'],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    background: '#0d1117', borderRadius: 8, padding: '8px 12px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    border: '1px solid #1e293b',
                  }}>
                    <span style={{ color: '#64748b' }}>{k}</span>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

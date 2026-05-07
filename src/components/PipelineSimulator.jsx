import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AGENTS, PIPELINE_STEPS } from '../agentSystem';

const TASK_EXAMPLES = [
  'Analyze competitor pricing and generate a strategic report',
  'Write and test a REST API for user authentication',
  'Summarize 50 research papers on quantum computing',
  'Build a data pipeline from CSV to dashboard',
  'Draft a marketing campaign with A/B test variants',
];

export default function PipelineSimulator({ onActiveAgentsChange }) {
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [steps, setSteps] = useState(PIPELINE_STEPS.map(s => ({ ...s, status: 'pending' })));
  const [logs, setLogs] = useState([]);
  const [iterCount, setIterCount] = useState(0);
  const [score, setScore] = useState(null);
  const [taskInput, setTaskInput] = useState(TASK_EXAMPLES[0]);
  const [speed, setSpeed] = useState(1200);
  const logRef = useRef(null);
  const stepRef = useRef(currentStep);
  stepRef.current = currentStep;

  const addLog = useCallback((msg, color = '#94a3b8', icon = '▸') => {
    setLogs(prev => [...prev.slice(-40), { msg, color, icon, ts: Date.now() }]);
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const reset = useCallback(() => {
    setRunning(false);
    setCurrentStep(-1);
    setSteps(PIPELINE_STEPS.map(s => ({ ...s, status: 'pending' })));
    setLogs([]);
    setIterCount(0);
    setScore(null);
    onActiveAgentsChange([]);
  }, [onActiveAgentsChange]);

  const runSimulation = useCallback(async () => {
    reset();
    await new Promise(r => setTimeout(r, 100));
    setRunning(true);

    const stepData = PIPELINE_STEPS.map(s => ({ ...s, status: 'pending' }));
    setSteps([...stepData]);

    const agentKeys = Object.values(AGENTS).map(a => a.id);
    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    for (let i = 0; i < stepData.length; i++) {
      const step = stepData[i];
      const agent = Object.values(AGENTS).find(a => a.id === step.agent);

      stepData[i] = { ...step, status: 'active' };
      setSteps([...stepData]);
      setCurrentStep(i);
      onActiveAgentsChange([step.agent]);
      addLog(`[Step ${step.step}] ${agent.icon} ${agent.name}: ${step.action}`, agent.color, '►');

      await delay(speed * 0.4);
      addLog(`   └─ ${step.detail}`, '#64748b', '');
      await delay(speed * 0.6);

      if (step.agent === 'critic') {
        const simulatedScore = Math.floor(Math.random() * 40) + 55;
        setScore(simulatedScore);

        if (simulatedScore < 80) {
          addLog(`   ✗ Quality score: ${simulatedScore}/100 → Triggering REFINE loop`, '#ec4899', '⚠');
          const iters = Math.floor(Math.random() * 2) + 1;

          for (let iter = 1; iter <= iters; iter++) {
            setIterCount(iter);
            onActiveAgentsChange(['critic', 'refiner']);
            addLog(`   🔄 Refinement iteration ${iter}/${iters}`, '#a855f7', '↺');
            await delay(speed * 0.8);
            const newScore = simulatedScore + iter * 8 + Math.floor(Math.random() * 5);
            setScore(Math.min(newScore, 97));
            addLog(`   ✓ Revised score: ${Math.min(newScore, 97)}/100`, '#a855f7', '');
            await delay(speed * 0.5);
          }

          addLog(`   ✓ Score passed threshold after ${iters} refinements`, '#10b981', '✓');
        } else {
          addLog(`   ✓ Quality score: ${simulatedScore}/100 → PASS`, '#10b981', '✓');
        }
      }

      if (step.agent === 'executor' && Math.random() < 0.25) {
        const errAgent = Object.values(AGENTS).find(a => a.id === 'error_handler');
        onActiveAgentsChange(['executor', 'error_handler']);
        addLog(`   ⚠ Transient error detected → ${errAgent.icon} Error Handler activated`, '#ef4444', '🛡');
        await delay(speed * 0.7);
        addLog(`   ✓ Recovery applied: Retry with backoff`, '#f87171', '');
        await delay(speed * 0.3);
      }

      stepData[i] = { ...stepData[i], status: 'done' };
      setSteps([...stepData]);
    }

    onActiveAgentsChange([]);
    addLog('✅ Pipeline complete. Final response delivered.', '#10b981', '✅');
    setCurrentStep(-1);
    setRunning(false);
  }, [reset, speed, addLog, onActiveAgentsChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 14, padding: 20 }}>
        <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🎮</span> Pipeline Simulator
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#64748b', fontSize: 11, marginBottom: 4, display: 'block' }}>TASK INPUT</label>
          <select
            value={taskInput}
            onChange={e => setTaskInput(e.target.value)}
            disabled={running}
            style={{
              width: '100%', background: '#0a0a0f', border: '1px solid #1e293b',
              borderRadius: 8, padding: '8px 12px', color: '#f1f5f9', fontSize: 12,
              outline: 'none',
            }}
          >
            {TASK_EXAMPLES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
          <label style={{ color: '#64748b', fontSize: 11, whiteSpace: 'nowrap' }}>SPEED</label>
          <input
            type="range" min={400} max={2500} step={100} value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            disabled={running}
            style={{ flex: 1 }}
          />
          <span style={{ color: '#94a3b8', fontSize: 11, minWidth: 50 }}>
            {speed > 1800 ? 'Slow' : speed > 900 ? 'Normal' : 'Fast'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={running ? reset : runSimulation}
            style={{
              flex: 1, padding: '10px 20px', borderRadius: 10, border: 'none',
              background: running ? '#ef444433' : '#6366f1',
              color: running ? '#ef4444' : '#fff',
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {running ? '⏹ Stop' : '▶ Run Simulation'}
          </button>
          {!running && currentStep === -1 && logs.length > 0 && (
            <button
              onClick={reset}
              style={{
                padding: '10px 16px', borderRadius: 10, border: '1px solid #1e293b',
                background: 'transparent', color: '#64748b', fontWeight: 600, fontSize: 12, cursor: 'pointer',
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 14, padding: 20 }}>
        <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📋 Execution Pipeline</span>
          {score !== null && (
            <span style={{
              background: score >= 80 ? '#10b98133' : '#ec489933',
              color: score >= 80 ? '#34d399' : '#f472b6',
              borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 800,
            }}>
              Score: {score}/100
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {steps.map((step, i) => {
            const agent = Object.values(AGENTS).find(a => a.id === step.agent);
            const status = step.status;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: status === 'active' ? agent.bgColor : status === 'done' ? '#0a150a' : '#0a0a0f',
                border: `1px solid ${status === 'active' ? agent.borderColor : status === 'done' ? '#16532433' : '#1e293b'}`,
                borderRadius: 10, padding: '8px 12px',
                transition: 'all 0.3s',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: status === 'done' ? '#16a34a33' : status === 'active' ? agent.color + '33' : '#1e293b',
                  border: `1.5px solid ${status === 'done' ? '#16a34a' : status === 'active' ? agent.color : '#334155'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: status === 'done' ? '#4ade80' : status === 'active' ? agent.color : '#475569',
                  fontWeight: 800, flexShrink: 0,
                }}>
                  {status === 'done' ? '✓' : status === 'active' ? '●' : step.step}
                </div>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{agent.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: status === 'active' ? agent.color : status === 'done' ? '#4ade80' : '#64748b', fontSize: 12, fontWeight: 700 }}>
                    {step.action}
                  </div>
                  <div style={{ color: '#475569', fontSize: 10 }}>{agent.name}</div>
                </div>
                {status === 'active' && (
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', background: agent.color,
                    animation: 'blink 0.8s ease-in-out infinite',
                  }} />
                )}
              </div>
            );
          })}
        </div>
        {iterCount > 0 && (
          <div style={{
            marginTop: 10, background: '#160a2e', border: '1px solid #a855f744',
            borderRadius: 8, padding: '6px 12px', color: '#c084fc', fontSize: 11,
          }}>
            ↺ Refinement iterations: {iterCount} / 5 max
          </div>
        )}
      </div>

      <div style={{
        background: '#0a0a0f', border: '1px solid #1e293b', borderRadius: 14,
        padding: 16, fontFamily: 'monospace', fontSize: 11,
        maxHeight: 220, overflowY: 'auto',
      }} ref={logRef}>
        <div style={{ color: '#475569', marginBottom: 8, fontSize: 10, letterSpacing: 1 }}>EXECUTION LOG</div>
        {logs.length === 0 ? (
          <div style={{ color: '#334155' }}>Run the simulation to see live logs...</div>
        ) : (
          logs.map((l, i) => (
            <div key={i} style={{ color: l.color, marginBottom: 2, display: 'flex', gap: 6 }}>
              {l.icon && <span style={{ flexShrink: 0 }}>{l.icon}</span>}
              <span>{l.msg}</span>
            </div>
          ))
        )}
      </div>

      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  );
}

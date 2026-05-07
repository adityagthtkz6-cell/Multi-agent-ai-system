# 🧠 Multi-Agent AI System

A fully interactive, visual multi-agent AI system built with React — featuring a live pipeline simulator, SVG flowchart, per-agent decision logic inspector, error handling strategies, and a scalability architecture panel.

![Multi-Agent AI System](https://img.shields.io/badge/React-18.2-61dafb?logo=react) ![License](https://img.shields.io/badge/license-MIT-green) ![Status](https://img.shields.io/badge/status-active-brightgreen)

---

## 🚀 Live Demo

```
npm install
npm start
```
Opens at **http://localhost:3000**

---

## 🏗️ Architecture Overview

The system is composed of **8 specialized agents** that collaborate through a structured pipeline with feedback loops, error recovery, and persistent memory.

```
User Task
    │
    ▼
┌─────────────────────────────────────────────┐
│              🧠 ORCHESTRATOR                │
│  Decomposes task → routes → aggregates      │
└───┬──────────────┬──────────────┬───────────┘
    │              │              │
    ▼              ▼              ▼
📋 Planner    🔍 Researcher   ⚙️ Executor
    │              │              │
    └──────────────┴──────┬───────┘
                          │
                          ▼
                   🔬 Critic / Verifier
                    Score 0–100
                   /            \
              PASS ✓         REFINE (↺ up to 5×)
                   \            /
                    ✨ Refiner
                          │
                          ▼
                  🧠 Orchestrator
                  Final Response
                          │
                          ▼
                   💾 Memory Store
```

**Error path:** Any agent failure → `🛡️ Error Handler` → classify → recover → re-enter pipeline

---

## 🤖 Agent Roster

| Agent | Role | Key Decision Logic |
|---|---|---|
| 🧠 **Orchestrator** | Master Controller | Decomposes tasks, routes subtasks, drives feedback loop |
| 📋 **Planner** | Strategic Decomposer | Builds dependency DAG, estimates steps & resources |
| 🔍 **Researcher** | Information Retrieval | Parallel KB + API search, ranks by relevance × confidence |
| ⚙️ **Executor** | Task Performer | Code gen, API calls, tool execution with 30s timeout watchdog |
| 🔬 **Critic / Verifier** | Quality Gate | Scores output 0–100 → `PASS` ≥80 / `REFINE` 60–79 / `REJECT` <60 |
| ✨ **Refiner** | Iterative Improver | Targeted patch or full regen based on Critic feedback (max 5 iterations) |
| 🛡️ **Error Handler** | Fault Recovery | Classifies errors → retry / re-route / defer / graceful degradation |
| 💾 **Memory Store** | Persistent Context | Short-term buffer (last 20) + long-term vector DB with semantic retrieval |

---

## 🔄 Feedback Loops

1. **Quality Loop** — `Executor → Critic → Refiner → Critic` — repeats until score ≥ 80 or max 5 iterations
2. **Error Recovery Loop** — `Agent Failure → Error Handler → Orchestrator` — retries with exponential backoff
3. **Memory Context Loop** — `All Agents ↔ Memory Store` — enriches every agent with historical context

---

## 🛡️ Error Handling Strategies

| Error Type | Recovery Strategy |
|---|---|
| Transient Failure | Exponential Backoff Retry (1s → 2s → 4s) |
| Logic Error | Re-route to Alternate Agent Instance |
| Timeout | Partial Result + Continuation Token |
| Resource Exhaustion | Queue Deferral + Load Balancer |
| Hallucination Detected | Force Researcher Verification |
| Max Iterations Exceeded | Graceful Degradation + Human Escalation |

---

## 📈 Scalability Design

| Concern | Solution |
|---|---|
| **Agent Scaling** | Stateless microservices — Kubernetes auto-scales by queue depth |
| **Decoupling** | Async messaging via Apache Kafka / Redis Streams |
| **Routing** | Dynamic capability registry tracks agent load & skills |
| **Fault Isolation** | Circuit Breaker pattern prevents cascading failures |
| **Memory** | Sharded vector DB (Pinecone/Weaviate) with quorum reads |
| **Observability** | OpenTelemetry traces → Grafana + Jaeger dashboards |

### Tech Stack
```
Orchestration   →  Kubernetes + Helm
Messaging       →  Apache Kafka / Redis Streams
Memory          →  Pinecone + Redis Cache
Observability   →  OpenTelemetry + Grafana
LLM Backend     →  OpenAI API / Local vLLM
API Gateway     →  Kong / AWS API Gateway
```

---

## 🖥️ UI Tabs

| Tab | Description |
|---|---|
| **🗺️ Flowchart** | Animated SVG architecture diagram — click any node to inspect the agent |
| **🤖 Agents** | Full detail panel: inputs, outputs, numbered decision logic per agent |
| **▶ Simulate** | Live pipeline runner — real-time logs, quality scoring, refinement counter, random error injection |
| **🛡️ Resilience** | Error classification matrix + scalability architecture reference |

---

## 📁 Project Structure

```
├── public/
│   └── index.html
├── src/
│   ├── App.js                          # Main layout, tab routing, state
│   ├── agentSystem.js                  # Agent definitions, flows, pipeline steps
│   ├── index.js
│   └── components/
│       ├── Flowchart.jsx               # SVG flowchart with animated edges
│       ├── AgentCard.jsx               # Compact agent card for grid view
│       ├── AgentDetail.jsx             # Full agent inspector panel
│       ├── PipelineSimulator.jsx       # Live step-by-step simulation engine
│       └── ErrorScalabilityPanel.jsx   # Error strategies + scalability features
├── package.json
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js ≥ 16
- npm ≥ 8

### Install & Run
```bash
git clone https://github.com/adityagthtkz6-cell/Multi-agent-ai-system.git
cd Multi-agent-ai-system
npm install
npm start
```

### Build for Production
```bash
npm run build
```

---

## 📄 License

MIT — free to use, modify, and distribute.

---

> Built with React 18 · Lucide Icons · Pure CSS animations · No external charting libraries

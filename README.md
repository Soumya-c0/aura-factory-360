# Aura Factory 360

An AI-powered Industrial IoT command center for predictive maintenance, real-time machine monitoring, intelligent knowledge retrieval and production optimization.

---

## Overview

Modern manufacturing plants often rely on manual maintenance, resulting in unexpected downtime, expensive repairs and inefficient production schedules. Operating knowledge is buried inside lengthy Standard Operating Procedures (SOPs), making troubleshooting slow and dependent on experienced personnel.

Aura Factory 360 is a closed-loop Industrial IoT platform that transforms factory operations from reactive monitoring into proactive AI-assisted decision making.

The platform continuously monitors machine telemetry, detects performance drift using scientific computing, retrieves relevant maintenance procedures using Retrieval-Augmented Generation (RAG), optimizes production scheduling through heuristic algorithms and provides an interactive spatial digital twin for maintenance engineers.

---

# Key Features

### Live Telemetry Analytics
- Real-time machine telemetry visualization
- Continuous EKG-style monitoring dashboards
- Multi-variable sensor correlation
- Scientific drift detection using SciPy
- Live WebSocket updates

---

### AI Knowledge Retrieval
- Autonomous SOP ingestion
- Semantic document search
- Retrieval-Augmented Generation (RAG)
- Vector database powered knowledge retrieval
- Instant maintenance recommendations

---

### Predictive Bin-Packing Engine
- Heuristic production scheduling
- Workload optimization
- Energy-aware production planning
- Off-peak grid hour scheduling
- Intelligent batch allocation

---

### Spatial AR Twin
- Interactive factory visualization
- Browser-based Augmented Reality
- Hardware-independent overlays
- Live maintenance guidance
- Mobile WebRTC camera support

---

# System Architecture

```text
                Physical Factory Floor
                  (PLCs & IoT Sensors)
                           │
                     MQTT Telemetry
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                  Python Backend Services                     │
│--------------------------------------------------------------│
│ • InfluxDB Time-Series Storage                               │
│ • Redis Pub/Sub                                              │
│ • SciPy Drift Detection Engine                               │
│ • Heuristic Optimization Engine                              │
│ • RAG Pipeline + Vector Database                             │
└──────────────────────────────────────────────────────────────┘
                           │
                WebSocket / JSON Stream
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                  React Operations Dashboard                  │
├──────────────────────────────────────────────────────────────┤
│ • Live Telemetry Analytics                                   │
│ • Active Asset Ledger                                        │
│ • Predictive Bin-Packing                                     │
│ • Spatial AR Twin                                            │
└──────────────────────────────────────────────────────────────┘
                           │
                    Secure Vite SSL Tunnel
                           │
                           ▼
                 Mobile AR (WebRTC Camera)
```

---

# System Modules

| Module | Core Functionality | Technologies |
|---------|-------------------|--------------|
| **Live Telemetry Analytics** | Continuous telemetry visualization, multi-variable correlation, real-time drift prediction | React, WebSockets, Python, SciPy |
| **Active Asset Ledger** | Semantic SOP retrieval, autonomous knowledge lookup, AI-assisted maintenance | LLMs, Vector Databases, RAG |
| **Spatial AR Twin** | Browser-based augmented reality overlays for maintenance workflows | HTML5, CSS3D, WebRTC, Vite SSL |
| **Predictive Bin-Packing** | Intelligent workload scheduling and production optimization | Python, Heuristic Algorithms |

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts

## Backend

- Python
- SciPy
- Redis Pub/Sub
- MQTT
- InfluxDB

## AI

- Large Language Models (LLMs)
- Retrieval-Augmented Generation (RAG)
- Vector Databases
- Semantic Search

## Spatial Computing

- HTML5 getUserMedia API
- WebRTC
- CSS3D
- LocalStorage Synchronization

---

# Core Workflow

1. Factory PLCs continuously stream telemetry through MQTT.
2. The Python backend stores telemetry in InfluxDB.
3. The SciPy engine compares live machine signatures against baseline operating profiles.
4. Machine drift is detected and scored in real time.
5. The RAG engine searches indexed SOPs to retrieve relevant maintenance procedures.
6. The heuristic optimizer schedules workloads for energy-efficient production.
7. Results are streamed to the React dashboard over WebSockets.
8. Engineers can inspect equipment through the Spatial AR Twin on mobile devices.

---

# Run the Project

## Clone the repository

```bash
git clone https://github.com/Soumya-c0/aura-factory-360.git
cd aura-factory-360
```

## Start the backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

## Start the frontend

```bash
cd frontend
npm install
npm run dev -- --host
```

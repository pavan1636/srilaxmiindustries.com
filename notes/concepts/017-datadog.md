# CONCEPT 017 — What is Datadog?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Datadog is a cloud monitoring and observability platform.
It collects metrics, logs, and traces from your infrastructure
and displays them on real-time dashboards with alerting.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE PROBLEM IT SOLVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Without monitoring:
    Server crashes at 3am → nobody knows until customers complain
    Memory leak slowly eats RAM → sudden crash with no warning
    Container restarts silently → data corruption, dropped requests

  With Datadog:
    Dashboard shows CPU, memory, and container health in real-time
    Alerts fire immediately when something goes wrong
    Logs aggregated in one place (not SSHing into each container)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Running servers without monitoring = driving a car without a dashboard
  You don't know your speed, fuel level, or engine temperature
  until something explodes.

  Datadog = the full dashboard with gauges, warning lights, and alarms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Datadog Agent runs as a container alongside your application
  2. It collects data via Docker socket (/var/run/docker.sock)
  3. DD_SITE must match your Datadog account region (EU vs US)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Docker Compose Stack
  ┌─────────────────────────────────┐
  │  frontend │ backend │ db        │
  │     ▼          ▼        ▼       │
  │  ┌──────────────────────────┐   │
  │  │  Datadog Agent           │   │
  │  │  /var/run/docker.sock    │───┼──► Datadog Cloud
  │  │  /proc/ (host metrics)   │   │    Dashboard
  │  │  /sys/fs/cgroup/         │   │    Alerts
  │  └──────────────────────────┘   │
  └─────────────────────────────────┘

  Collects: CPU, Memory, Network I/O, Container events, Logs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Service: datadog-agent in docker-compose.yml
  Image: gcr.io/datadoghq/agent:7
  Config: DD_API_KEY from .env, DD_SITE=datadoghq.eu
  Mounts: docker.sock (container metrics), /proc (host CPU/RAM)
  Logs: DD_LOGS_ENABLED=true, collects from ALL containers
  Excludes: Itself (DD_CONTAINER_EXCLUDE=name:srilaxmi-datadog)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"In Sri Laxmi Industries, I deployed a Datadog Agent as a fourth
container in the Docker Compose stack. It mounts the Docker socket
to collect container-level CPU, memory, and network metrics, plus
/proc and /sys for host-level system stats. Logs are aggregated
from all containers and streamed to the Datadog Cloud dashboard.
I configured DD_SITE to datadoghq.eu since our Datadog account is
on the European servers."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Using DD_SITE=datadoghq.com when your account is on EU servers
✅ Datadog has separate US and EU endpoints. If your account was
   created on the EU site, you must set DD_SITE=datadoghq.eu or
   the agent will silently fail to connect.

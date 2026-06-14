# CONCEPT 007 — What is a Dockerfile?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A Dockerfile is a text file containing step-by-step instructions
to build a Docker image from scratch. Each line is one instruction.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Dockerfile = a recipe card for baking a cake
  Docker image = the finished cake sitting in the fridge
  Docker container = cutting a slice and eating it (running instance)

  The recipe (Dockerfile) tells Docker:
    "Start with flour (base image), add eggs (copy code),
     mix and bake (install dependencies), serve (run command)"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. FROM sets the base image (node:18-alpine, nginx:alpine)
  2. COPY moves your source code into the image
  3. CMD defines what runs when the container starts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MULTI-STAGE BUILDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  A multi-stage Dockerfile has multiple FROM statements.
  Stage 1 (builder): Install all dependencies, compile code
  Stage 2 (runner): Copy ONLY the compiled output, skip dev tools

  Result: Final image is much smaller and more secure.
  Example: 1GB dev image → 30MB production image

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAM — BACKEND DOCKERFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Stage 1: builder
  ┌─────────────────────────────┐
  │ FROM node:18-alpine         │
  │ COPY package*.json ./       │
  │ RUN npm ci --only=production│  ← Install deps only
  └──────────┬──────────────────┘
             │ COPY node_modules
  Stage 2: runner
  ┌──────────▼──────────────────┐
  │ FROM node:18-alpine         │
  │ COPY --from=builder ...     │  ← Only production deps
  │ COPY . .                    │  ← Application code
  │ USER node                   │  ← Non-root user
  │ HEALTHCHECK /api/health     │
  │ CMD ["node", "server.js"]   │
  └─────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  backend/Dockerfile:
    Multi-stage build (builder + runner)
    Runs as non-root "node" user (security hardening)
    Healthcheck hits /api/health every 30 seconds
    Exposes port 3000

  frontend/Dockerfile:
    Single-stage (no build step needed for static HTML/CSS/JS)
    Uses nginx:alpine as base image
    Copies website files + custom nginx.conf
    Exposes port 80

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"In Sri Laxmi Industries, I wrote multi-stage Dockerfiles for the
backend. The first stage installs production dependencies using
npm ci, and the second stage copies only the node_modules and
application code into a clean Alpine image. The container runs as
the non-root 'node' user to implement least-privilege security.
I also added a HEALTHCHECK directive that polls /api/health every
30 seconds to verify the Express server is responsive."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Running containers as root (the default)
✅ Always add USER node (or USER nginx) in production Dockerfiles.
   If an attacker breaks out of the container, they land as a
   restricted user, not root on the host machine.

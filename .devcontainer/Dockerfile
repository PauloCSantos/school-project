FROM mcr.microsoft.com/devcontainers/javascript-node:20-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends bubblewrap \
    && corepack enable \
    && npm install -g @openai/codex \
    && rm -rf /var/lib/apt/lists/*
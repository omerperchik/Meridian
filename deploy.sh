#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────
# Meridian VPS deploy script
#
# What it does:
#   1. Installs Node.js 20 (if missing)
#   2. Clones/updates omerperchik/Meridian into ~/meridian
#   3. Runs `npm install --omit=dev` + `npm run build`
#   4. Installs a systemd service that runs `next start -p 4040`
#   5. Enables + starts the service so it survives reboots
#
# Usage:
#   curl -fsSL https://your.host/deploy-meridian.sh | bash
#   — or —
#   chmod +x deploy-meridian.sh && ./deploy-meridian.sh
#
# Re-run any time to pull the latest main and rebuild.
#
# Supports: Ubuntu/Debian + systemd. Works as root or a sudoer.
# ─────────────────────────────────────────────────────────────────────────

set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/omerperchik/Meridian.git}"
APP_DIR="${APP_DIR:-$HOME/meridian}"
PORT="${PORT:-4040}"
SERVICE_NAME="${SERVICE_NAME:-meridian}"
NODE_MAJOR="${NODE_MAJOR:-20}"

# Colors for output
BLUE=$'\033[0;34m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[0;33m'
RED=$'\033[0;31m'
NC=$'\033[0m'

log()  { echo "${BLUE}▸${NC} $*"; }
ok()   { echo "${GREEN}✓${NC} $*"; }
warn() { echo "${YELLOW}!${NC} $*"; }
err()  { echo "${RED}✗${NC} $*" >&2; }

SUDO=""
if [ "$EUID" -ne 0 ]; then
  if command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
  else
    err "Run as root, or install sudo."
    exit 1
  fi
fi

RUN_USER="${SUDO_USER:-$USER}"
RUN_GROUP=$(id -gn "$RUN_USER")

# ── 1. System deps ──────────────────────────────────────────────────────
log "Checking system packages…"
if ! command -v git >/dev/null || ! command -v curl >/dev/null; then
  $SUDO apt-get update -y
  $SUDO apt-get install -y git curl ca-certificates
fi
ok "git + curl present"

# ── 2. Node.js 20 ───────────────────────────────────────────────────────
install_node=0
if ! command -v node >/dev/null; then
  install_node=1
else
  current="$(node -v | sed 's/v//; s/\..*//')"
  if [ "$current" -lt "$NODE_MAJOR" ]; then
    warn "Node $current is below required $NODE_MAJOR — upgrading"
    install_node=1
  fi
fi

if [ "$install_node" -eq 1 ]; then
  log "Installing Node.js $NODE_MAJOR via NodeSource…"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | $SUDO -E bash -
  $SUDO apt-get install -y nodejs
fi
ok "Node $(node -v), npm $(npm -v)"

# ── 3. Clone / update repo ──────────────────────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
  log "Updating $APP_DIR…"
  git -C "$APP_DIR" fetch --depth=1 origin main
  git -C "$APP_DIR" reset --hard origin/main
else
  log "Cloning $REPO_URL → $APP_DIR"
  git clone --depth=1 "$REPO_URL" "$APP_DIR"
fi
ok "Repo at $(git -C "$APP_DIR" rev-parse --short HEAD)"

# ── 4. Install + build ──────────────────────────────────────────────────
log "Installing dependencies…"
cd "$APP_DIR"
npm install --no-audit --no-fund

# Optional: run migrations if DATABASE_URL is configured
if [ -f "${APP_DIR}/.env.local" ]; then
  # shellcheck disable=SC1091
  set -a; . "${APP_DIR}/.env.local"; set +a
fi
if [ -n "${DATABASE_URL:-}" ]; then
  log "DATABASE_URL detected — applying migrations"
  if ls db/migrations/*.sql >/dev/null 2>&1; then
    npm run db:migrate || warn "migration run failed (continuing)"
    # Seed only if registry table is empty (idempotent otherwise)
    npm run db:seed || warn "seed run failed (continuing)"
  else
    warn "no migrations found — run 'npm run db:generate' in a dev checkout to create them"
  fi
else
  warn "DATABASE_URL not set — site will serve the static TypeScript fixtures."
  warn "  Provision free Postgres at https://neon.tech and put DATABASE_URL in ~/meridian/.env.local"
fi

log "Building production bundle… (first run takes ~60s)"
NODE_ENV=production npm run build
ok "Build complete"

# ── 5. systemd service ──────────────────────────────────────────────────
NODE_PATH="$(command -v node)"
NPM_PATH="$(command -v npm)"

log "Installing systemd service: $SERVICE_NAME"
$SUDO tee "/etc/systemd/system/${SERVICE_NAME}.service" > /dev/null <<EOF
[Unit]
Description=Meridian (Next.js) — The Operating Standard for AI Agents
After=network.target

[Service]
Type=simple
User=${RUN_USER}
Group=${RUN_GROUP}
WorkingDirectory=${APP_DIR}
Environment=NODE_ENV=production
Environment=PORT=${PORT}
Environment=PATH=$(dirname "$NODE_PATH"):/usr/local/bin:/usr/bin:/bin
EnvironmentFile=-${APP_DIR}/.env.local
ExecStart=${NPM_PATH} run start -- -p ${PORT}
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

# Hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=read-only
ReadWritePaths=${APP_DIR}
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF

$SUDO systemctl daemon-reload
$SUDO systemctl enable "$SERVICE_NAME" >/dev/null 2>&1 || true
$SUDO systemctl restart "$SERVICE_NAME"

# ── 6. Wait for port and verify ─────────────────────────────────────────
log "Waiting for port $PORT to open…"
for i in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${PORT}/llms.txt" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if curl -fsS "http://127.0.0.1:${PORT}/llms.txt" >/dev/null 2>&1; then
  ok "Meridian is live on port ${PORT}"
else
  err "Service did not come up in 30s. Last logs:"
  $SUDO journalctl -u "$SERVICE_NAME" --no-pager -n 30
  exit 1
fi

# ── 7. Summary ──────────────────────────────────────────────────────────
echo
echo "────────────────────────────────────────────────────────────"
echo "  ${GREEN}Meridian deployed${NC}"
echo "────────────────────────────────────────────────────────────"
echo "  Local URL:  http://127.0.0.1:${PORT}"
echo "  Logs:       sudo journalctl -u ${SERVICE_NAME} -f"
echo "  Restart:    sudo systemctl restart ${SERVICE_NAME}"
echo "  Stop:       sudo systemctl stop ${SERVICE_NAME}"
echo "  Update:     re-run this script"
echo
echo "  If you want it reachable on the public internet:"
echo "    • Open port ${PORT} in your firewall, OR"
echo "    • Put Caddy/Nginx in front on 80/443 and proxy to :${PORT}"
echo "────────────────────────────────────────────────────────────"

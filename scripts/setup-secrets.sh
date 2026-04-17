#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
# Meridian — GitHub Actions secrets setup
#
# Pushes the four required secrets to this repo so the cron workflows
# (crawler, scoring, anti-ring, embeddings, arena-runner, webhook-drain)
# can read them.
#
# Reads values in this priority:
#   1. $DATABASE_URL / $ADMIN_TOKEN / $MERIDIAN_URL / $GITHUB_DISCOVERY_TOKEN env vars
#   2. $APP_DIR/.env.local (from setup-neon.sh)
#   3. Prompts you interactively
#
# Requires: gh CLI (https://cli.github.com/) logged in as the repo owner.
# ─────────────────────────────────────────────────────────────────────
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/meridian}"
REPO="${REPO:-omerperchik/Meridian}"

BLUE=$'\033[0;34m'; GREEN=$'\033[0;32m'; YELLOW=$'\033[0;33m'; RED=$'\033[0;31m'; NC=$'\033[0m'
log(){ echo "${BLUE}▸${NC} $*"; }
ok(){ echo "${GREEN}✓${NC} $*"; }
warn(){ echo "${YELLOW}!${NC} $*"; }
err(){ echo "${RED}✗${NC} $*" >&2; }

if ! command -v gh >/dev/null 2>&1; then
  err "gh CLI not found. Install from https://cli.github.com/"
  exit 1
fi
if ! gh auth status >/dev/null 2>&1; then
  err "gh not authenticated. Run: gh auth login"
  exit 1
fi

# Source local env if present (non-destructive)
if [ -f "$APP_DIR/.env.local" ]; then
  set -a; . "$APP_DIR/.env.local"; set +a
fi

prompt() {
  local var="$1" label="$2" default="${3:-}"
  local existing="${!var:-$default}"
  if [ -z "$existing" ]; then
    read -r -p "$label: " val
    printf -v "$var" "%s" "$val"
  else
    echo "  $label: using existing value (${existing:0:6}…)"
  fi
}

log "Collecting values…"
prompt DATABASE_URL "DATABASE_URL (from setup-neon.sh)"
prompt ADMIN_TOKEN "ADMIN_TOKEN (from setup-neon.sh)"
prompt MERIDIAN_URL "MERIDIAN_URL (public URL of your deployment)" "${NEXT_PUBLIC_SITE_URL:-}"
prompt GH_DISCOVERY_TOKEN "GH_DISCOVERY_TOKEN (GitHub PAT with public_repo) — optional, press Enter to skip"

if [ -z "${DATABASE_URL:-}" ] || [ -z "${ADMIN_TOKEN:-}" ] || [ -z "${MERIDIAN_URL:-}" ]; then
  err "DATABASE_URL, ADMIN_TOKEN, and MERIDIAN_URL are required. Aborting."
  exit 1
fi

push_secret() {
  local name="$1" value="$2"
  if [ -z "$value" ]; then
    warn "skip $name (empty)"
    return
  fi
  printf "%s" "$value" | gh secret set "$name" --repo "$REPO" --body -
  ok "set $name"
}

log "Pushing secrets to $REPO…"
push_secret DATABASE_URL "$DATABASE_URL"
push_secret ADMIN_TOKEN "$ADMIN_TOKEN"
push_secret MERIDIAN_URL "$MERIDIAN_URL"
push_secret GH_DISCOVERY_TOKEN "${GH_DISCOVERY_TOKEN:-}"

# Optional: embedding providers — won't error if you skip these
if [ -n "${OPENAI_API_KEY:-}" ]; then
  push_secret OPENAI_API_KEY "$OPENAI_API_KEY"
fi
if [ -n "${VOYAGE_API_KEY:-}" ]; then
  push_secret VOYAGE_API_KEY "$VOYAGE_API_KEY"
fi

echo
echo "────────────────────────────────────────────────────────────"
echo "${GREEN}  Secrets configured${NC}"
echo "────────────────────────────────────────────────────────────"
echo "  The 6 cron workflows will pick them up on their next run."
echo "  Trigger one now to verify:"
echo "    gh workflow run crawl.yml --repo $REPO"
echo "    gh run watch --repo $REPO"
echo "────────────────────────────────────────────────────────────"

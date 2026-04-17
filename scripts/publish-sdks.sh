#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
# Meridian — publish SDKs to npm + PyPI
#
# Assumes:
#   - You are logged in to npm (`npm whoami`) with publish rights to @meridian
#   - You have a PyPI API token (set via `PYPI_TOKEN` env var, or ~/.pypirc)
#
# Dry-run by default; pass `--real` to actually publish.
# ─────────────────────────────────────────────────────────────────────
set -euo pipefail

REAL=0
for arg in "$@"; do
  case "$arg" in
    --real) REAL=1;;
    *) echo "usage: $0 [--real]"; exit 1;;
  esac
done

BLUE=$'\033[0;34m'; GREEN=$'\033[0;32m'; YELLOW=$'\033[0;33m'; NC=$'\033[0m'
log(){ echo "${BLUE}▸${NC} $*"; }
ok(){ echo "${GREEN}✓${NC} $*"; }
warn(){ echo "${YELLOW}!${NC} $*"; }

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# ── TypeScript SDK ──────────────────────────────────────────────────
log "Building @meridian/sdk…"
cd "$ROOT/sdk/typescript"
npm install --silent
npm run build

if [ "$REAL" -eq 1 ]; then
  log "Publishing @meridian/sdk to npm (requires OTP on 2FA prompt)…"
  npm publish --access public
  ok "published @meridian/sdk"
else
  npm pack --dry-run | tail -20
  warn "Dry run — rerun with --real to publish."
fi

# ── Python SDK ──────────────────────────────────────────────────────
log "Building meridian-sdk (Python)…"
cd "$ROOT/sdk/python"
python -m pip install --quiet --upgrade build twine
rm -rf dist
python -m build

if [ "$REAL" -eq 1 ]; then
  if [ -n "${PYPI_TOKEN:-}" ]; then
    log "Uploading to PyPI with env-provided token…"
    TWINE_USERNAME="__token__" TWINE_PASSWORD="$PYPI_TOKEN" python -m twine upload dist/*
  else
    log "Uploading to PyPI (reads ~/.pypirc)…"
    python -m twine upload dist/*
  fi
  ok "published meridian-sdk"
else
  python -m twine check dist/*
  warn "Dry run — rerun with --real to publish."
fi

echo
echo "${GREEN}Done.${NC}"
[ "$REAL" -eq 0 ] && echo "Pass --real to actually publish."

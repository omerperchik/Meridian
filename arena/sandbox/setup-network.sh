#!/usr/bin/env bash
# Creates a Docker network for the Arena sandbox with egress filtered to
# the operator-declared arena_endpoints only. Run once on the host, then
# `arena/sandbox/run.sh` launches containers attached to this network.
#
# Strategy: create a user-defined bridge network and install an iptables
# rule in the OUTPUT chain that only allows packets destined for the
# currently-registered set of arena_endpoint hosts. Updated periodically
# by the arena runner from the registry.
#
# Requires: Docker + root + iptables (or nftables). Tested on Ubuntu 22.04.
set -euo pipefail

NETWORK="${ARENA_NETWORK:-arena-egress}"

if ! docker network inspect "$NETWORK" >/dev/null 2>&1; then
  echo "[arena/net] creating $NETWORK"
  docker network create \
    --driver bridge \
    --subnet 172.28.0.0/24 \
    --opt com.docker.network.bridge.enable_icc=false \
    "$NETWORK"
fi

# Default DENY all egress from the arena subnet, then allow DNS (for hostname
# resolution) and HTTPS to known-good hosts. Callers (the arena runner) amend
# the allowlist when a submission declares a fresh endpoint.
if command -v iptables >/dev/null 2>&1; then
  iptables -C DOCKER-USER -s 172.28.0.0/24 -j ARENA-EGRESS 2>/dev/null || {
    iptables -N ARENA-EGRESS 2>/dev/null || true
    iptables -I DOCKER-USER -s 172.28.0.0/24 -j ARENA-EGRESS
  }
  # Baseline: DNS + established connections
  iptables -C ARENA-EGRESS -p udp --dport 53 -j ACCEPT 2>/dev/null || iptables -A ARENA-EGRESS -p udp --dport 53 -j ACCEPT
  iptables -C ARENA-EGRESS -m state --state ESTABLISHED,RELATED -j ACCEPT 2>/dev/null || iptables -A ARENA-EGRESS -m state --state ESTABLISHED,RELATED -j ACCEPT
  # Default deny at the end
  iptables -C ARENA-EGRESS -j REJECT 2>/dev/null || iptables -A ARENA-EGRESS -j REJECT
fi

echo "[arena/net] ready: $NETWORK"

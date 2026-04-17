#!/usr/bin/env bash
# Launch the Arena sandbox for one task. Callers pass the task JSON on stdin
# and read the result JSON from stdout. Usage:
#
#   echo '{"endpoint":"...","prompt":"...","task_id":"...","suite":"..."}' \
#     | arena/sandbox/run.sh
#
# Isolation applied (best-effort; depends on host Docker features):
#   --read-only                 : no writes to container fs
#   --tmpfs /tmp:size=8m        : scratch space only
#   --network bridge + iptables : only the declared target allowed out
#   --memory 512m --cpus 1      : hard resource caps
#   --pids-limit 64             : fork-bomb protection
#   --security-opt no-new-privs
#   --cap-drop ALL              : drop every Linux capability
#   --user 10000:10000          : non-root
#   --rm                        : ephemeral container
#   -i timeout 120s             : wall-clock kill switch
#
# The image is built locally from Dockerfile.runner — rebuild when proxy.mjs
# changes. No code from the submitted agent ever runs inside the sandbox; the
# sandbox only proxies HTTP to the operator's declared endpoint.
set -euo pipefail

IMAGE="${ARENA_SANDBOX_IMAGE:-meridian/arena-runner:latest}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! docker image inspect "$IMAGE" >/dev/null 2>&1; then
  echo "[sandbox] building $IMAGE" >&2
  docker build -t "$IMAGE" -f "$DIR/Dockerfile.runner" "$DIR" >&2
fi

# Read task from stdin so the runner can launch without ever materializing it on disk.
timeout --kill-after=5s 120s \
  docker run --rm -i \
    --read-only \
    --tmpfs /tmp:size=8m,mode=1777 \
    --memory 512m \
    --memory-swap 512m \
    --cpus 1 \
    --pids-limit 64 \
    --security-opt no-new-privileges \
    --cap-drop ALL \
    --user 10000:10000 \
    --network arena-egress \
    -e HOME=/tmp \
    "$IMAGE"

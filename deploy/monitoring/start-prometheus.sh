#!/bin/sh
set -eu

: "${METRICS_TOKEN:?METRICS_TOKEN is required}"
umask 077
printf '%s' "$METRICS_TOKEN" > /tmp/metrics-token
exec /bin/prometheus "$@"

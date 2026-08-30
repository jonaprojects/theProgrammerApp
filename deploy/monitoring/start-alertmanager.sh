#!/bin/sh
set -eu

: "${ALERT_WEBHOOK_URL:?ALERT_WEBHOOK_URL is required}"
umask 077
printf '%s' "$ALERT_WEBHOOK_URL" > /tmp/alert-webhook-url
exec /bin/alertmanager "$@"

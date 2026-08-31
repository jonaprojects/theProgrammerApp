#!/bin/sh
set -eu

: "${METRICS_TOKEN:?METRICS_TOKEN is required}"
: "${GRAFANA_CLOUD_PROMETHEUS_URL:?GRAFANA_CLOUD_PROMETHEUS_URL is required}"
: "${GRAFANA_CLOUD_PROMETHEUS_USERNAME:?GRAFANA_CLOUD_PROMETHEUS_USERNAME is required}"
: "${GRAFANA_CLOUD_PROMETHEUS_TOKEN:?GRAFANA_CLOUD_PROMETHEUS_TOKEN is required}"
: "${DEPLOYMENT_ENVIRONMENT:?DEPLOYMENT_ENVIRONMENT is required}"

case "$GRAFANA_CLOUD_PROMETHEUS_URL" in
  https://*.grafana.net/api/prom/push) ;;
  *) echo "GRAFANA_CLOUD_PROMETHEUS_URL must be a Grafana Cloud HTTPS remote-write endpoint." >&2; exit 1 ;;
esac
case "$GRAFANA_CLOUD_PROMETHEUS_USERNAME" in
  *[!0-9]*|'') echo "GRAFANA_CLOUD_PROMETHEUS_USERNAME must be the numeric metrics instance ID." >&2; exit 1 ;;
esac
case "$DEPLOYMENT_ENVIRONMENT" in
  *[!A-Za-z0-9_-]*|'') echo "DEPLOYMENT_ENVIRONMENT contains unsupported characters." >&2; exit 1 ;;
esac

umask 077
printf '%s' "$METRICS_TOKEN" > /tmp/metrics-token
printf '%s' "$GRAFANA_CLOUD_PROMETHEUS_TOKEN" > /tmp/grafana-cloud-prometheus-token
sed \
  -e "s|__GRAFANA_CLOUD_PROMETHEUS_URL__|$GRAFANA_CLOUD_PROMETHEUS_URL|g" \
  -e "s|__GRAFANA_CLOUD_PROMETHEUS_USERNAME__|$GRAFANA_CLOUD_PROMETHEUS_USERNAME|g" \
  -e "s|__DEPLOYMENT_ENVIRONMENT__|$DEPLOYMENT_ENVIRONMENT|g" \
  /etc/prometheus/prometheus.yml > /tmp/prometheus.yml
exec /bin/prometheus "$@"

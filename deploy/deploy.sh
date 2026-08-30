#!/usr/bin/env bash
set -Eeuo pipefail

release_tag="${1:?Usage: ./deploy.sh IMAGE_TAG API_IMAGE WEB_IMAGE}"
api_image="${2:?API image is required}"
web_image="${3:?Web image is required}"
deploy_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
compose_file="$deploy_dir/docker-compose.production.yml"
environment_file="$deploy_dir/.env.production"
deployed_tag_file="$deploy_dir/.deployed-image-tag"

if [[ ! -f "$environment_file" ]]; then
  echo "Missing $environment_file; copy .env.production.example and configure it." >&2
  exit 1
fi

export IMAGE_TAG="$release_tag"
export API_IMAGE="$api_image"
export WEB_IMAGE="$web_image"

compose=(docker compose --env-file "$environment_file" -f "$compose_file")
previous_tag=""
if [[ -f "$deployed_tag_file" ]]; then
  previous_tag="$(<"$deployed_tag_file")"
fi

"${compose[@]}" pull api web prometheus alertmanager grafana

# Database migrations are transactional and protected by a PostgreSQL advisory lock.
"${compose[@]}" run --rm --no-deps api node dist/db/migrate.js
"${compose[@]}" run --rm --no-deps api node dist/content-import/cli.js
"${compose[@]}" up -d --remove-orphans api web prometheus alertmanager grafana

healthy=false
for _ in {1..45}; do
  if curl --fail --silent --show-error http://127.0.0.1:3000/health/ready >/dev/null \
    && curl --fail --silent --show-error http://127.0.0.1:8080/health >/dev/null \
    && curl --fail --silent --show-error http://127.0.0.1:9090/-/healthy >/dev/null \
    && curl --fail --silent --show-error http://127.0.0.1:9093/-/healthy >/dev/null \
    && curl --fail --silent --show-error http://127.0.0.1:3001/api/health >/dev/null; then
    healthy=true
    break
  fi
  sleep 2
done

if [[ "$healthy" != true ]]; then
  echo "Production health checks failed for $release_tag." >&2
  "${compose[@]}" logs --tail=100 api web prometheus alertmanager grafana >&2 || true
  if [[ -n "$previous_tag" && "$previous_tag" != "$release_tag" ]]; then
    echo "Restoring application images from $previous_tag (database migrations remain applied)." >&2
    export IMAGE_TAG="$previous_tag"
    "${compose[@]}" up -d --no-deps api web
  fi
  exit 1
fi

printf '%s\n' "$release_tag" > "$deployed_tag_file"
echo "Deployment $release_tag is healthy."

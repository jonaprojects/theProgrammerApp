#!/usr/bin/env bash
set -Eeuo pipefail

required=(
  API_IMAGE WEB_IMAGE IMAGE_TAG SSH_HOST SSH_USER SSH_PORT SSH_PRIVATE_KEY
  SSH_KNOWN_HOSTS DEPLOY_PATH GHCR_USERNAME GHCR_PULL_TOKEN
  TARGET_API_URL TARGET_WEB_URL
)
for name in "${required[@]}"; do
  if [[ -z "${!name:-}" ]]; then
    echo "Missing deployment setting: $name" >&2
    exit 1
  fi
done

[[ "$DEPLOY_PATH" == /* ]] || {
  echo "DEPLOY_PATH must be an absolute path." >&2
  exit 1
}
[[ "$TARGET_API_URL" == https://*/api/v1 ]] || {
  echo "TARGET_API_URL must be HTTPS and end in /api/v1." >&2
  exit 1
}
[[ "$TARGET_WEB_URL" == https://* ]] || {
  echo "TARGET_WEB_URL must use HTTPS." >&2
  exit 1
}
[[ "$SSH_PORT" =~ ^[0-9]{1,5}$ ]] || {
  echo "SSH_PORT must be numeric." >&2
  exit 1
}
(( SSH_PORT >= 1 && SSH_PORT <= 65535 )) || {
  echo "SSH_PORT must be between 1 and 65535." >&2
  exit 1
}
[[ "$SSH_USER" =~ ^[A-Za-z_][A-Za-z0-9_-]*$ ]] || {
  echo "SSH_USER contains unsupported characters." >&2
  exit 1
}
[[ "$SSH_HOST" =~ ^[A-Za-z0-9.-]+$ ]] || {
  echo "SSH_HOST contains unsupported characters." >&2
  exit 1
}
[[ "$DEPLOY_PATH" =~ ^/[A-Za-z0-9._/-]+$ ]] || {
  echo "DEPLOY_PATH contains unsupported characters." >&2
  exit 1
}
[[ "$GHCR_USERNAME" =~ ^[A-Za-z0-9_-]+$ ]] || {
  echo "GHCR_USERNAME contains unsupported characters." >&2
  exit 1
}
[[ "$API_IMAGE" =~ ^ghcr\.io/[a-z0-9._/-]+$ && "$WEB_IMAGE" =~ ^ghcr\.io/[a-z0-9._/-]+$ ]] || {
  echo "API_IMAGE and WEB_IMAGE must be lowercase GHCR image names." >&2
  exit 1
}
[[ "$IMAGE_TAG" =~ ^[0-9a-f]{40}(-staging)?$ ]] || {
  echo "IMAGE_TAG must be an immutable Git commit SHA, optionally suffixed with -staging." >&2
  exit 1
}

ssh_dir="$RUNNER_TEMP/deployment-ssh"
install -m 700 -d "$ssh_dir"
printf '%s\n' "$SSH_PRIVATE_KEY" > "$ssh_dir/key"
chmod 600 "$ssh_dir/key"
printf '%s\n' "$SSH_KNOWN_HOSTS" > "$ssh_dir/known_hosts"

ssh_args=(-i "$ssh_dir/key" -o UserKnownHostsFile="$ssh_dir/known_hosts" -o StrictHostKeyChecking=yes -p "$SSH_PORT")
scp_args=(-i "$ssh_dir/key" -o UserKnownHostsFile="$ssh_dir/known_hosts" -o StrictHostKeyChecking=yes -P "$SSH_PORT")
remote="$SSH_USER@$SSH_HOST"

ssh "${ssh_args[@]}" "$remote" "mkdir -p -- '$DEPLOY_PATH'"
scp "${scp_args[@]}" deploy/docker-compose.production.yml deploy/deploy.sh deploy/.env.production.example "$remote:$DEPLOY_PATH/"
scp "${scp_args[@]}" -r deploy/monitoring "$remote:$DEPLOY_PATH/"

printf '%s' "$GHCR_PULL_TOKEN" \
  | ssh "${ssh_args[@]}" "$remote" "docker login ghcr.io --username '$GHCR_USERNAME' --password-stdin"
ssh "${ssh_args[@]}" "$remote" \
  "cd '$DEPLOY_PATH' && chmod 700 deploy.sh && ./deploy.sh '$IMAGE_TAG' '$API_IMAGE' '$WEB_IMAGE'"

api_origin="${TARGET_API_URL%/api/v1}"
curl --fail --show-error --retry 5 --retry-all-errors --retry-delay 3 "$api_origin/health/ready"
curl --fail --show-error --retry 5 --retry-all-errors --retry-delay 3 "$TARGET_WEB_URL/health"

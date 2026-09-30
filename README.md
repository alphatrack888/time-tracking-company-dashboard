# Company dashboard deployment

The existing host Nginx terminates HTTPS and will proxy to the container at
127.0.0.1:8082. The current site still proxies to PM2/Vite on localhost:3001.
Keep the current process running until the new container is verified.

## CI/CD

Pull requests targeting main install with npm ci, lint and build. Pushes to main
also publish the prod Docker target for linux/arm64 to
shfayetwt/time-tracking-company-dashboard with latest and commit SHA tags.
SSH deployment pulls the exact published digest, waits for container health,
and checks HTTP on 127.0.0.1:8082. Runs are serialized; failures do not
automatically roll back. No shared web network or Caddy is required.

The API URL is baked in as https://api.alphatrack.app/api/v1.
VITE_BASE_URL repository secrets are not consumed.
VITE_GMAP_API_KEY is passed to production Docker builds from a repository secret.
PR compilation uses a placeholder so it does not require secrets.
The Maps browser key is visible in the bundle; configure Google Cloud website
and API restrictions for the company dashboard domains.

## GitHub repository Secrets

- DOCKERHUB_USERNAME: account with push access to the company image repository.
- DOCKERHUB_TOKEN: Docker Hub write token.
- HETZNER_HOST: existing Ubuntu server IP/hostname.
- HETZNER_SSH_KEY: deployment user's private key.
- COMPANY_DEPLOY_PATH: /home/deploy/company-dashboard-docker.
- HETZNER_SSH_USER: optional, defaults to deploy.
- VITE_GMAP_API_KEY: company dashboard Google Maps browser API key.

## First deployment

Investigate the unexplained root-owned obfuscated Node processes found in the
server inspection before deploying or supplying further credentials.

1. On Ubuntu as root, verify port 8082 is free:
   ss -lntp 'sport = :8082'
2. Create the directory:
   install -d -o deploy -g deploy -m 0755 /home/deploy/company-dashboard-docker
3. Copy this repository's docker-compose.yml into that directory, owned by deploy.
   No source code, Dockerfile or runtime frontend .env is needed on the server.
4. Verify deploy can use Docker. Compose v2 must support up --wait and
   --wait-timeout; curl must be installed. The image must be publicly pullable
   or the deployment user must already have an appropriate Docker Hub login.
5. Configure the secrets, then merge/push the workflow to main.
6. After all jobs succeed, test http://127.0.0.1:8082/ on the server.
7. Back up the resolved file behind /etc/nginx/sites-enabled/company. In its
   HTTPS server block, change the existing proxy_pass from localhost:3001 to
   http://127.0.0.1:8082. Preserve the TLS certificates, domains and HTTP redirect.
   Ensure no other location still routes assets to the old service.
8. Run nginx -t && systemctl reload nginx, then test
   https://company.alphatrack.app/ in a browser: login, maps, reports and a
   nested route refresh. Container health alone does not verify these flows.
9. Only after verification, retire the old company PM2 process separately.
   Keep the old deployment and Nginx backup available for rollback.

The workflow expects Compose to exist and does not overwrite it or change
host Nginx, certificates, PM2, admin, or backend services. Copy reviewed
Compose updates to the server when changing runtime configuration.

## Rollback

For migration rollback, restore the previous host Nginx site, validate and reload.
The old PM2/Vite process must be running on port 3001.

For later image rollback, select a previous successful commit tag and run from
the company Compose directory:

```sh
export COMPANY_IMAGE=shfayetwt/time-tracking-company-dashboard:<previous-commit-sha>
compose_company() {
  printf 'services:\n  company-dashboard:\n    image: %s\n' "$COMPANY_IMAGE" |
    docker compose -f docker-compose.yml -f - "$@"
}
compose_company pull company-dashboard
compose_company up -d --no-build --no-deps --wait --wait-timeout 120 company-dashboard
curl --fail --show-error --max-time 15 http://127.0.0.1:8082/ -o /dev/null
```

The image override is temporary. A plain docker compose up uses the file's
latest tag; the next main deployment uses the new run's digest.

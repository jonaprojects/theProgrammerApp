import { readFile } from "node:fs/promises";

const baseUrl = process.env.GRAFANA_CLOUD_URL?.replace(/\/$/, "");
const token = process.env.GRAFANA_CLOUD_SERVICE_ACCOUNT_TOKEN;
const datasourceUid = process.env.GRAFANA_CLOUD_PROMETHEUS_DATASOURCE_UID;

if (!baseUrl || !/^https:\/\/[a-z0-9.-]+\.grafana\.net$/i.test(baseUrl)) {
  throw new Error("GRAFANA_CLOUD_URL must be the HTTPS URL of a grafana.net stack.");
}
if (!token) throw new Error("GRAFANA_CLOUD_SERVICE_ACCOUNT_TOKEN is required.");
if (!datasourceUid || !/^[A-Za-z0-9_-]+$/.test(datasourceUid)) {
  throw new Error("GRAFANA_CLOUD_PROMETHEUS_DATASOURCE_UID is invalid.");
}

const dashboardPath = "deploy/monitoring/grafana/dashboards/api-overview.json";
const dashboard = JSON.parse(await readFile(dashboardPath, "utf8"));
const replaceDatasource = (value) => {
  if (Array.isArray(value)) return value.map(replaceDatasource);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [
    key,
    key === "uid" && child === "prometheus" ? datasourceUid : replaceDatasource(child),
  ]));
};

const uid = dashboard.uid;
if (!uid || !/^[A-Za-z0-9_-]+$/.test(uid)) throw new Error("Dashboard UID is invalid.");
const resource = {
  kind: "Dashboard",
  apiVersion: "dashboard.grafana.app/v1",
  metadata: {
    name: uid,
    namespace: "default",
    annotations: { "grafana.app/message": `Synced from ${process.env.GITHUB_SHA ?? "repository"}` },
  },
  spec: replaceDatasource(dashboard),
};
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};
const itemUrl = `${baseUrl}/apis/dashboard.grafana.app/v1/namespaces/default/dashboards/${uid}`;
const existing = await fetch(itemUrl, { headers, signal: AbortSignal.timeout(10_000) });
if (existing.status !== 200 && existing.status !== 404) {
  throw new Error(`Grafana dashboard lookup returned HTTP ${existing.status}.`);
}
const response = await fetch(existing.status === 404
  ? `${baseUrl}/apis/dashboard.grafana.app/v1/namespaces/default/dashboards`
  : itemUrl, {
  method: existing.status === 404 ? "POST" : "PUT",
  headers,
  body: JSON.stringify(resource),
  signal: AbortSignal.timeout(15_000),
});
if (!response.ok) {
  const detail = (await response.text()).slice(0, 500).replaceAll(token, "[redacted]");
  throw new Error(`Grafana dashboard sync returned HTTP ${response.status}: ${detail}`);
}
console.log(`Grafana Cloud dashboard ${uid} synchronized.`);

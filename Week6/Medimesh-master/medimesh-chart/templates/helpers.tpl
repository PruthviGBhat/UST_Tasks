{{/*
════════════════════════════════════════════════════════════
MediMesh — Helm Template Helpers
Reusable snippets used across all templates
════════════════════════════════════════════════════════════
*/}}


{{/*
─── Chart Name ────────────────────────────────────────────
Returns the chart name. Used in labels.
*/}}
{{- define "medimesh.name" -}}
{{- .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
─── Full Name ─────────────────────────────────────────────
Combines release name + chart name.
Example: If you run "helm install myrelease ./medimesh-chart"
  → returns "myrelease-medimesh"
*/}}
{{- define "medimesh.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
─── Common Labels ─────────────────────────────────────────
Applied to EVERY resource for consistent identification.
These labels help you:
  - Filter resources: kubectl get all -l app.kubernetes.io/name=medimesh
  - Track which Helm release created what
*/}}
{{- define "medimesh.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version }}
{{- end }}


{{/*
─── Backend Image Full Path ───────────────────────────────
Constructs: <registry>/<image>:<tag>
Example: bharath44623/medimesh_medimesh-auth:latest
*/}}
{{- define "medimesh.backendImage" -}}
{{- printf "%s/%s:%s" $.Values.global.imageRegistry .image ($.Values.backend.tag | default "latest") }}
{{- end }}


{{/*
─── MongoDB Connection String ─────────────────────────────
Returns the internal DNS name for MongoDB
*/}}
{{- define "medimesh.mongoHost" -}}
medimesh-mongodb.{{ .Values.global.namespace }}.svc.cluster.local
{{- end }}


{{/*
─── MongoDB URI for a specific service ────────────────────
Returns: mongodb://medimesh-mongodb.medimesh.svc.cluster.local:27017/<dbName>
*/}}
{{- define "medimesh.mongoURI" -}}
{{- printf "mongodb://medimesh-mongodb.%s.svc.cluster.local:27017/%s" $.Values.global.namespace .dbName }}
{{- end }}

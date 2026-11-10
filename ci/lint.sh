#!/usr/bin/env bash
# Structural checks on the deployable manifests. Any error fails the build.
set -u
errors=0
err() { echo "LINT ERROR: $*"; errors=$((errors + 1)); }

for f in k8s/*.yaml helm/unify-demo-app/Chart.yaml helm/unify-demo-app/values.yaml; do
  [ -s "$f" ] || { err "$f is empty"; continue; }
  tabs=$(grep -n "$(printf '\t')" "$f" | cut -d: -f1 | tr '\n' ' ')
  [ -z "$tabs" ] || err "$f: tab indentation (YAML forbids tabs) on line(s) $tabs"
done

for f in k8s/*.yaml; do
  grep -qE '^apiVersion: ' "$f" || err "$f: missing apiVersion"
  grep -qE '^kind: ' "$f" || err "$f: missing kind"
  grep -qE '^  name: ' "$f" || err "$f: missing metadata.name"
done

grep -qE '^version: [0-9]+\.[0-9]+\.[0-9]+$' helm/unify-demo-app/Chart.yaml || err "Chart.yaml: version is not semver"

if [ "$errors" -gt 0 ]; then echo "lint: $errors error(s)"; exit 1; fi
echo "lint: $(ls k8s/*.yaml | wc -l | tr -d ' ') k8s manifests and the Helm chart look valid"

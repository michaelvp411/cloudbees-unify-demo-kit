#!/usr/bin/env bash
# Packages the deployable manifests as the orders-api release bundle.
set -eu
APP_VERSION=$(grep -m1 '^appVersion:' helm/unify-demo-app/Chart.yaml | tr -dc '0-9.')
VERSION="$APP_VERSION.${BUILD_NUMBER:-0}"
mkdir -p build
tar -czf "build/orders-api-$VERSION.tgz" k8s helm src
echo "$VERSION" > build/VERSION
echo "built build/orders-api-$VERSION.tgz"

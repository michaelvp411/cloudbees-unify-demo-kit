D=k8s/deployment.yaml
S=k8s/service.yaml

test_deployment_has_readiness_probe() { assert_grep 'readinessProbe:' "$D" "orders-api has no readinessProbe"; }

test_deployment_has_liveness_probe() { assert_grep 'livenessProbe:' "$D" "orders-api has no livenessProbe"; }

test_replicas_at_least_two() {
  r=$(yaml_value "$D" replicas)
  [ "${r:-0}" -ge 2 ] || fail "orders-api needs >= 2 replicas for zero-downtime deploys (got $r)"
}

test_service_targets_container_port() {
  assert_eq "$(yaml_value "$S" targetPort)" "$(yaml_value "$D" containerPort)" "Service targetPort must match containerPort"
}

test_service_selector_matches_pod_label() {
  sel=$(sed -n '/selector:/,/ports:/p' "$S" | grep -m1 -E '^[[:space:]]+app:' | sed -E 's/.*app:[[:space:]]*//')
  assert_eq "$sel" "orders-api" "Service selector must select app=orders-api"
}

test_container_has_resource_limits() {
  assert_grep '^[[:space:]]+limits:' "$D" "orders-api has no resources.limits; one noisy pod can starve the node"
  assert_grep '^[[:space:]]+memory:' "$D" "orders-api has no memory limit"
}

test_image_is_templated() {
  assert_grep 'image: IMAGE_PLACEHOLDER' "$D" "image must stay IMAGE_PLACEHOLDER; the deploy job injects the tag"
}

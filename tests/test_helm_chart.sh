C=helm/unify-demo-app/Chart.yaml
V=helm/unify-demo-app/values.yaml

test_chart_version_is_semver() { assert_semver "$(yaml_value "$C" version)" "Chart version must be semver"; }

test_app_version_matches_image_tag() {
  assert_eq "$(yaml_value "$V" tag)" "$(yaml_value "$C" appVersion)" "values image.tag must equal Chart appVersion"
}

test_replica_count_matches_k8s() {
  assert_eq "$(yaml_value "$V" replicaCount)" "$(yaml_value k8s/deployment.yaml replicas)" "Helm replicaCount drifted from k8s/deployment.yaml"
}

test_audit_evidence_enabled() {
  assert_eq "$(yaml_value "$V" auditEvidence)" "enabled" "auditEvidence must stay enabled (release governance)"
}

P=policies/ai-governance-policy.yaml

test_ai_guardrails_enforced() { assert_eq "$(yaml_value "$P" enforceGuardrails)" "true" "AI guardrails must be enforced"; }

test_max_changed_lines_is_bounded() {
  m=$(yaml_value "$P" maxChangedLines)
  { [ "${m:-0}" -gt 0 ] && [ "$m" -le 500 ]; } || fail "maxChangedLines must be 1..500 (got $m)"
}

test_feature_flags_present() { assert_grep 'feature.auditEvidence: "enabled"' k8s/configmap.yaml "auditEvidence flag missing from configmap"; }

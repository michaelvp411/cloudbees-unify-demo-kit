M=k8s/configmap.yaml

test_page_size_configured() { assert_grep 'orders.pageSize: "[0-9]+"' "$M" "orders.pageSize missing"; }

test_page_size_within_max() {
  ps=$(yaml_value "$M" orders.pageSize); mx=$(yaml_value "$M" orders.maxPageSize)
  [ "$ps" -le "$mx" ] || fail "orders.pageSize ($ps) exceeds orders.maxPageSize ($mx)"
}

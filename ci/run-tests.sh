#!/usr/bin/env bash
# Runs every test_* function in tests/test_*.sh and writes JUnit XML.
# Exits 0 even with failures: the Jenkins junit step marks the build UNSTABLE.
set -u
OUT=${1:-build/test-results/junit.xml}
mkdir -p "$(dirname "$OUT")"
esc() { sed -e 's/&/\&amp;/g' -e 's/</\&lt;/g' -e 's/>/\&gt;/g' -e 's/"/\&quot;/g'; }
now_ms() { date +%s%3N; }

total=0 failed=0 skipped=0 body=""
for f in tests/test_*.sh; do
  suite=$(basename "$f" .sh)
  for t in $(bash -c "source tests/lib.sh; source '$f'; declare -F" | awk '{print $3}' | grep '^test_'); do
    total=$((total + 1))
    start=$(now_ms)
    msg=$(bash -c "set -e; source tests/lib.sh; source '$f'; $t" 2>&1)
    rc=$?
    secs=$(awk -v ms=$(( $(now_ms) - start )) 'BEGIN { printf "%.3f", ms / 1000 }')
    tc="<testcase classname=\"orders-api.$suite\" name=\"$t\" time=\"$secs\""
    case $rc in
      0) echo "PASS $suite.$t"
         body+="$tc/>" ;;
      3) skipped=$((skipped + 1)); echo "SKIP $suite.$t: $msg"
         body+="$tc><skipped message=\"$(printf '%s' "$msg" | esc)\"/></testcase>" ;;
      *) failed=$((failed + 1)); echo "FAIL $suite.$t: $msg"
         body+="$tc><failure message=\"$(printf '%s' "$msg" | head -1 | esc)\">$(printf '%s' "$msg" | esc)</failure></testcase>" ;;
    esac
  done
done

printf '<?xml version="1.0" encoding="UTF-8"?>\n<testsuite name="orders-api" tests="%d" failures="%d" skipped="%d">%s</testsuite>\n' \
  "$total" "$failed" "$skipped" "$body" > "$OUT"
echo "orders-api: $total tests, $((total - failed - skipped)) passed, $failed failed, $skipped skipped"

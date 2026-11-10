# Assertion helpers for the orders-api manifest/config tests (sourced by ci/run-tests.sh).
fail() { echo "FAIL: $*" >&2; exit 1; }
skip() { echo "SKIP: $*"; exit 3; }
# First value of "key:" in a YAML file, quotes stripped. Good enough for flat keys.
yaml_value() {
  tr -d '\r' < "$1" | grep -m1 -E "^[[:space:]]*(- )?$2:" | sed -E 's/^[^:]*:[[:space:]]*//; s/^["'\'']//; s/["'\''][[:space:]]*$//; s/[[:space:]]+$//'
}
assert_eq() { [ "$1" = "$2" ] || fail "${3:-values differ} (got '$1', want '$2')"; }
assert_grep() { grep -qE "$1" "$2" || fail "${3:-$2 does not match /$1/}"; }
assert_semver() { echo "$1" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$' || fail "${2:-not semver}: '$1'"; }

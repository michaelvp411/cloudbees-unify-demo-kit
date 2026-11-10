#!/usr/bin/env bash
# Fails on hardcoded credentials in src/ unless the file:NAME pair is in .secrets-allowlist.
set -u
allow=$(sed -E 's/[[:space:]]*#.*//; /^$/d' .secrets-allowlist 2>/dev/null)
new=0
while IFS=: read -r file line text; do
  [ -n "$file" ] || continue
  name=$(echo "$text" | sed -E 's/^[[:space:]]*([A-Z_]+).*/\1/')
  if echo "$allow" | grep -qxF "$file:$name"; then
    echo "allowlisted: $file:$name"
  else
    echo "SECRET: hardcoded credential $name in $file:$line"
    new=$((new + 1))
  fi
done < <(grep -rnE '^[[:space:]]*[A-Z_]*(PASSWORD|PASSWD|SECRET|API_KEY|TOKEN)[A-Z_]*[[:space:]]*=[[:space:]]*"[^"]+"' src/)

if [ "$new" -gt 0 ]; then echo "secret scan: $new new finding(s); load secrets from the environment"; exit 1; fi
echo "secret scan: no new findings"

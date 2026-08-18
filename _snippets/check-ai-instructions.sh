#!/bin/bash
# Guard: any deliverable that tells a client to run the AI visibility test themselves
# must carry the correct per-engine setup, not just "use a private window".
# Run before publishing. Exits non-zero if any page is stale.
cd "$(dirname "$0")/../docs" || exit 1
fail=0
for f in */index.html; do
  # does this page instruct the reader to run the test?
  if grep -qiE 'run the (ai )?test yourself|run the test yourself|open <strong>chatgpt' "$f"; then
    if ! grep -q 'Temporary Chat' "$f"; then
      echo "STALE: $f asks the client to test but has no Temporary Chat instruction"
      fail=1
    fi
    if ! grep -q 'start a brand new conversation' "$f"; then
      echo "STALE: $f missing the Grok sign-in instruction"
      fail=1
    fi
  fi
done
[ $fail -eq 0 ] && echo "OK: every self-test instruction carries the per-engine setup."
exit $fail

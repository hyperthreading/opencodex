#!/usr/bin/env bash
# Entry point for the full stage-1 re-run (start → all scenarios → diffs → scan → cleanup).
# The implementation lives in ../scripts/ (helpers, configs, mock, tees, launcher).
exec "$(cd "$(dirname "$0")/../scripts" && pwd)/run-matrix.sh" "$@"

#!/usr/bin/env bash
#
# Point this repo's hooks at the tracked .githooks/ dir (ud task d64b5305).
# Run once per clone. core.hooksPath lives in the shared .git/config, so a
# relative path here is picked up by every worktree automatically; new
# worktrees need nothing. New clones: run this script.
#
# This repo's main is deployed to udctl.com, so a bare `git push origin main`
# that sweeps up another session's not-ready commit ships it live. The gate
# refuses a push whose range spans more than one [xxxxxxxx] card prefix.
#
set -eu

cd "$(dirname "$0")/.."
git config core.hooksPath .githooks
echo "core.hooksPath -> .githooks (pre-push card-prefix gate active in all worktrees)"

#!/bin/sh

set -eu

ENVDIR=${1:-.}
TARGETDIR=${2:-public}

node "$ENVDIR/scripts/update-runtime-env.js" "$ENVDIR" "$TARGETDIR"
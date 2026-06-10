#!/bin/sh

set -eu

sh ./scripts/env.sh /app /app/public

exec "$@"
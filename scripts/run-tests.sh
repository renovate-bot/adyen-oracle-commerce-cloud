#!/usr/bin/env sh
set -e
cd "${0%/*}/.."

echo "Running tests"
echo ".............."
yarn run test

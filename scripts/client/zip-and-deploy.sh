#!/usr/bin/env sh

scripts=$(pwd)/scripts
path=${scripts}/client

. "$scripts/auth.sh"
. "$path/create-extension.sh"
. "$path/zip-client.sh"
. "$path/deploy-client.sh"
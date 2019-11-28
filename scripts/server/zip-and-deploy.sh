#!/bin/sh

scripts=$(pwd)/scripts
path=$scripts/server

. "$scripts/auth.sh"
. "$path/zip-server.sh"
. "$path/deploy-server.sh"
#!/bin/sh

scripts=$(pwd)/scripts
path=$scripts/server

. "$scripts/occ.config"

printf "\n📤 Deploying server zip file:\n"
curl --silent --location --request POST "${URL}/ccadmin/v1/serverExtensions" \
    --header "Content-Type: multipart/form-data" \
    --header "Authorization: Bearer ${ACCESS_TOKEN}" \
    --form "filename=zip-server.zip" \
    --form "uploadType=extensions" \
    --form "force=true" \
    --form "fileUpload=@$path/zip-server.zip"
printf "\n✅️  Done!\n"

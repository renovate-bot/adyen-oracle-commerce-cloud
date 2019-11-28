#!/usr/bin/env sh
scripts=$(pwd)/scripts
path=$scripts/client
. "$scripts/occ.config"

timestamp=$(date +%s)

printf "\n📤 Deploying client zip file\n"
curl --silent  --location --request POST "${URL}/ccadmin/v1/files" \
    --header "Content-Type: multipart/form-data" \
    --header "Authorization: Bearer ${ACCESS_TOKEN}" \
    --form "fileUpload=@$path/zip-client.zip" \
    --form "filename=/extensions/${timestamp}_zip-client.zip"
printf "\n✅️  Done!\n"

printf "\n🔌  Associating created extension with deployed file\n"
curl --silent --location --request POST "${URL}/ccadmin/v1/extensions" \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer ${ACCESS_TOKEN}" \
    --data "{
    \"name\": \"${timestamp}_zip-client.zip\"
}"
printf "\n✅️  Done!\n"

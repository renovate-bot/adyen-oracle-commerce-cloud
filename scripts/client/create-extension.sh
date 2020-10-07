#!/usr/bin/env sh
scripts=$(pwd)/scripts
. "$scripts/occ.config"
ext=$(pwd)/packages/client-extension/ext.json

if [ -z "$EXTENSION_NAME" ]; then
  EXTENSION_NAME="Adyen"
fi

printf "\n🔧 Creating extension"
EXTENSION_PAYLOAD=$(curl --silent --location --request POST "${URL}/ccadmin/v1/applicationIds" \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer ${ACCESS_TOKEN}" \
    --data "{ \"name\": \"${EXTENSION_NAME}\", \"type\": \"extension\" }")
EXTENSION_ID=$(node -pe "(${EXTENSION_PAYLOAD}).id")
printf "\n✅️  Done!\n"

node -p "JSON.stringify({
  extensionID: '${EXTENSION_ID}',
  createdBy: 'Adyen NV',
  version: 2,
  timeCreated: '2020-07-07',
  name: '${EXTENSION_NAME}',
  description: 'Adyen OCX Payment Plugin (v2.0.0)'
})" > "${ext}"

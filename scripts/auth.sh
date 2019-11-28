#!/usr/bin/env sh
scripts=$(pwd)/scripts
. "$scripts/occ.config"

printf "\n🔑 Retrieving access token..."
LOGIN_DETAILS=$(curl --silent --location --request POST "${URL}/ccadmin/v1/mfalogin" \
    --header "Content-Type: application/x-www-form-urlencoded" \
    --data "grant_type=password&username=${USERNAME}&password=${PASSWORD}&totp_code=123456")
ACCESS_TOKEN=$(node -pe "(${LOGIN_DETAILS}).access_token")
printf "\n✅️  Done!\n"



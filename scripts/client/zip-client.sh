#!/bin/sh

scripts=$(pwd)/scripts
path=$scripts/client


rm "$path/zip-client.zip"

printf "\n🔨 Building client and zipping..."

if [ -x "$(command -v yarn)" ]; then
  echo " (Yarn)"
  yarn run build --scope adyen-occ-client > /dev/null&&
  yarn run bootstrap:production --scope adyen-occ-client > /dev/null&&
  node "$path/zip.js" &&
  yarn run bootstrap > /dev/null
else
  echo " (NPM)"
  npm run build -- --scope adyen-occ-client > /dev/null&&
  npm run bootstrap:production -- --scope adyen-occ-client > /dev/null&&
  node "$path/zip.js" &&
  npm run bootstrap > /dev/null
fi

printf "\n✅️  Done!\n"

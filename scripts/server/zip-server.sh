#!/bin/sh

scripts=$(pwd)/scripts
path=$scripts/server

rm "$path/zip-server.zip"


printf "\n🔨Building server and zipping..."
if [ -x "$(command -v yarn)" ]; then
  echo " (Yarn)"
  yarn run build --scope adyen-occ-server > /dev/null &&
  yarn run bootstrap:production --scope adyen-occ-server > /dev/null &&
  node "$path/zip.js" &&
  yarn run bootstrap > /dev/null
else
  echo " (NPM)"
  npm run build -- --scope adyen-occ-server > /dev/null &&
  npm run bootstrap:production -- --scope adyen-occ-server > /dev/null &&
  node "$path/zip.js" &&
  npm run bootstrap > /dev/null
fi

printf "\n✅️  Done!\n"

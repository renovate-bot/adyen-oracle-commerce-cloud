#!/bin/sh

scripts=$(pwd)/scripts
path=$scripts/client


rm "$path/zip-client.zip"

printf "\n🔨 Building client and zipping..."

if [ -x "$(command -v yarn)" ]; then
  echo " (Yarn)"
  yarn run build --scope adyen-occ-client > /dev/null&&
  yarn run bootstrap:production --scope adyen-occ-client > /dev/null&&
  cd ./packages/client-extension &&
  zip -r ../../scripts/client/zip-client.zip ext.json gateway widget -x node_modules widget/AdyenPaymentWidget/js/adyen-checkout.js \*widget/AdyenPaymentWidget/js/components\* \*widget/AdyenPaymentWidget/js/utils\* \*widget/AdyenPaymentWidget/js/constants\* \*widget/AdyenPaymentWidget/js/__tests__\* --exclude=*.DS_Store* > /dev/null &&
  cd ../.. &&
  yarn run bootstrap > /dev/null
else
  echo " (NPM)"
  npm run build -- --scope adyen-occ-client > /dev/null&&
  npm run bootstrap:production -- --scope adyen-occ-client > /dev/null&&
  cd ./packages/client-extension &&
  zip -r ../../scripts/client/zip-client.zip ext.json gateway widget -x node_modules widget/AdyenPaymentWidget/js/adyen-checkout.js \*widget/AdyenPaymentWidget/js/components\* \*widget/AdyenPaymentWidget/js/utils\* \*widget/AdyenPaymentWidget/js/constants\* \*widget/AdyenPaymentWidget/js/__tests__\* --exclude=*.DS_Store* > /dev/null &&
  cd ../.. &&
  npm run bootstrap > /dev/null
fi

printf "\n✅️  Done!\n"

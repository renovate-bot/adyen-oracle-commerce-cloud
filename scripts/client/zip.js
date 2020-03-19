var path = require('path')
var archiver = require('archiver')
var fs = require('fs')

var output = fs.createWriteStream(path.join(__dirname, 'zip-client.zip'))
var archive = archiver('zip', { zlib: { level: 9 } })
var clientPath = path.join(__dirname, '../../packages/client-extension')

archive.pipe(output)

archive.file(path.join(clientPath, 'ext.json'), { name: 'ext.json' })
archive.directory(path.join(clientPath, 'gateway'), 'gateway')
// archive.directory(, 'widget')
archive.glob('widget/**/*', {
    cwd: clientPath,
    ignore: [
        'widget/AdyenPaymentWidget/js/adyen-checkout.js',
        'widget/AdyenPaymentWidget/js/components/**',
        'widget/AdyenPaymentWidget/js/utils/**',
        'widget/AdyenPaymentWidget/js/constants/**',
        'widget/AdyenPaymentWidget/js/__tests__/**',
    ],
})

archive.finalize()

var path = require('path')
var archiver = require('archiver')
var fs = require('fs')

var output = fs.createWriteStream(path.join(__dirname, 'zip-client.zip'))
var archive = archiver('zip', { zlib: { level: 9 } })
var clientPath = path.join(__dirname, '../../packages/client-extension')

archive.pipe(output)

archive.file(path.join(clientPath, 'ext.json'), { name: 'ext.json' })
archive.directory(path.join(clientPath, 'gateway'), 'gateway')
archive.directory(path.join(clientPath, 'widget'), 'widget')

archive.finalize()


var path = require('path')
var archiver = require('archiver')
var fs = require('fs')

var output = fs.createWriteStream(path.join(__dirname, 'zip-server.zip'))
var archive = archiver('zip', { zlib: { level: 9 } })
var serverPath = path.join(__dirname, '../../packages/server-extension')

archive.pipe(output)

archive.file(path.join(serverPath, 'package.json'), { name: 'package.json' })
archive.directory(path.join(serverPath, 'node_modules'), 'node_modules')
archive.directory(path.join(serverPath, 'app'), 'app')

archive.finalize()


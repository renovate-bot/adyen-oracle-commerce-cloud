const express = require('express')
const configureApp = require('./bundle')
const logger = require('../../../../lib/logging')()

const app = express()

logger.info('OCC Server Side Extension')
app.locals.logger = logger

configureApp(app)

module.exports = app

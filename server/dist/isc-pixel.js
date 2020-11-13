#!/usr/bin/env node
const moduleAlias = require('./module-alias')

moduleAlias.addAlias('@shared', __dirname + '/shared/src')

require('./server/src/index.js')

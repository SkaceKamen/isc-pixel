#!/usr/bin/env node
const moduleAlias = require('./module-alias')

moduleAlias.addAlias('@shared', __dirname + '/shared/src')
moduleAlias.addAlias('@', __dirname + '/server/src')

require('./server/src/index.js')

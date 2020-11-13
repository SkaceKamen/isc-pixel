/**
 * Shamelessly ripped from https://github.com/ilearnio/module-alias
 */

'use strict'

var BuiltinModule = require('module')

// Guard against poorly mocked module constructors
var Module = module.constructor.length > 1 ? module.constructor : BuiltinModule

var nodePath = require('path')

var modulePaths = []
var moduleAliases = {}
var moduleAliasNames = []

var oldNodeModulePaths = Module._nodeModulePaths

Module._nodeModulePaths = function (from) {
	var paths = oldNodeModulePaths.call(this, from)

	// Only include the module path for top-level modules
	// that were not installed:
	if (from.indexOf('node_modules') === -1) {
		paths = modulePaths.concat(paths)
	}

	return paths
}

var oldResolveFilename = Module._resolveFilename

Module._resolveFilename = function (request, parentModule, isMain, options) {
	for (var i = moduleAliasNames.length; i-- > 0; ) {
		var alias = moduleAliasNames[i]

		if (isPathMatchesAlias(request, alias)) {
			var aliasTarget = moduleAliases[alias]

			// Custom function handler
			if (typeof moduleAliases[alias] === 'function') {
				var fromPath = parentModule.filename
				aliasTarget = moduleAliases[alias](fromPath, request, alias)

				if (!aliasTarget || typeof aliasTarget !== 'string') {
					throw new Error(
						'[module-alias] Expecting custom handler function to return path.'
					)
				}
			}

			request = nodePath.join(aliasTarget, request.substr(alias.length))
			// Only use the first match
			break
		}
	}

	return oldResolveFilename.call(this, request, parentModule, isMain, options)
}

function isPathMatchesAlias(path, alias) {
	// Matching /^alias(\/|$)/
	if (path.indexOf(alias) === 0) {
		if (path.length === alias.length) {
			return true
		}

		if (path[alias.length] === '/') {
			return true
		}
	}

	return false
}

function addPathHelper(path, targetArray) {
	path = nodePath.normalize(path)

	if (targetArray && targetArray.indexOf(path) === -1) {
		targetArray.unshift(path)
	}
}

function addPath(path) {
	var parent
	path = nodePath.normalize(path)

	if (modulePaths.indexOf(path) === -1) {
		modulePaths.push(path)
		// Enable the search path for the current top-level module
		var mainModule = getMainModule()

		if (mainModule) {
			addPathHelper(path, mainModule.paths)
		}

		parent = module.parent

		// Also modify the paths of the module that was used to load the
		// app-module-paths module and all of it's parents
		while (parent && parent !== mainModule) {
			addPathHelper(path, parent.paths)
			parent = parent.parent
		}
	}
}

function addAlias(alias, target) {
	moduleAliases[alias] = target
	// Cost of sorting is lower here than during resolution
	moduleAliasNames = Object.keys(moduleAliases)
	moduleAliasNames.sort()
}

function getMainModule() {
	return require.main._simulateRepl ? undefined : require.main
}

module.exports.addPath = addPath
module.exports.addAlias = addAlias
module.exports.isPathMatchesAlias = isPathMatchesAlias

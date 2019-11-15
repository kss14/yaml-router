const extend         = require('node.extend'),
      yaml           = require('js-yaml'),
      fs             = require('fs'),
      expressReverse = require('express-reverse'),
      path           = require('path'),
      Express        = require('express')

module.exports = function (app, options)
{
	options = extend(true, {
		routingFile   : __dirname + '/../../app/config/routes.yml',
		controllerPath: __dirname + '/../../app/controllers',
		helperName    : 'url'
	}, options || {})
	
	expressReverse(app, {
		helperName: options.helperName
	})
	
	initRoutes(app, options)
}

function initRoutes (app, options) {
	let controllers = []
	let i           = 0
	
	options.controllerPath.forEach(function (dir)
	{
		fs.readdirSync(dir).forEach(function (file)
		{
			let name = file.substr(0, file.indexOf('.'))
			controllers.push(require(dir + '/' + file))
		})
	})
	
	let parseYML = function (file, prefix)
	{
		let routesYaml = yaml.safeLoad(fs.readFileSync(file, 'utf8'))
		
		prefix = prefix || ''
		
		for (let key in routesYaml) {
			const obj = routesYaml[key]
			
			if (obj.resource) {
				parseYML(path.dirname(file) + '/' + obj.resource, obj.prefix)
				continue
			}
			
			const reg               = /^[A-Z][a-zA-Z]*(\.[A-Z][a-zA-Z]*)*$/g
			// controller parameter format "Bundle:Controller:action"
			let split               = obj.controller.split(':').reverse(),
			    action              = split[0] + 'Action',
			    controllerClassName = split[1] + 'Controller',
			    namespace           = split[2] !== undefined ? split[2] : null
			
			if (!reg.test(namespace)) {
				throw new Error('bad format namespace "' + namespace + '" ex: Foo or Foo.Bar')
			}
			
			if (!fs.existsSync(__dirname + '/../../dist/' + namespace.replace('.', '/'))) {
				throw new Error('directory "dist/src/' + namespace.replace('.', '/') + '" doesn\'t exit.')
			}
			
			if (!obj.methods) {
				throw new Error('No methods defined for controller ' + obj.controller)
			}
			
			obj.methods.forEach(function (method)
			{
				console.log(fs.existsSync(__dirname + '/../../dist/src/' + namespace.replace('.', '/')))
				console.log('START => ' + i + '  ' + controllerClassName)
				console.log(namespace + ' => ' + Object.byString(controllers[i], namespace))
				
				if (Object.byString(controllers[i], namespace) === undefined) {
					throw new Error('namespace "' + namespace + '" not found.')
				}
				
				let objBuild       = Object.byString(controllers[i], namespace + '.' + controllerClassName)
				let controller     = new objBuild
				let actionFunction = controller[action]
				
				console.log('END ' + controllerClassName)
				if (!actionFunction) {
					throw new Error('No controller found for ' + obj.controller)
				}
				
				app[method.toLowerCase()](key, prefix + obj.pattern, actionFunction)
			})
			
			i += 1
		}
	}
	//Load YAML
	parseYML(options.routingFile)
}

Object.byString = function (o, s)
{
	s     = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
	s     = s.replace(/^\./, '')           // strip a leading dot
	var a = s.split('.')
	for (var i = 0, n = a.length; i < n; ++i) {
		var k = a[i]
		if (k in o) {
			o = o[k]
		} else {
			return
		}
	}
	return o
}

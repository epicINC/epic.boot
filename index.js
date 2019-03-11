const constructorMap = new Map(), dataMap = new Map()


class Util {
	static spread(args) {
		if (!args.length) return []
		if (args[1] && typeof(args[1]) === 'function') return [args[0], args[1], Array.prototype.slice.call(args, 2)]
		if (args[0] && typeof(args[0]) === 'function') return [args[0].name, args[0], Array.prototype.slice.call(args, 1)]
		return [args[0], args.length > 2 && Array.prototype.slice.call(args, 1) || args[1]]
	}

	static set(map, key, val, args) {
			if (typeof(val) !== 'function') return map.set(key, () => val)

			if (Util.isClass(val))
				return map.set(key, () => Reflect.construct(val, args || []))

			if (args && args.length)
				return map.set(key, () => val(...args))

			return map.set(key, val)	
	}

	static isClass(fn) {
  	return /^class\s\w*\s*\{/.test(fn.toString())
	}

}

class Bootstrap {

	static add(/* key, val, ...args */) {
		let [key, val, args] = Util.spread(arguments)
		if (!constructorMap.has(key)) Util.set(constructorMap, key, val, args)
		 return Bootstrap
	}

	static set(/* key, val, ...args */) {

		let [key, val, args] = Util.spread(arguments)
		Util.set(constructorMap, key, val, args)
		dataMap.delete(key)
		return Bootstrap
	}

	static get(key) {
		if (dataMap.has(key)) return dataMap.get(key)
		if (!constructorMap.has(key)) return undefined
		
		let result
		try {
			result = constructorMap.get(key)()
		} catch(e) {
			console.error(e)
			return undefined
		}

		dataMap.set(key, result)
		return result
	}

	static del(key) {
		if (!constructorMap.delete(key)) return false
		dataMap.delete(key)
		return true
	}

	static has(key) {
		return constructorMap.has(key)
	}

	static get keys() {
		return constructorMap.keys()
	}

	static get count() {
		return constructorMap.size
	}

	static clear() {
		constructorMap.clear()
		dataMap.clear()
	}
}


module.exports = Bootstrap
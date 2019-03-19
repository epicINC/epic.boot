const constructorMap = new Map(), dataMap = new Map()

class Util {
	static spread(key: string, val: Function, ...args: any[]) {
		if (!args.length) return []
		if (args[1] && typeof(args[1]) === 'function') return [args[0], args[1], Array.prototype.slice.call(args, 2)]
		if (args[0] && typeof(args[0]) === 'function') return [args[0].name, args[0], Array.prototype.slice.call(args, 1)]
		return [args[0], args.length > 2 && Array.prototype.slice.call(args, 1) || args[1]]
	}

	static set(map: Map<string, any>, key: string, val: any, args: any[]) {

			if (Util.isClass(val))
				return map.set(key, () => Reflect.construct(val, args.map(e => Bootstrap.has(e) ? Bootstrap.get(e) : e) || []))

			if (args && args.length)
				return map.set(key, () => val(...args.map(e => Bootstrap.has(e) ? Bootstrap.get(e) : e)))

			return map.set(key, val)	
	}

	static isClass(fn: Function) {
  		return /^class\s\w*\s*\{/.test(fn.toString())
	}

}

export class Bootstrap {


	static new(key: string, val: any, ...args: any[]) {

		constructorMap.set(key, () => Reflect.construct(val, args.map(e => Bootstrap.has(e) ? Bootstrap.get(e) : e) || []))
		return Bootstrap
	}

	static add(key: string, val: any, ...args: any[]) {
		if (typeof (val) !== 'function') {
			constructorMap.set(key, () => val)
			return Bootstrap
		}

		if (args && args.length)
			constructorMap.set(key, () => val(...args.map(e => Bootstrap.has(e) ? Bootstrap.get(e) : e)))
		else
			constructorMap.set(key, val)

		 return Bootstrap
	}

	static set(key: string, val: any, ...args: any[]) {
		Util.set(constructorMap, key, val, args)
		dataMap.delete(key)
		return Bootstrap
	}

	static get<T>(key: string) {
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

	static del(key: string) {
		if (!constructorMap.delete(key)) return false
		dataMap.delete(key)
		return true
	}

	static has(key: string) {
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

export default Bootstrap

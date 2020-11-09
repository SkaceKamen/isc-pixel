/* eslint-disable @typescript-eslint/no-explicit-any */

type KeysMatching<T, V> = {
	[K in keyof T]: T[K] extends V ? K : never
}[keyof T]

/**
 * Creates map from array using specified key.
 * @param collection array of items
 * @param key key to be used in the map
 */
export function keyMap<T, K extends KeysMatching<T, string | number>>(
	collection: T[],
	key: K,
	source = {} as Record<Extract<T[K], string | number | symbol>, T>
): Record<Extract<T[K], string | number | symbol>, T> {
	return collection.reduce((acc, item) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		acc[item[key] as Extract<T[K], string | number | symbol>] = item

		return acc
	}, source)
}

/**
 * Creates map from array using specified key and specified value key.
 * @param collection array of items
 * @param key key to be used in the map
 * @param valueKey key extracted from item
 */
export function keyValueMap<T, K1 extends keyof T, K2 extends keyof T>(
	collection: T[],
	key: K1,
	valueKey: K2,
	source = {} as Record<string, T[K2]>
): Record<string, T[K2]> {
	return collection.reduce((acc, item) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		acc[item[key] as any] = item[valueKey]

		return acc
	}, source)
}

/**
 * Merges multiple arrays into one array containing only unique items.
 * @param arrays arrays to merge
 */
export function uniqueMerge<T>(...arrays: T[][]) {
	const items: Record<string, T> = {}

	arrays.forEach(array => {
		array.forEach(item => {
			items[JSON.stringify(item)] = item
		})
	})

	return Object.keys(items).map(key => items[key])
}

export const ucFirst = (value: string) =>
	value.charAt(0).toUpperCase() + value.slice(1)

/**
 * Generates array containing numbers between start and end (excluding).
 * @param start beginning number
 * @param end ending number (excluding)
 * @param step range step, defaults to 1
 */
export function range(start: number, end: number, step = 1) {
	const result = [] as number[]

	if (step > 0) {
		for (let i = start; i < end; i += step) {
			result.push(i)
		}
	} else {
		for (let i = start; i > end; i += step) {
			result.push(i)
		}
	}

	return result
}

/**
 * Finds first match in specified array.
 * @param items list of items
 * @param key key used for matching
 * @param value value to be matched against the key
 * @param notFound value returned when there is no match
 */
export function firstKeyMatch<T, K extends keyof T>(
	items: T[],
	key: K,
	value: T[K],
	notFound?: T
): T | undefined {
	if (!items) {
		return notFound
	}

	for (const item of items) {
		if (item[key] === value) {
			return item
		}
	}

	return notFound
}

/**
 * Splits props into two.
 * @param original all props merged into one object
 * @param splitKeys keys to be removed from the original and returned as new props
 * @TODO: Wrong return type, we have to somehow bend Pick to return object only with specified keys
 */
export function splitProps<T, K extends (keyof T)[]>(
	original: T,
	splitKeys: K
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
	return splitKeys.reduce((props, key) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		props[key] = original[key] as any
		delete original[key]

		return props
	}, {} as T)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shallowEqual(a: any, b: any) {
	if (a === b) {
		return true
	}

	if ((!a && b) || (!b && a)) {
		return false
	}

	const aKeys = Object.keys(a)
	const bKeys = Object.keys(b)

	if (aKeys.length !== bKeys.length) {
		return false
	}

	// tslint:disable-next-line: prefer-for-of
	for (let i = 0; i < aKeys.length; i++) {
		if (!b.hasOwnProperty(aKeys[i]) || a[aKeys[i]] !== b[aKeys[i]]) {
			return false
		}
	}

	return true
}

export function compareFlatArrays<T>(
	a: T[] | null | undefined,
	b: T[] | null | undefined
) {
	if (a === b) {
		return true
	}

	if (!a || !b) {
		return false
	}

	if (a.length !== b.length) {
		return false
	}

	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false
		}
	}

	return true
}

/**
 * Provides type-safe way of filtering out nulls
 * @param it
 */
export function isNotNull<T>(it: T): it is NonNullable<T> {
	return it != null
}

/**
 * Provides type-safe way of filtering out undefined
 * @param it
 */
export function isNotUndefined<T>(it: T): it is NonNullable<T> {
	return it != undefined
}

export const flatten = <T>(a: T[][]) =>
	a.reduce((acc, a) => [...acc, ...a], [] as T[])

const valueDiff = (aValue: any, bValue: any): [boolean, any?] => {
	if (
		typeof aValue !== typeof bValue ||
		(Array.isArray(aValue) && !Array.isArray(bValue)) ||
		(!Array.isArray(aValue) && Array.isArray(bValue))
	) {
		return [true, bValue]
	} else {
		if (typeof aValue === 'undefined') {
			return [false]
		}

		if (typeof aValue !== 'object' || aValue === null || bValue === null) {
			if (aValue !== bValue) {
				return [true, bValue]
			}
		} else {
			if (!Array.isArray(aValue)) {
				const changes = objDiff(aValue, bValue)

				if (Object.keys(changes).length > 0) {
					return [true, changes]
				}
			} else {
				const diff = {} as Record<string, any>

				for (let i = 0; i < Math.max(aValue.length, bValue.length); i++) {
					const itemDiff = valueDiff(aValue[i], bValue[i])

					if (itemDiff[0]) {
						diff[i] = itemDiff[1]
					}
				}

				if (Object.keys(diff).length > 0) {
					return [true, diff]
				}
			}
		}
	}

	return [false]
}

/**
 * Diff format:
 *    [key]: undefined   // key is missing from b
 *    [key]:
 *
 * @param a
 * @param b
 */
export const objDiff = (a: any, b: any) => {
	const result = {} as Record<string, any>
	const bKeys = Object.keys(b)

	Object.keys(a)
		.filter(k => !bKeys.includes(k))
		.forEach(key => {
			result[key] = undefined
		})

	bKeys.forEach(key => {
		const aValue = a[key]
		const bValue = b[key]

		const diff = valueDiff(aValue, bValue)

		if (diff[0]) {
			result[key] = diff[1]
		}
	})

	return result
}

export const voidReduce = <T, R>(
	array: T[],
	accumulator: R,
	callback: (accumulator: R, item: T, index: number) => any
) => {
	return array.reduce((acc, item, index) => {
		callback(acc, item, index)

		return acc
	}, accumulator)
}

export const voidReduceRight = <T, R>(
	array: T[],
	accumulator: R,
	callback: (accumulator: R, item: T, index: number) => any
) => {
	return array.reduceRight((acc, item, index) => {
		callback(acc, item, index)

		return acc
	}, accumulator)
}

export const mapRight = <T, R>(
	array: T[],
	callback: (item: T, index: number) => R
): R[] =>
	voidReduceRight(array, [] as R[], (acc, item, index) =>
		acc.push(callback(item, index))
	)

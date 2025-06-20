/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const getObjectWithParent = <T extends { key?: string; children?: any }>(
  currentKey: string,
  items: T[],
): T[] | undefined => {
  const newItems = JSON.parse(JSON.stringify(items))

  for (const item of newItems) {
    if (item?.key === currentKey) {
      return [item]
    }

    if (item?.children) {
      const result = getObjectWithParent(currentKey, item.children) as T[]

      if (result) {
        delete item.children

        return [item, ...result]
      }
    }
  }

  return undefined
}

export const deepCleanUndefined = <T = any>(
  obj: { [key: string]: any },
  options: { cleanEmptyString?: boolean } = {},
): T | undefined => {
  const { cleanEmptyString } = options

  if (Array.isArray(obj)) {
    // Handle arrays by cleaning each element and filtering out undefined, null, or empty string values
    const cleanedArray = obj
      .map((value) => deepCleanUndefined(value, options))
      .filter((value) => (cleanEmptyString ? value !== '' : true) && value !== undefined && value !== null)

    return (cleanedArray.length > 0 ? cleanedArray : undefined) as T
  }

  if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
    // Handle objects by cleaning each property
    const cleanedObject = Object.fromEntries(
      Object.entries(obj)
        .map(([key, value]) => [key, deepCleanUndefined(value, options)])
        .filter(([_, value]) => (cleanEmptyString ? value !== '' : true) && value !== undefined && value !== null),
    )

    return Object.keys(cleanedObject).length > 0 ? cleanedObject : undefined
  }

  // Return the value if it's not an object or array
  return obj as T
}

export const fillTemplate = (template: string, data: any) => {
  const interpolatedTemplate = template?.replace(/\${(.*?)}/g, (_, path) => {
    const keys = path.split('?.').reduce((acc: any, key: string) => {
      const optionalKeys = key.split('.')

      return acc.concat(optionalKeys)
    }, [])

    let value = data

    for (const key of keys) {
      value = value?.[key]

      if (!value) break
    }

    return value || ''
  })

  return interpolatedTemplate || ''
}

export const fillObjectTemplate = (templateObj: { [key: string]: any }, data: any) => {
  const filledObject: any = {}

  for (const key in templateObj) {
    // eslint-disable-next-line no-prototype-builtins
    if (templateObj.hasOwnProperty(key)) {
      if (typeof templateObj[key] === 'string') {
        try {
          filledObject[key] = eval(fillTemplate(templateObj[key], data))
        } catch (e) {
          // In case the final value is not a valid expression
          filledObject[key] = fillTemplate(templateObj[key], data)
        }
      } else {
        // If it's not a string, just copy the value as is
        filledObject[key] = templateObj[key]
      }
    }
  }

  return filledObject
}

type FlatObjectOptions = {
  parentKey?: string
  maxDepth?: 1 | 2 | 3 | 4 | 5
  currDepth?: number
}

export const flatObject = (obj: { [key: string]: string }, opt?: FlatObjectOptions) => {
  const temp = {} as { [key: string]: string }

  // If the current depth exceeds the max depth, return the object as is
  if (opt?.maxDepth === 1) return obj
  if (opt?.currDepth && opt?.maxDepth) {
    if (opt?.currDepth > opt?.maxDepth) return obj
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = opt?.parentKey ? `${opt?.parentKey}.${key}` : key
      const val = obj[key]

      if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
        const newObj = { ...opt, parentKey: newKey, currDepth: (opt?.currDepth || 1) + 1 }
        Object.assign(temp, flatObject(val, newObj)) // Recursively flatten
      } else {
        temp[newKey] = val // Base case: Assign the value
      }
    }
  }

  return temp
}

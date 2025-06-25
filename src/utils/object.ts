/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const getObjectWithParent = <T extends { key?: string; children?: T[] }>(
  currentKey: string,
  items: T[],
): T[] | undefined => {
  const newItems = JSON.parse(JSON.stringify(items))

  for (const item of newItems) {
    if (item?.key === currentKey) {
      return [item]
    }

    if (item?.children) {
      const result = getObjectWithParent(currentKey, item.children)

      if (result) {
        delete item.children

        return [item, ...result]
      }
    }
  }

  return undefined
}

export const deepCleanUndefined = <T = Record<string, unknown>>(
  obj: unknown,
  options: { cleanEmptyString?: boolean } = {},
): T | undefined => {
  const { cleanEmptyString } = options

  if (Array.isArray(obj)) {
    // Handle arrays by cleaning each element and filtering out undefined, null, or empty string values
    const cleanedArray = obj
      .map((value) => deepCleanUndefined(value, options))
      .filter((value) => {
        if (cleanEmptyString && typeof value === 'string' && value === '') {
          return false
        }
        return value !== undefined && value !== null
      })

    return (cleanedArray.length > 0 ? cleanedArray : undefined) as T
  }

  if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
    // Handle objects by cleaning each property
    const objRecord = obj as Record<string, unknown>
    const cleanedObject = Object.fromEntries(
      Object.entries(objRecord)
        .map(([key, value]) => [key, deepCleanUndefined(value, options)])
        .filter(([, value]) => {
          if (cleanEmptyString && typeof value === 'string' && value === '') {
            return false
          }
          return value !== undefined && value !== null
        }),
    )

    return Object.keys(cleanedObject).length > 0 ? cleanedObject : undefined
  }

  // Return the value if it's not an object or array
  return obj as T
}

export const fillTemplate = (template: string, data: Record<string, unknown>): string => {
  const interpolatedTemplate = template?.replace(/\${(.*?)}/g, (_, path) => {
    const keys = path.split('?.').reduce((acc: string[], key: string) => {
      const optionalKeys = key.split('.')
      return acc.concat(optionalKeys)
    }, [])

    let value: unknown = data

    for (const key of keys) {
      if (typeof value === 'object' && value !== null && key in value) {
        value = (value as Record<string, unknown>)[key]
      } else {
        value = undefined
        break
      }
    }

    return String(value || '')
  })

  return interpolatedTemplate || ''
}

// Safe template parser that doesn't use eval()
const parseSafeExpression = (expression: string, data: Record<string, unknown>): unknown => {
  // Only allow simple property access and basic operations
  const safePattern = /^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)*$/

  if (!safePattern.test(expression)) {
    return expression // Return as string if not safe
  }

  const keys = expression.split('.')
  let value: unknown = data

  for (const key of keys) {
    if (typeof value === 'object' && value !== null && key in value) {
      value = (value as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }

  return value
}

export const fillObjectTemplate = (
  templateObj: Record<string, unknown>,
  data: Record<string, unknown>,
): Record<string, unknown> => {
  const filledObject: Record<string, unknown> = {}

  for (const key in templateObj) {
    if (Object.prototype.hasOwnProperty.call(templateObj, key)) {
      if (typeof templateObj[key] === 'string') {
        try {
          const templateValue = templateObj[key] as string
          const filledTemplate = fillTemplate(templateValue, data)

          // Try to parse as safe expression, fallback to string
          const parsedValue = parseSafeExpression(filledTemplate, data)
          filledObject[key] = parsedValue !== undefined ? parsedValue : filledTemplate
        } catch (e) {
          // In case of any error, use the filled template as string
          filledObject[key] = fillTemplate(templateObj[key] as string, data)
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

export const flatObject = (obj: Record<string, string>, opt?: FlatObjectOptions): Record<string, string> => {
  const temp: Record<string, string> = {}

  // If the current depth exceeds the max depth, return the object as is
  if (opt?.maxDepth === 1) return obj
  if (opt?.currDepth && opt?.maxDepth) {
    if (opt?.currDepth > opt?.maxDepth) return obj
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = opt?.parentKey ? `${opt?.parentKey}.${key}` : key
      const val = obj[key]

      if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
        const newObj = { ...opt, parentKey: newKey, currDepth: (opt?.currDepth || 1) + 1 }
        Object.assign(temp, flatObject(val as Record<string, string>, newObj)) // Recursively flatten
      } else {
        temp[newKey] = val // Base case: Assign the value
      }
    }
  }

  return temp
}

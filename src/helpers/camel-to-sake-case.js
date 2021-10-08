const camelToSnakeCase = (object) => {
  const newObject = {}

  function camelToUnderscore(key) {
    return key.replace(/([A-Z])/g, '_$1').toLowerCase()
  }

  for (const camel in object) {
    // eslint-disable-next-line no-prototype-builtins
    if (object.hasOwnProperty(camel)) {
      newObject[camelToUnderscore(camel)] = object[camel]
    }
  }

  return newObject
}

export { camelToSnakeCase }

const camelCaseKeysToUnderscore = (obj) => {
  if (typeof obj != 'object') return obj

  for (var oldName in obj) {
    // Camel to underscore
    let newName = oldName.replace(/([A-Z])/g, function ($1) {
      return '_' + $1.toLowerCase()
    })

    // Only process if names are different
    if (newName != oldName) {
      // Check for the old property name to avoid a ReferenceError in strict mode.
      if (obj.hasOwnProperty(oldName)) {
        obj[newName] = obj[oldName]
        delete obj[oldName]
      }
    }

    // Recursion
    if (typeof obj[newName] == 'object') {
      obj[newName] = camelCaseKeysToUnderscore(obj[newName])
    }
  }
  return obj
}

export { camelCaseKeysToUnderscore }

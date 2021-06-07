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

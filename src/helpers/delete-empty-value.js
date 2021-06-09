import { forEach, isEmpty } from 'lodash-es'

const deleteEmptyValue = (object) => {
  if (object) {
    forEach(Object.keys(object), (key) => {
      if (typeof object[key] === 'object' && !isEmpty(object[key])) {
        object[key] = deleteEmptyValue(object[key])
      } else if (
        (typeof object[key] !== 'boolean' && !object[key]) ||
        (typeof object[key] === 'object' && isEmpty(object[key]))
      ) {
        delete object[key]
      }
    })
  }
  return object
}

export { deleteEmptyValue }

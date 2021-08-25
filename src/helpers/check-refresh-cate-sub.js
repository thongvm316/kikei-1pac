import { forEach, includes, keys, map, isArray } from 'lodash-es'

export const refreshCategory = (route, filter) => {
  if (keys(route).length > 0) {
    forEach(route, (value, key) => {
      if (!includes(['order_by', 'page_number', 'page_size'], key)) {
        if (isArray(value)) {
          filter[key] = map(
            value[0].length > 3 ? [...JSON.parse('[' + value + ']')] : [...value],
            value[0].length > 3 ? (i) => Boolean(i) : (i) => Number(i)
          )
        } else {
          filter[key] = map([JSON.parse(value)])
        }
      }
    })
  }
}

export const refreshSubCategoryTo = (route, filter) => {
  if (isArray(route.category_id)) {
    forEach(route, (value, key) => {
      if (!includes(['order_by', 'page_number', 'page_size'], key)) {
        if (isArray(value)) {
          filter[key] = map(
            value[0].length > 3 ? [...JSON.parse('[' + value + ']')] : [...value],
            value[0].length > 3 ? (i) => Boolean(i) : (i) => Number(i)
          )
        } else {
          filter[key] = value
        }
      }
    })
  }
}

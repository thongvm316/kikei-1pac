import { uniqueId } from 'lodash-es'

const ROW_KEY_PREFIX = '__row__'

export const addUniqueRowKey = (payload) => {
  if (!payload || (payload && payload.length <= 0)) return payload
  return payload.map((item) => ({ ...item, key: uniqueId(ROW_KEY_PREFIX) }))
}

export const toOrderBy = (payload) => {
  if (!payload) return ''

  return payload === 'ascend' ? 'asc' : 'desc'
}

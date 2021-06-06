import { uniqueId } from 'lodash-es'

const ROW_KEY_PREFIX = '__row__'

export const addUniqueRowKey = (data) => {
  if (!data || (data && data.length <= 0)) return data
  return data.map(item => ({ ...item, key: uniqueId(ROW_KEY_PREFIX) }))
}

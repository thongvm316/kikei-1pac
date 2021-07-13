import { deleteEmptyValue } from '@/helpers/delete-empty-value'

export const convertArrayToObject = (array, key, key_prefix, value) => {
  let keyField = '',
    valueField = ''
  return array.reduce((obj, item) => {
    key_prefix === '' ? (keyField = item[key]) : (keyField = [key_prefix + item[key]])
    value === '' ? (valueField = item) : (valueField = item[value].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
    return { ...obj, [keyField]: valueField }
  }, {})
}

export const convertDataByMonth = (array, key, key_prefix, value) => {
  let keyField = ''
  let valueField = {}

  return array.reduce((obj, item) => {
    key_prefix === '' ? (keyField = item[key]) : (keyField = [key_prefix + item[key]])
    valueField.money = item[value].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    valueField.warnings = item?.warnings || []

    const newValueField = Object.assign({}, valueField)
    return { ...obj, [keyField]: newValueField }
  }, {})
}

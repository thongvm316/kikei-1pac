import { find } from 'lodash-es'
import moment from 'moment'

export const convertDataByDates = (array, key, key_prefix, value) => {
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

export const convertDataCsv = (array, key, key_prefix, value) => {
  let keyField = '',
    valueField = ''
  return array.reduce((obj, item) => {
    key_prefix === '' ? (keyField = item[key]) : (keyField = [key_prefix + item[key]])
    value === '' ? (valueField = item) : (valueField = item[value])
    return { ...obj, [keyField]: valueField }
  }, {})
}

export const convertDataFilter = (dataFilter) => {
  let arrayDate = []
  return Object.keys(dataFilter).reduce((accumulator, key) => {
    // Copy all except from_Date & to_date
    if (key === 'from_date') {
      arrayDate.push(dataFilter[key])
    } else if (key === 'to_date') {
      arrayDate.push(dataFilter[key])
    } else {
      accumulator[key] = dataFilter[key]
    }
    accumulator['date_from_to'] = arrayDate
    return accumulator
  }, {})
}

// set period current
export const findCurrentPeriod = (data) => {
  const currentTime = moment()

  return find(data, (item) => {
    const startedDate = item?.startedDate
    const finishedDate = item?.finishedDate
    if (!startedDate || !finishedDate) return false

    return currentTime >= moment(startedDate) && currentTime <= moment(finishedDate)
  })
}
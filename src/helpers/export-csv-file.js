import globalFilters from '@/filters'
import i18n from '@/locale'
const { t } = i18n.global

const convertToCSV = (labels, objArray) => {
  if (!labels.length) throw new Error('Please set labels')
  let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
  let str = ''

  // build header first
  let headLine = ''
  for (let k = 0; k < labels.length; k++) {
    if (k !== 0) headLine += ','
    headLine += labels[k].header || ''
  }
  str += headLine + '\r\n'

  // build content
  for (let i = 0; i < array.length; i++) {
    let line = ''

    for (let j = 0; j < labels.length; j++) {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!line) line += ','

      // check label item to formatted value
      let val = ''
      const { formatBy, field, localeBy } = labels[j]
      if (!field) throw new Error('Please set field name')
      if (formatBy) {
        val = globalFilters[labels[j].formatBy](array[i][field])
      } else {
        val = array[i][field]
      }
      if (localeBy) {
        val = t(`${localeBy}${val}`)
      }

      line += val
    }

    str += line + '\r\n'
  }

  return str
}

const exportCSVFile = ({ labels, items, fileTitle }) => {
  // Convert Object to JSON
  let jsonObject = JSON.stringify(items)
  let csv = '\uFEFF' + convertToCSV(labels, jsonObject)
  let exportedFilenmae = fileTitle ? `${fileTitle}.csv` : 'export.csv'
  let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae)
  } else {
    let link = document.createElement('a')
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      let url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', exportedFilenmae)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}

export { exportCSVFile }

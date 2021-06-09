import { uniqueId } from 'lodash-es'
import { deepCopy } from '@/helpers/json-parser'

export const initProjectOutsouringOrders = (projectOrders, localProjectOrders) => {
  for(let i = 0; i < projectOrders.length; i++) {
    const { id, money, note, adCompany } = projectOrders[i]
    localProjectOrders.value.push({
      key: uniqueId('__outsource__'),
      id,
      money,
      note,
      companyId: adCompany.id,
      companyName: adCompany.name
    })
  }
}

export const toProjectOutsouringOrdersRequestData = (localProjectOrders) => {
  if (localProjectOrders.value.length <= 0) return null
  return localProjectOrders.value.map((item) => {
    const shadownItem = {
      id: item.id ? item.id : null,
      companyId: item.companyId || null,
      money: item.money || null,
      note: '112233'
    }
    if (!shadownItem.id) delete shadownItem.id

    return shadownItem
  })
}

export const addProjectOrder = (localProjectOrders) => {
  const emptyOutsourceData = {
    companyId: '',
    companyName: '',
    key: uniqueId('__outsource__'),
    money: ''
  }
  localProjectOrders.value.push(deepCopy(emptyOutsourceData))
}

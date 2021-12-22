export const PROJECT_TYPES = Object.freeze([
  {
    value: 0,
    label: 'type_0'
  },
  {
    value: 1,
    label: 'type_1'
  }
])

export const STATUS_CODE = Object.freeze(['detailed', 'received', 'process', 'estimate'])

export const COST_MODAL_TYPES = Object.freeze([
  {
    id: 1,
    value: 'order_cost',
    title: '外注費'
  },
  {
    id: 2,
    value: 'material_cost',
    title: '直接材料費'
  },
  {
    id: 3,
    value: 'direct_cost',
    title: '直接経費'
  }
])

export const PROJECT_COST_TYPES = Object.freeze([
  {
    key: '1',
    text: '予測',
    value: 1
  },
  {
    key: '2',
    text: '実績',
    value: 2
  }
])

export const PROJECT_REVENUE_TYPES = Object.freeze([
  {
    key: '1',
    text: '見積',
    value: 1
  },
  {
    key: '2',
    text: '請求',
    value: 2
  }
])

export const TAX_TYPES = Object.freeze({
  SALE: 1,
  VAT: 2,
  NONE: 3
})

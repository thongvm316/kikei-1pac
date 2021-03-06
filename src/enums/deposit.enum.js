export const DIVISION = [
  {
    value: 0,
    label: 'customer'
  },
  {
    value: 1,
    label: 'partner'
  },
  {
    value: 2,
    label: 'both'
  }
]

export const COUNTRY = [
  {
    value: 1,
    label: 'vietnam'
  },
  {
    value: 2,
    label: 'japan'
  }
]

export const CURRENCY = [
  {
    value: 1,
    label: 'vnd'
  },
  {
    value: 2,
    label: 'jpy'
  }
]

export const TYPE_NAME_DEPOSIT = Object.freeze({
  10: 'type_deposit_sales',
  20: 'type_deposit_payment',
  30: 'type_deposit_cash_transfer',
  40: 'type_unclear_money'
})

export const TYPE_NAME_DEPOSIT_FOR_FILTER = Object.freeze({
  10: '0',
  20: '1',
  30: '98',
  40: '99'
})

export const TYPE_MODIFY_DEPOSIT_ROOT = Object.freeze({
  EDIT: 'EDIT',
  DELETE: 'DELETE'
})

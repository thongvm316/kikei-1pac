export const DIVISION = [
  {
    value: 0,
    label: '顧客'
  },
  {
    value: 1,
    label: 'パートナー'
  }
]

export const COUNTRY = [
  {
    value: 1,
    label: 'Vietnam'
  },
  {
    value: 2,
    label: 'Japan'
  }
]

export const CURRENCY = [
  {
    value: 1,
    label: 'VND'
  },
  {
    value: 2,
    label: 'JPY'
  }
]
export const typeDepositEnums = Object.freeze([
  { type: 10, name: 'type_deposit_sales' }, // red
  { type: 20, name: 'type_deposit_payment' }, // blue
  { type: 30, name: 'type_deposit_cash_transfer' }, // grey-15
  { type: 40, name: 'type_unclear_money' } // - red; + grey-15
])

// export const typeDepositEnums = Object.freeze({
//   10: 'type_deposit_sales', // red
//   20: 'type_deposit_payment', // blue
//   30: 'type_deposit_cash_transfer', // grey-15
//   40: 'type_unclear_money' // - red; + grey-15
// })

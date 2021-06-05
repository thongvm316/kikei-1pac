const xxx = () => {
  console.log('object')
}

export const columnsDeposit = [
  { title: '入出金日', dataIndex: 'date', key: 'date', align: 'left', sorter: xxx },
  { title: '計上月', dataIndex: 'statisticsMonth', key: 'statisticsMonth', sorter: true },
  { title: '大分類', dataIndex: 'categoryName', key: 'categoryName' },
  { title: '中分類', dataIndex: 'subcategoryName', key: 'subcategoryName' },
  { title: '項目名', dataIndex: 'purpose', key: 'purpose', slots: { customRender: 'purpose' } },
  { title: '区分', dataIndex: 'typeName', key: 'typeName', align: 'center', slots: { customRender: 'typeName' } },
  { dataIndex: 'deposit', key: 'deposit', align: 'right', slots: { title: 'customTitleDeposit', customRender: 'deposit' } },
  { dataIndex: 'balance', key: 'balance', align: 'right', slots: { title: 'customTitleBalance' } },
  { title: '確定', dataIndex: 'action', key: 'action', slots: { customRender: 'action' }, width: '127px', align: 'center' },
  { title: '', align: 'left', width: '48px' }
]

export const dataDeposit = [
  {
    key: 1,
    date: '2021-05-19',
    statistics_month: '2021-05-01',
    category_name: 'Uỷ thác',
    subcategory_name: 'Subcategory',
    purpose: '項目名項目名項目名項 目名項目名項目名',
    type_name: 'Sales',
    deposit: '3233433431',
    balance: '3233433431',
    confirmed: true,

    children: [
      {
        key: 1,
        purpose: '銀行名 (VND)',
        type_name: '出金',
        deposit: '-323343343',
        balance: '323343343'
      },

      {
        key: 1,
        purpose: '銀行名 (USD)',
        type_name: '入金',
        deposit: '-323343343',
        balance: '323343343'
      },

      {
        key: 1,
        purpose: '銀行名 (JPY)',
        type_name: '入金',
        deposit: '-',
        balance: '-'
      },

      {
        key: 1,
        purpose: '銀行名 (JPY)',
        type_name: '入金',
        deposit: '-',
        balance: '-'
      }
    ]
  },
  {
    key: 2,
    date: '2021-05-19',
    statistics_month: '2021-05-01',
    category_name: 'Uỷ thác',
    subcategory_name: 'Subcategory',
    purpose: '項目名項目名項目名項 目名項目名項目名',
    type_name: 'Payments',
    deposit: '343,343',
    balance: '323343343',
    confirmed: false,

    children: [
      {
        key: 2,
        purpose: '銀行名 (VND)',
        type_name: '出金',
        deposit: '-323343343',
        balance: '323343343'
      },

      {
        key: 2,
        purpose: '銀行名 (USD)',
        type_name: '入金',
        deposit: '-323343343',
        balance: '323343343'
      }
    ]
  },
  {
    key: 3,
    date: '2021-05-19',
    statistics_month: '2021-05-01',
    category_name: 'Tiền lương',
    subcategory_name: 'Subcategory',
    purpose: '項目名項目名項目名項 目名項目名項目名',
    type_name: 'Sales',
    deposit: '343,343',
    balance: '323343343',
    confirmed: false,

    children: [
      {
        key: 3,
        purpose: '銀行名 (VND)',
        type_name: '出金',
        deposit: '-323343343',
        balance: '323343343'
      },

      {
        key: 3,
        purpose: '銀行名 (VND)',
        type_name: '出金',
        deposit: '-323343343',
        balance: '323343343'
      }
    ]
  }
]

export const expandIconColumnIndex = 10

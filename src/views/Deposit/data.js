export const columnsDeposit = [
  { title: '入出金日', dataIndex: 'date', key: 'date', align: 'left', sorter: true },
  { title: '計上月', dataIndex: 'statistics_month', key: 'statistics_month', sorter: true },
  { title: '大分類', dataIndex: 'category_name', key: 'category_name' },
  { title: '中分類', dataIndex: 'subcategory_name', key: 'subcategory_name' },
  { title: '項目名', dataIndex: 'purpose', key: 'purpose', slots: { customRender: 'purpose' }, width: '390px' },
  { title: '区分', dataIndex: 'type_name', key: 'type_name', align: 'center',  },
  { dataIndex: 'test_deposit', key: 'test_deposit', align: 'right', slots: { title: 'customTitleDeposit' } },
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
    test_deposit: '3233433431',
    balance: '3233433431',
    confirmed: true,

    children: [
      {
        key: 1,
        purpose: '銀行名 (VND)',
        type_name: '出金',
        test_deposit: '-323343343',
        balance: '323343343'
      },

      {
        key: 1,
        purpose: '銀行名 (USD)',
        type_name: '入金',
        test_deposit: '-323343343',
        balance: '323343343'
      },

      {
        key: 1,
        purpose: '銀行名 (JPY)',
        type_name: '入金',
        test_deposit: '-',
        balance: '-'
      },

      {
        key: 1,
        purpose: '銀行名 (JPY)',
        type_name: '入金',
        test_deposit: '-',
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
    test_deposit: '343,343',
    balance: '323343343',
    confirmed: false,

    children: [
      {
        key: 2,
        purpose: '銀行名 (VND)',
        type_name: '出金',
        test_deposit: '-323343343',
        balance: '323343343'
      },

      {
        key: 2,
        purpose: '銀行名 (USD)',
        type_name: '入金',
        test_deposit: '-323343343',
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
    test_deposit: '343,343',
    balance: '323343343',
    confirmed: false,

    children: [
      {
        key: 3,
        purpose: '銀行名 (VND)',
        type_name: '出金',
        test_deposit: '-323343343',
        balance: '323343343'
      },

      {
        key: 3,
        purpose: '銀行名 (VND)',
        type_name: '出金',
        test_deposit: '-323343343',
        balance: '323343343'
      }
    ]
  }
]

export const expandIconColumnIndex = 10

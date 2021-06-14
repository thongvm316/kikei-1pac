export default {
  deposit_list: {
    type_deposit_sales: 'Sales',
    type_deposit_payment: 'Payments',
    type_deposit_cash_transfer: 'Cash Transfer',
    type_unclear_money: 'Unclear Money',
    type_none: '-',
    delete_deposit: '{purpose}を削除してもよろしですか？',
    delete_success: '{purpose}を削除されました'
  },
  company_name: {
    title_search: '会社一覧',
    key_search: '項目名',
    place_input: '入力してください',
    division: '区分',
    country: '国',
    currency: '通貨',
    handle_cancel: 'クリア',
    handle_ok: '検索',
    handle_clear: 'クリア',
    handle_select: '選択',
    table_header_select: '選択',
    table_header_name: '企業名',
    table_header_code: '企業コード',
    table_header_country: '国',
    table_header_currency: '通貨',
    table_header_division: '区分'
  },
  new: {
    date: '入出金日',
    type: '入出金',
    type_deposit: '入金',
    type_withdrawal: '出金',
    type_transfer: '移動',
    type_unclear: '不明',
    category: '大分類',
    category_place_holder: '選択して下さい',
    sub_category: '大分類',
    sub_category_place_holder: '選択して下さい',
    company_selection: '選択',
    purpose: '項目名',
    purpose_place_holder: '入力してください',
    statistics_month: '計上月',
    group: '入出金グループ',
    group_place_holder: '選択して下さい',
    withdrawal_bank_account: '銀行口座',
    withdrawal_bank_account_place_holder: '選択して下さい',
    withdrawal_money: '金額',
    withdrawal_money_place_holder: '入力してください',
    withdrawal_money_cation: '※仮受金の場合はマイナスで入力してください',
    deposit_bank_account: '移動先銀行口座',
    deposit_bank_account_place_holder: '選択して下さい',
    deposit_money: '金額',
    deposit_money_place_holder: '入力してください',
    tag: 'タグ',
    tag_place_holder: 'タグを入力してください',
    tag_caption: 'Please input Tag and press Enter',
    memo: 'メモ',
    memo_place_holder: '入力してください',
    repeat: '繰返し',
    daily: '毎日',
    weekly: '毎週',
    monthly: '毎月',
    yearly: '毎年',
    no_repetition: '繰返し無し',
    repeated_end_month: '月末',
    repeated_expired_date: '終了日',
    confirmed: '確定',
    cancel: 'キャンセル',
    registration: '登録',
    create_success: '{purpose} successfully added',
    update_success: '{purpose} successfully updated'
  },

  csv: {
    header: {
      confirmed: 'Confirmed',
      date: 'Date',
      statictis_month: 'Statictis Month',
      deposit_money: 'Deposit money',
      withdraw_money: 'Withdraw money',
      balance: 'Balance',
      type_name: 'Type name',
      category: 'Category',
      sub_category: 'Sub category',
      purpose: 'Purpose'
    }
  },

  division: {
    customer: 'Customer',
    partner: 'Partner',
    both: 'Both'
  },

  country: {
    vietnam: 'Vietnam',
    japan: 'Japan'
  },

  currency: {
    vnd: 'VND',
    jpy: 'JPY'
  },

  error_message: {
    date: 'Please select date',
    type: 'Please select type',
    category: 'Please select category',
    sub_category: 'Please select sub category',
    purpose: 'Please input item name',
    statistics_month: 'Please select accounting month',
    group: 'Please select month',
    bank_account: 'Please select bank account',
    money: 'Please input amount',
    tags: 'Please input tag',
    repeated: 'Please select repeat type'
  },

  confirm_modal: {
    message: '{purpose} を確定してもよろしですか？',
    cancel_btn: 'Cancel',
    confirm_btn: 'OK',
    confirm_success: '{purpose} を確定されました'
  }
}

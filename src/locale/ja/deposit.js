export default {
  deposit_list: {
    type_deposit_sales: '入金',
    type_deposit_payment: '出金',
    type_deposit_cash_transfer: '移動',
    type_unclear_money: '不明',
    type_none: '-',
    delete_deposit: '{purpose}項目名を削除してもよろしいですか？',
    delete_success: '{purpose}を削除されました',
    select_bank_placeholder: '口座選択',
    export_csv: 'CSVファイルダウンロード',
    create_deposit: '新規入出金追加',
    check_all: 'チェックした項目全てを確定する',
    confirm_all: '確定'
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
    sub_category: '中分類',
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
    tag_caption: '※タグを入力して「Enter」を押してください',
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
    create_success: '{purpose} が追加されました',
    update_success: '{purpose} が更新されました'
  },

  csv: {
    header: {
      confirmed: 'Confirmed',
      date: '入出金日',
      statictis_month: '計上月',
      deposit_money: '入出金額',
      withdraw_money: 'Withdraw money',
      balance: '残高',
      type_name: '区分',
      category: '大分類',
      sub_category: '中分類',
      purpose: '項目名'
    }
  },

  division: {
    customer: '顧客',
    partner: 'パートナー',
    both: '顧客及、パートナー'
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
    date: '日付を選択して下さい',
    type: 'タイプを選択して下さい',
    category: '大分類を選択して下さい',
    sub_category: '中分類を選択して下さい',
    purpose: '項目名を入力して下さい',
    statistics_month: '月を選択して下さい',
    group: 'グループを選択して下さい',
    bank_account: '銀行口座を選択して下さい',
    money: '金額を入力して下さい',
    tags: 'タグを入力して下さい',
    repeated: 'リピートタイプを選択して下さい'
  },

  confirm_modal: {
    title: '確定',
    message: '{purpose}を確定してもよろしですか？',
    message_multiple: '確定してもよろしいですか?',
    cancel_btn: 'キャンセル',
    confirm_btn: '確定',
    confirm_success: '{purpose}を確定されました'
  },

  search_deposit: {
    title_search: '検索',
    date: '入出金日',
    statistics_month: '計上月',
    type: '区分',
    category: '大分類',
    sub_category: '中分類',
    confirm_label: '確定',
    confirm_yes: '確定',
    confirm_no: '未確定',
    purpose: '項目名',
    purpose_place_holder: '入力してください',
    clear_search: 'クリア',
    submit_search: '検索'
  }
}

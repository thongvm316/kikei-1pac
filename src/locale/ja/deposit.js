export default {
  deposit_list: {
    type_deposit_sales: '入金',
    type_deposit_payment: '出金',
    type_deposit_cash_transfer: '移動',
    type_unclear_money: '不明',
    type_none: '-',
    delete_deposit: '{purpose}を削除してもよろしいですか？',
    delete_deposit_multiple: 'チェックした項目を削除してもよろしいでしょうか？',
    delete_success: '{purpose}が削除されました',
    delete_success_multiple: 'チェックした項目が削除されました',
    select_bank_placeholder: '口座選択',
    export_csv: 'CSVファイルダウンロード',
    create_deposit: '新規入出金追加',
    check_all: 'すべてを選択',
    uncheck_all: 'すべてを解除',
    confirm_all: 'チェックした項目を確定'
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
    type: '区分',
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
    unconfirmed: '取消',
    cancel: 'キャンセル',
    registration: '登録',
    create_success: '{purpose} が追加されました',
    update_success: '{purpose} が更新されました'
  },

  csv: {
    header: {
      confirmed: '確定',
      date: '日付',
      statictis_month: '計上月',
      deposit: '入金',
      withdrawal: '出金',
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
    repeated: 'リピートタイプを選択して下さい',
    repeated_expired_date: '「繰返し終了日」は「入出金日」より大きく入力してください'
  },

  confirm_modal: {
    title: '確定',
    message: '{purpose}を確定してもよろしいですか？',
    message_multiple: 'チェクした項目を確定してもよろしですか？',
    cancel_btn: 'キャンセル',
    confirm_btn: '確定',
    confirm_success: '{purpose}が確定されました',
    confirm_success_multiple: '確定されました'
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
  },

  unconfirm_modal: {
    title: '確定取消',
    message: '{purpose}を確定取消してもよろしいですか？',
    cancel_btn: 'キャンセル',
    unconfirm_btn: '取消',
    unconfirm_success: '{purpose}が確定取り消しされました'
  }
}

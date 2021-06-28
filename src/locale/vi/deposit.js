export default {
  deposit_list: {
    type_deposit_sales: 'Sales',
    type_deposit_payment: 'Payments',
    type_deposit_cash_transfer: 'Cash Transfer',
    type_unclear_money: 'Unclear Money',
    type_none: '-',
    delete_deposit: '{purpose}を削除してもよろしですか？',
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
    tag_caption: 'Vui lòng nhập Tag và nhấn Enter',
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
    create_success: 'Đã tạo deposit {purpose}',
    update_success: 'Đã cập nhật deposit {purpose}'
  },

  csv: {
    header: {
      confirmed: '確定',
      date: '入出金日',
      statictis_month: '計上月',
      deposit: '入出金額',
      withdrawal: 'Withdraw money',
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
    date: 'Vui lòng chọn ngày tháng',
    type: 'Vui lòng chọn loại',
    category: 'Vui lòng chọn thể loại',
    sub_category: 'Vui lòng chọn danh mục con',
    purpose: 'Vui lòng nhập tên mục ',
    statistics_month: 'Vui lòng chọn tháng thống kê',
    group: 'Vui lòng chọn nhóm',
    bank_account: 'Vui lòng chọn tài khoản ngân hàng',
    money: 'Vui lòng nhập số tiền',
    tags: 'Vui lòng nhập tag',
    repeated: 'Vui lòng chọn loại lặp deposit'
  },

  confirm_modal: {
    message: 'Bạn có muốn xác nhận {purpose} ?',
    cancel_btn: 'キャンセル',
    confirm_btn: '削除',
    confirm_success: '{purpose} を確定されました'
  },

  search_deposit: {
    title_search: '検索',
    date: '入出金日',
    statistics_month: '計上月',
    type: '区分',
    category: '大分類',
    sub_category: '中分類',
    confirm_label: '確定',
    confirm_yes: 'Yes',
    confirm_no: 'No',
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

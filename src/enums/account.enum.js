export const TYPE = [
  {
    id: 0,
    value: 'type_sales'
  },
  {
    id: 1,
    value: 'type_accounting'
  }
]

export const ACTIVE = [
  {
    id: true,
    value: 'in_use'
  },
  {
    id: false,
    value: 'retired'
  }
]

export const AUTHORITY = [
  {
    id: true,
    value: 'is_admin'
  },
  {
    id: false,
    value: 'is_user'
  }
]

export const PAGE_PERMISSIONS = [
  {
    id: 1,
    value: 1,
    text: 'sidebar.project',
    isGroupPermission: true
  },
  {
    id: 2,
    value: 2,
    text: 'sidebar.deposit',
    isGroupPermission: true
  },
  {
    id: 3,
    value: 3,
    text: 'sidebar.financing',
    isGroupPermission: true
  },
  {
    id: 4,
    value: 4,
    text: 'sidebar.accounting',
    isGroupPermission: true
  },
  {
    id: 5,
    value: 5,
    text: 'sidebar.company',
    isGroupPermission: false
  },
  {
    id: 6,
    value: 6,
    text: 'sidebar.category',
    isGroupPermission: false
  },
  {
    id: 7,
    value: 7,
    text: 'sidebar.account',
    isGroupPermission: false
  },
  {
    id: 10,
    value: 10,
    text: 'sidebar.logs',
    isGroupPermission: false
  }
]

export const PERMISSION_KEYS = [
  {
    id: 1,
    value: 1,
    text: 'account.permission_edit'
  },
  {
    id: 2,
    value: 2,
    text: 'account.permission_view'
  },
  {
    id: 3,
    value: 3,
    text: 'account.permission_none'
  }
]

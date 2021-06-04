import StorageService from './storage'
import AuthService from './auth'
import BankAccountService from './bank-account'
import CategoryService from './category'
import SubCategoryService from './sub-category'
import GroupService from './group'
import DepositService from './deposit'

const repositories = {
  StorageService,
  AuthService,
  BankAccountService,
  CategoryService,
  SubCategoryService,
  DepositService,
  GroupService
}

export default {
  get: name => {
    // check if name is not found
    if (!repositories[name]) {
      throw new Error(`${name.toUpperCase()} Services Not Found`)
    }

    return repositories[name]
  }
}

import StorageService from './storage'
import AuthService from './auth'
import DepositService from './deposit'
import GroupService from './group'
import BankAccountsService from './bankAccounts'
import CompanyService from './company'

const repositories = {
  StorageService,
  AuthService,
  DepositService,
  GroupService,
  BankAccountsService,
  CompanyService
}

export default {
  get: (name) => {
    // check if name is not found
    if (!repositories[name]) {
      throw new Error(`${name.toUpperCase()} Services Not Found`)
    }

    return repositories[name]
  }
}

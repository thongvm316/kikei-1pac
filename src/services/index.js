import StorageService from './storage'
import AuthService from './auth'
import BankAccountsService from './bank-accounts'
import CategoryService from './category'
import SubCategoryService from './sub-category'
import GroupService from './group'
import DepositService from './deposit'
import AccountService from './account'
import CompanyService from './company'
import ProjectService from './project'
import LogService from './logs'
import FinancingService from './financing'
import PeriodService from './period'

const repositories = {
  StorageService,
  AccountService,
  AuthService,
  BankAccountsService,
  CategoryService,
  SubCategoryService,
  DepositService,
  GroupService,
  CompanyService,
  ProjectService,
  FinancingService,
  PeriodService,
  LogService
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

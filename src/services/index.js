import StorageService from './storage'
import AuthService from './auth'
import BankAccountsService from './bank-accounts'
import CategoryService from './category'
import SubCategoryService from './sub-category'
import GroupService from './group'
import DepositService from './deposit'
import SettingAccountService from './setting-account'
import CompanyService from './company'
import ProjectService from './project'
import LogService from './logs'
import FinancingService from './financing'
import PeriodService from './period'
import AccountingManagementService from './accounting-management'
import UserService from './user'
import CurrencyService from './currency'
import ChartService from './chart'
import DashboardService from './dashboard'
import PermissionService from './permission'
import ProfileService from './profile'
import CompanyInfomationGroupService from './company-infomation'
import CountryService from './country'
import DirectCostsService from './direct-costs'
import MaterialCostsService from './material-costs'
import OrderCostsService from './order-costs'
import PositionService from './position'

const repositories = {
  StorageService,
  SettingAccountService,
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
  LogService,
  AccountingManagementService,
  UserService,
  CurrencyService,
  ChartService,
  DashboardService,
  PermissionService,
  ProfileService,
  CompanyInfomationGroupService,
  CountryService,
  DirectCostsService,
  MaterialCostsService,
  OrderCostsService,
  PositionService
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

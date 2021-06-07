import StorageService from './storage'
import AuthService from './auth'
import AccountService from './account'
import CompanyService from './company'
import ProjectService from './project'
import GroupService from './group'
import LogService from './logs'
import FinancingService from './financing'

const repositories = {
  StorageService,
  AccountService,
  AuthService,
  CompanyService,
  ProjectService,
  GroupService,
  FinancingService,
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

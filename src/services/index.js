import StorageService from './storage'
import AuthService from './auth'
import CompanyService from './company'

const repositories = {
  StorageService,
  AuthService,
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

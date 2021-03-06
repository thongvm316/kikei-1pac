import axios from 'axios'
import humps from 'humps'
import { deepCopy } from '@/helpers/json-parser'
import store from '@/store'
import router from '@/router'
import storageKeys from '@/enums/storage-keys'
import StorageService from './storage'
import { includes } from 'lodash-es'

const NAME_PAGE = [
  'company.0002',
  'category.0002',
  'subcategory.0002',
  'set_password.0004',
  'profile.0004',
  'profile.0001',
  'check_activate_token.0004',
  'group.0002',
  'group.0003',
  'group.0004',
  'bank_account.0004'
]

axios.defaults.baseURL = process.env.VUE_APP_API_ENDPOINT
axios.defaults.headers.common['Accept'] = 'application/json'

axios.interceptors.request.use(
  function (config) {
    if (config.data) {
      config.data = deepCopy(humps.decamelizeKeys(config.data))
    }

    if (config.params) {
      config.params = deepCopy(humps.decamelizeKeys(config.params))
    }

    return config
  },

  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (response) {
    if (response.data) {
      response.data = deepCopy(humps.camelizeKeys(response.data))
    }

    return response
  },

  function (error) {
    if (error.response) {
      error.response = deepCopy(humps.camelizeKeys(error.response))
      const { data } = error.response
      const errorMessage = data.error_message || data.errorMessage || 'fall.back.error'
      if (!includes(NAME_PAGE, errorMessage)) {
        // clear flash message in store first
        store.commit('auth/CLEAR_AUTH_PROFILE')
        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'error',
          message: `errors.${errorMessage.replaceAll('.', '_')}`
        })
      }
    }

    // clear all aut profile & global state when logout
    if (error.response && error.response.status === 401) {
      clearAllGlobalData()
      router.push('/login')
    }

    return Promise.reject(error)
  }
)

// helper function
function clearAllGlobalData() {
  StorageService.remove(storageKeys.authProfile)
  store.commit('auth/CLEAR_AUTH_PROFILE')
  // add more action to clear ...
}

export default function apiCaller({ method = 'GET', url, params = null, data = null, needAuth = 1 }) {
  let headers = null
  if (needAuth) {
    const accessToken = StorageService.get(storageKeys.authProfile)?.token || store.state.auth.authProfile?.token
    if (accessToken)
      headers = {
        Authorization: `Bearer ${accessToken}`
      }
  }

  return axios({
    method,
    url,
    params,
    data,
    headers
  })
}

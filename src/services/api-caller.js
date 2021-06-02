import axios from 'axios'
import humps from 'humps'
import { deepCopy } from '@/helpers/json-parser'
import store from '@/store'
import storageKeys from '@/enums/storage-keys'
import StorageService from './storage'

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
  function(response) {
    if (response.data) {
      response.data = deepCopy(humps.camelizeKeys(response.data))
    }

    return response
  },

  function(error) {
    if (error.response && error.response.status === 401) {
      clearAllGlobalData()
    } else {
      alert('fail')
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

export default function apiCaller({
  method = 'GET',
  url,
  params = null,
  data = null,
  needAuth = 1
}) {
  let headers = null
  if (needAuth) {
    const accessToken = StorageService.get(storageKeys.authProfile)?.token || store.state.auth.authProfile?.token
    if (accessToken) headers = {
      Authorization: `Bearer ${accessToken.Token}`
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

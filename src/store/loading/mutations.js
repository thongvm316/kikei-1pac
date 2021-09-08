import { STORE_FLASH_LOADING } from '../mutation-types'

const mutations = {
  [STORE_FLASH_LOADING](state, payload) {
    state.isLoading = payload
  }
}

export default mutations

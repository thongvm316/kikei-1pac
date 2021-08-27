import { STORE_ACCOUNT_PERMISSIONS, CLEAR_ACCOUNT_PERMISSIONS } from '../mutation-types'

const mutations = {
  [STORE_ACCOUNT_PERMISSIONS](state, payload) {
    state.permissions = payload
  },

  [CLEAR_ACCOUNT_PERMISSIONS](state) {
    state.permissions = null
  }
}

export default mutations

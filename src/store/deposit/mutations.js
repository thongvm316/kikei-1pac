import { STORE_DEPOSIT_FILTER, CLEAR_DEPOSIT_FILTER } from '../mutation-types'

const mutations = {
  [STORE_DEPOSIT_FILTER](state, payload) {
    state.filters = {
      ...state.filters,
      ...payload
    }
  },

  [CLEAR_DEPOSIT_FILTER](state) {
    state.filters = {}
  }
}

export default mutations

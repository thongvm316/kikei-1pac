import { STORE_ACCOUNTING_FILTER, CLEAR_ACCOUNTING_FILTER } from '../mutation-types'

const mutations = {
  [STORE_ACCOUNTING_FILTER](state, payload) {
    state.filters = {
      ...state.filters,
      ...payload
    }
  },

  [CLEAR_ACCOUNTING_FILTER](state) {
    state.filters = {}
  }
}

export default mutations

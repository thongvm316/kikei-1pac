import { STORE_FINANCING_FILTER, CLEAR_FINANCING_FILTER } from '../mutation-types'

const mutations = {
  [STORE_FINANCING_FILTER](state, payload) {
    state.filters = {
      ...state.filters,
      ...payload
    }
  },

  [CLEAR_FINANCING_FILTER](state) {
    state.filters = {}
  }
}

export default mutations

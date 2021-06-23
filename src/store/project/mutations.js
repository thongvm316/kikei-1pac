import { STORE_PROJECT_FILTER, CLEAR_PROJECT_FILTER } from '../mutation-types'

const mutations = {
  [STORE_PROJECT_FILTER](state, payload) {
    state.filters = {
      ...state.filters,
      ...payload
    }
  },

  [CLEAR_PROJECT_FILTER](state) {
    state.filters = {}
  }
}

export default mutations

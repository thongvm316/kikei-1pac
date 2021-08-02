import { STORE_CHART_FILTER, CLEAR_CHART_FILTER } from '../mutation-types'

const mutations = {
  [STORE_CHART_FILTER](state, payload) {
    state.filters = {
      ...state.filters,
      ...payload
    }
  },

  [CLEAR_CHART_FILTER](state) {
    state.filters = {}
  }
}

export default mutations

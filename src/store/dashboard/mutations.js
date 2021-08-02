import { STORE_DASHBOARD_BLOCKS, CLEAR_DASHBOARD_BLOCKS } from '../mutation-types'

const mutations = {
  [STORE_DASHBOARD_BLOCKS](state, payload) {
    state.blocks = payload
  },

  [CLEAR_DASHBOARD_BLOCKS](state) {
    state.blocks = []
  }
}

export default mutations

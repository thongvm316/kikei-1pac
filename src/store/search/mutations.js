import { STORE_SEARCH_CURRENT_ROUTE, STORE_SEARCH_SHOW_BADGE, STORE_SEARCH_VISIBLE } from '../mutation-types'

const mutations = {
  [STORE_SEARCH_CURRENT_ROUTE](state, payload) {
    state.currentRoute = payload
  },

  [STORE_SEARCH_SHOW_BADGE](state, payload) {
    state.isShowBadge = payload
  },

  [STORE_SEARCH_VISIBLE](state, payload) {
    state.isVisible = payload
  }
}

export default mutations

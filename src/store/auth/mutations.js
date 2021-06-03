import {
  STORE_AUTH_PROFILE,
  CLEAR_AUTH_PROFILE
} from '../mutation-types'

const mutations = {
  [STORE_AUTH_PROFILE](state, payload) {
    state.authProfile = payload
  },

  [CLEAR_AUTH_PROFILE](state) {
    state.authProfile = null
  }
}

export default mutations

import { STORE_LANGUAGE } from '../mutation-types'

const mutations = {
  [STORE_LANGUAGE](state, payload) {
    state.language = payload
  }
}

export default mutations

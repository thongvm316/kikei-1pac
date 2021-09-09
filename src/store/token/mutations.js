import { STORE_JWT_TOKEN } from '../mutation-types'

const mutations = {
  [STORE_JWT_TOKEN](state, payload) {
    state.jwtToken = payload
  }
}

export default mutations

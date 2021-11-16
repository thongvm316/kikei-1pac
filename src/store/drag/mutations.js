import { STORE_DRAG } from '../mutation-types'

const mutations = {
  [STORE_DRAG](state, payload) {
    state.isDrag = payload
  }
}

export default mutations

import { SET_CHART } from '../mutation-types'

const mutations = {
  [SET_CHART](state, payload) {
    state.dataChart = payload
  }
}

export default mutations

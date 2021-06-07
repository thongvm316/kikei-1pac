import { STORE_RECORD_DEPOSIT, CLEAR_RECORD_DEPOSIT } from '../mutation-types'

const mutations = {
  [STORE_RECORD_DEPOSIT](state, payload) {
    state.recordDeposit = payload
  },

  [CLEAR_RECORD_DEPOSIT](state) {
    state.recordDeposit = null
  }
}

export default mutations

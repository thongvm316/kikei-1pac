import { STORE_FLASH_MESSAGE, CLEAR_FLASH_MESSAGE } from '../mutation-types'

const mutations = {
  [STORE_FLASH_MESSAGE](state, payload) {
    if (state.message.message === 'errors.account_0102') return // prevent show 2 error permission flashs.

    state.message = {
      ...state.message,
      ...payload
    }
  },

  [CLEAR_FLASH_MESSAGE](state) {
    state.message.content = ''
  }
}

export default mutations

import {
  STORE_FINANCING_FILTER,
  CLEAR_FINANCING_FILTER,
  STORE_FINANCING_FILTER_TO_DATE,
  STORE_FINANCING_FILTER_FROM_DATE,
  STORE_FINANCING_IS_CHECK_SCROLL,
  STORE_FINANCING_GET_PERIOD,
  STORE_FINANCING_IS_SHOW_BY,
  STORE_FINANCING_IS_ALL_TAB,
  STORE_FINANCING_CHOOSE_RECORD
} from '../mutation-types'

const mutations = {
  [STORE_FINANCING_FILTER](state, payload) {
    state.filters = {
      ...state.filters,
      ...payload
    }
  },

  [STORE_FINANCING_GET_PERIOD](state, payload) {
    state.getPeriod = {
      ...state.getPeriod,
      ...payload
    }
  },

  [STORE_FINANCING_FILTER_TO_DATE](state, payload) {
    state.toDate = payload
  },

  [STORE_FINANCING_FILTER_FROM_DATE](state, payload) {
    state.fromDate = payload
  },

  [STORE_FINANCING_IS_CHECK_SCROLL](state, payload) {
    state.checkScrollDownFirst = payload
  },

  [STORE_FINANCING_IS_SHOW_BY](state, payload) {
    state.checkShowBy = payload
  },

  [STORE_FINANCING_IS_ALL_TAB](state, payload) {
    state.checkAllTab = payload
  },

  [STORE_FINANCING_CHOOSE_RECORD](state, payload) {
    state.chooseRecord = payload
  },

  [CLEAR_FINANCING_FILTER](state) {
    state.filters = {}
  }
}

export default mutations

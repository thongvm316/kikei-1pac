import {
  STORE_COMPANY_INFOMATION_ISCREATE,
  STORE_COMPANY_INFOMATION_ISCREATED,
  STORE_COMPANY_INFOMATION_REMOVE,
  STORE_COMPANY_INFOMATION_DELETED,
  STORE_COMPANY_INFOMATION_CHANGE
} from '../mutation-types'

const mutations = {
  [STORE_COMPANY_INFOMATION_ISCREATE](state, payload) {
    state.isCreate = payload
  },

  [STORE_COMPANY_INFOMATION_ISCREATED](state, payload) {
    state.isCreated = { ...payload }
  },

  [STORE_COMPANY_INFOMATION_REMOVE](state, payload) {
    state.isRemove = payload
  },

  [STORE_COMPANY_INFOMATION_DELETED](state, payload) {
    state.isDeleted = payload
  },

  [STORE_COMPANY_INFOMATION_CHANGE](state, payload) {
    state.isChangeTab = payload
  }
}

export default mutations

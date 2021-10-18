import {
  STORE_COMPANY_INFOMATION_ISCREATE,
  STORE_COMPANY_INFOMATION_ISCREATED,
  STORE_COMPANY_INFOMATION_REMOVE,
  STORE_COMPANY_INFOMATION_DELETED,
  STORE_COMPANY_INFOMATION_CHANGE,
  STORE_COMPANY_INFOMATION_UPDATE,
  STORE_COMPANY_INFOMATION_CHECKSIDEBAR,
  STORE_COMPANY_INFOMATION_LEAVEGROUP,
  STORE_COMPANY_INFOMATION_NAVNAME
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
  },

  [STORE_COMPANY_INFOMATION_UPDATE](state, payload) {
    state.isUpdateTab = payload
  },

  [STORE_COMPANY_INFOMATION_CHECKSIDEBAR](state, payload) {
    state.checkSideBar = payload
  },

  [STORE_COMPANY_INFOMATION_LEAVEGROUP](state, payload) {
    state.leaveGroup = payload
  },

  [STORE_COMPANY_INFOMATION_NAVNAME](state, payload) {
    state.navName = payload
  }
}

export default mutations

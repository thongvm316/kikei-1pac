import { createStore, createLogger } from 'vuex'
import flash from './flash'
import auth from './auth'
import deposit from './deposit'
import project from './project'
import search from './search'
import financing from './financing'
import accounting from './accounting'
import dashboard from './dashboard'
import account from './account'
import loading from './loading'

// NOTE: clear all state or module state when logout
const state = {}

const getters = {}

const mutations = {}

const debug = process.env.VUE_APP_ENV !== 'production'

const store = createStore({
  modules: {
    flash,
    auth,
    deposit,
    project,
    search,
    financing,
    accounting,
    dashboard,
    account,
    loading
  },
  state,
  getters,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store

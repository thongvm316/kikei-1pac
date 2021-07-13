import { createStore, createLogger } from 'vuex'
import flash from './flash'
import auth from './auth'
import deposit from './deposit'
import project from './project'
import search from './search'
import financing from './financing'

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
    financing
  },
  state,
  getters,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store

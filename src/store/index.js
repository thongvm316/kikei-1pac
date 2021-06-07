import { createStore, createLogger } from 'vuex'
import flash from './flash'
import auth from './auth'
import deposit from './deposit'

const state = {
  currentRoute: null
}

const getters = {
  currentRoute: (state) => state.currentRoute
}

const mutations = {
  setCurrentRoute(state, routeName) {
    state.currentRoute = routeName
  }
}

const debug = process.env.VUE_APP_ENV !== 'production'

const store = createStore({
  modules: {
    flash,
    auth,
    deposit
  },
  state,
  getters,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store

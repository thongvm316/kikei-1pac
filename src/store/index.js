import { createStore, createLogger } from 'vuex'
import flash from './flash'
import auth from './auth'

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
    auth
  },
  state,
  getters,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store

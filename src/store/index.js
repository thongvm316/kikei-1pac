import { createStore, createLogger } from 'vuex'
import flash from './flash'
import auth from './auth'

const state = {
  currentRoute: null,
  isSearchBadge: false
}

const getters = {
  currentRoute: (state) => state.currentRoute,
  isSearchBadge: (state) => state.isSearchBadge
}

const mutations = {
  setCurrentRoute(state, routeName) {
    state.currentRoute = routeName
  },
  setIsSearchBadge(state, isSearching) {
    state.isSearchBadge = isSearching
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

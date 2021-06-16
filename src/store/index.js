import { createStore, createLogger } from 'vuex'
import flash from './flash'
import auth from './auth'

const state = {
  currentRoute: null,
  isShowSearchBadge: false
}

const getters = {
  currentRoute: (state) => state.currentRoute,
  isShowSearchBadge: (state) => state.isShowSearchBadge
}

const mutations = {
  setCurrentRoute(state, routeName) {
    state.currentRoute = routeName
  },
  setIsShowSearchBadge(state, isSearching) {
    state.isShowSearchBadge = isSearching
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

import { createStore } from 'vuex'

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

export const store = createStore({ state, getters, mutations })

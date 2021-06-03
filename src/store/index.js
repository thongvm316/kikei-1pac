import { createStore, createLogger } from 'vuex'
import auth from './auth'

const debug = process.env.VUE_APP_ENV !== 'production'

const store = createStore({
  modules: {
    auth
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store

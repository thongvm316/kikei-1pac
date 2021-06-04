import { createStore, createLogger } from 'vuex'
import flash from './flash'
import auth from './auth'

const debug = process.env.VUE_APP_ENV !== 'production'

const store = createStore({
  modules: {
    flash,
    auth
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store

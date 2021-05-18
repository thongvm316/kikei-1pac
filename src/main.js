import { createApp } from 'vue'

import { store } from '@/store'
import router from '@/router'
import i18n from '@/locale'

import App from '@/App.vue'
import './styles/main.scss'

createApp(App)
  .use(i18n)
  .use(router)
  .use(store)
  .mount('#app')

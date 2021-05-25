import { createApp } from 'vue'
import { store } from '@/store'
import router from '@/router'
import i18n from '@/locale'
import directives from '@/directives'

import Multiselect from '@vueform/multiselect'

import App from '@/App.vue'
import './styles/main.scss'

const app = createApp(App)
// register directives
directives(app)

// register plugins
app.use(i18n)
app.use(router)
app.use(store)

//register global component
app.component('KMultiselect', Multiselect)

// mount app
app.mount('#app')

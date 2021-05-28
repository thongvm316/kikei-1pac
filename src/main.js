import { createApp } from 'vue'
import { store } from '@/store'
import router from '@/router'
import i18n from '@/locale'
import directives from '@/directives'
import globalComponents from '@/plugins/global-components'

import App from '@/App.vue'
import '@/styles/ant.less'

const app = createApp(App)

// register directives
directives(app)

// register plugins
app.use(i18n)
app.use(router)
app.use(store)

// register components
globalComponents(app)

// mount app
app.mount('#app')

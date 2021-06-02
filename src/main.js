import { createApp } from 'vue'
import store from '@/store'
import router from '@/router'
import i18n from '@/locale'
import directives from '@/directives'
import globalComponents from '@/plugins/global-components'

import App from '@/App.vue'

// variables for customize ant-design vue
// https://github.com/vueComponent/ant-design-vue/blob/master/components/style/themes/default.less
import '@/styles/vendor/ant/index.less'
// global component
import '@/styles/main.scss'

const app = createApp(App)

// register directives
directives(app)

// register plugins
// eslint-disable-next-line prettier/prettier
app.use(i18n)
  .use(router)
  .use(store)

// register ant-design as global components
globalComponents(app)

// mount app
app.mount('#app')

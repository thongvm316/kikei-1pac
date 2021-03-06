import { createApp } from 'vue'
import store from '@/store'
import router from '@/router'
import i18n from '@/locale'
import directives from '@/directives'
import globalComponents from '@/plugins/global-components'
import globalFilters from '@/filters'
import Validation from '@/plugins/validation'
import ConfigValidationMixin from '@/mixins/config-validation.mixin'

import App from '@/App.vue'

// variables for customize ant-design vue
// https://github.com/vueComponent/ant-design-vue/blob/master/components/style/themes/default.less
import '@/styles/vendor/ant/index.less'
// global component
import '@/styles/main.scss'

const app = createApp(App)

app.config.globalProperties.$filters = globalFilters

// register directives
directives(app)

// register plugins
// eslint-disable-next-line prettier/prettier
app.use(i18n)
  .use(router)
  .use(store)

// register ant-design as global components
globalComponents(app)

// register vee validate
Validation(app)

// global mixin
ConfigValidationMixin(app)

// mount app
app.mount('#app')

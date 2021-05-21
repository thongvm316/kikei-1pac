import { createI18n } from 'vue-i18n'

import en from './en'
import vi from './vi'
import ja from './ja'

export default createI18n({
  // legacy: false, // you must set `false`, to use Composition API
  locale: 'ja', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: { // set locale messages
    en,
    vi,
    ja
  }
})

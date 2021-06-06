import { createI18n } from 'vue-i18n'

import english from './en'
import japan from './ja'
import vi from './vi'

const messages = {
  en: { ...english },
  ja: { ...japan },
  vi
}

const i18n = createI18n({
  locale: 'ja', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages
})

export default i18n

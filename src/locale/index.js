import { createI18n } from 'vue-i18n'

import en from './en.js'
import vi from './vi.js'
import ja from './ja.js'

export default createI18n({
  // legacy: false, // you must set `false`, to use Composition API
  locale: 'ja', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: { // set locale messages
    en: en,
    vi: vi,
    ja: ja
  },
  // If you need to specify other options, you can set other options
  // ...
})

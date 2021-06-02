import { configure, defineRule, Form, Field, ErrorMessage } from 'vee-validate'
import { required, email, confirmed, between } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import i18n from '@/locale'
import en from '@vee-validate/i18n/dist/locale/en.json'
import ja from '@vee-validate/i18n/dist/locale/ja.json'

const dictionary = {
  en: {
    required_custom: 'The {field} is required !!!'
  },
  ja: {
    required_custom: '{field}は小数のみ使用できます !!!'
  }
}

const messages = {
  en: { ...en.messages, ...dictionary.en },
  ja: { ...ja.messages, ...dictionary.ja }
}

const locale = i18n.global.locale

// Define the rule globally
defineRule('required', required)
defineRule('email', email)

configure({
  validateOnInput: true,
  generateMessage: localize(`${locale}`, {
    messages: { ...messages[locale] }
  })
})

const Validation = (app) => {
  app.component('Field', Field)
  app.component('Form', Form)
  app.component('ErrorMessage', ErrorMessage)
}

export default Validation

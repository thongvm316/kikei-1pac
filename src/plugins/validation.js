import { defineRule, Form, Field, ErrorMessage } from 'vee-validate'
import { required, email, confirmed } from '@vee-validate/rules'

// Define the rule
defineRule('required', required)
defineRule('email', email)
defineRule('confirmed', confirmed)

const Validation = (app) => {
  app.component('Field', Field)
  app.component('Form', Form)
  app.component('ErrorMessage', ErrorMessage)
}

export default Validation

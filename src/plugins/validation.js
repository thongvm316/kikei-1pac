import { defineRule, Form, Field, ErrorMessage } from 'vee-validate'
import { required, email } from '@vee-validate/rules'

// Define the rule
defineRule('required', required)
defineRule('email', email)

const Validation = (app) => {
  app.component('Field', Field)
  app.component('Form', Form)
  app.component('ErrorMessage', ErrorMessage)
}

export default Validation

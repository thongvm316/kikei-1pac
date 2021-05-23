import { computed } from 'vue'
import { email, helpers, required } from '@vuelidate/validators'
import { passwordComplexity } from '@/helpers/pattern'

export default function validationRules()  {
  return computed(() => ({
    email: {
      required: helpers.withMessage((_) => 'Email can not be null', required),
      email: helpers.withMessage((_) => 'Email wrong format', email)
    },

    password: {
      required: helpers.withMessage((_) => 'Password can not be null', required),
      complexicy: helpers.withMessage((_) => 'Password too weak', passwordComplexity),
    }
  }))
}

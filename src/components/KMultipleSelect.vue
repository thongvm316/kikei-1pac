<template>
  <div>
    <multiselect
      v-model="localSelectValue"
      :searchable="true"
      :mode="mode"
      :options="options"
      :max-height="400"
      open-direction="bellow"
      :placeholder="placeholder"
    />
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from 'vue'
import Multiselect from '@vueform/multiselect'

const MULTIPLE_SELECT_PROPS = {
  modes: ['multiple']
}

Object.freeze(MULTIPLE_SELECT_PROPS)

export default defineComponent ({
  name: 'KMultipleSelect',

  components: {
    Multiselect
  },

  props: {
    value: {
      require: true
    },
    options: Array,
    mode: {
      type: String,
      default: '',
      validator: mode => {
        return MULTIPLE_SELECT_PROPS.modes.includes(mode)
      }
    },
    placeholder: String
  },

  setup(props, context) {
    const localSelectValue = ref(null)
    const value = props.value

    onMounted(() => {
      localSelectValue.value = value
      console.log(value)
    })

    watch(localSelectValue, () => {
      context.emit('update:value', localSelectValue.value)
    })

    return {
      localSelectValue
    }
  },

  // data() {
  //   return {
  //     xxx: [{ value: 'batman', label: 'Batman' }x]
  //   }
  // }
})
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style>

</style>

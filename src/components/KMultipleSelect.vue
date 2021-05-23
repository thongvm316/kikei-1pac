<template>
  <div>
    <multiselect
      v-model="value"
      :searchable="true"
      :mode="mode"
      :options="options"
    />
  </div>
</template>

<script>
import { defineComponent, watch } from 'vue'
import Multiselect from '@vueform/multiselect'

export default defineComponent ({
  name: 'KMultipleSelect',

  components: {
    Multiselect
  },

  props: {
    options: Array,
    mode: {
      type: String,
      default: '',
      validator: mode => {
        return ['multiple'].includes(mode)
      }
    }
  },

  setup(props, context) {
    watch()
  },

  data() {
    return {
      value: null
    }
  }
})
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style>

</style>

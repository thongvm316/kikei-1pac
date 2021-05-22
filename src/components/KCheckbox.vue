<template>
  <div class="k-checkbox">
    <p v-if="!!label" class="k-input__label">{{ label }}</p>

    <div :class="`k-checkbox__items ${inlineClass}`">
      <label
        v-for="option in options"
        :key="option.value"
        class="k-checkbox__item">
        <input
          type="checkbox"
          :disabled="option.disabled"
          :name="name"
          :value="option.value"
          :checked="option.checked"
          v-model="localCheckboxValue"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, ref, onMounted } from 'vue'
import { deepCopy } from '@/helpers/json-parser'

export default defineComponent ({
  name: 'KCheckbox',

  props: {
    value: {
      type: Array,
      required: true
    },

    options: {
      type: Object,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    inline: Boolean,
    label: String,
    disabled: Boolean,
  },

  setup(props, context) {
    const localCheckboxValue = ref([])
    const value = props.value

    onMounted(() => {
      localCheckboxValue.value = deepCopy(value)
    })

    watch(localCheckboxValue, () => {
      context.emit('update:value', localCheckboxValue.value)
    })

    return {
      localCheckboxValue
    }
  },

  computed: {
    inlineClass() {
      return this.inline ? 'k-checkbox__items--inline' : ''
    }
  }
})
</script>

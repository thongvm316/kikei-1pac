<template>
  <div class="k-radio">
    <p v-if="!!label" class="k-input__label">{{ label }}</p>

    <div :class="`k-radio__items ${inlineClass}`">
      <label
        v-for="option in options"
        :key="option.value"
        class="k-radio__item">
        <input
          type="radio"
          :disabled="option.disabled"
          :name="name"
          :value="option.value"
          :checked="option.checked"
          v-model="localRadioValue"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, ref, onMounted } from 'vue'

export default defineComponent ({
  name: 'KRadio',

  props: {
    value: {
      type: [String, Number],
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
    const localRadioValue = ref()
    const value = props.value

    onMounted(() => {
      localRadioValue.value = value
    })

    watch(localRadioValue, () => {
      context.emit('update:value', localRadioValue.value)
    })

    return {
      localRadioValue
    }
  },

  computed: {
    inlineClass() {
      return this.inline ? 'k-radio__items--inline' : ''
    }
  }
})
</script>

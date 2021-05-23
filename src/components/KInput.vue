<template>
  <div class="k-input">
    <label v-if="!!label" class="k-input__label">{{ label }}</label>

    <div :class="['k-input__body', { 'icon-left': iconPosition === 'left', 'icon-right': iconPosition === 'right' }]">
      <slot name="icon" />
      <input
        :class="['k-input__field', [
          sizeInputClass,
          variantClass,
          disabledInputClass
        ]]"
        :type="nativeType"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="value"
        @input="$emit('update:value', $event.target.value)" />
    </div>

    <p class="k-input__error" v-if="!!error">{{ error }}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

const FORM_PROPS = {
  sizes: ['lg', 'md', 'sm'],
  variants: ['default', 'error'],
  nativeTypes: ['text', 'password', 'email'],
  iconPosition: ['left', 'right']
}

Object.freeze(FORM_PROPS)

export default defineComponent ({
  name: 'KInput',

  props: {
    value: {
      type: [String, Number]
    },

    nativeType: {
      type: String,
      default: 'text',
      validator: nativeType => {
        return FORM_PROPS.nativeTypes.includes(nativeType)
      }
    },

    variant: {
      type: String,
      validator: variant => {
        return FORM_PROPS.variants.includes(variant)
      }
    },
    placeholder: {
      type: String,
      // TODO: locale
      default: 'Please input...'
    },

    size: {
      type: String,
      validator: size => {
        return FORM_PROPS.sizes.includes(size)
      }
    },

    iconPosition: {
      type: String,
      validator: pos => {
        return FORM_PROPS.iconPosition.includes(pos)
      }
    },

    label: String,
    disabled: Boolean,
    error: String
  },

  computed: {
    variantClass() {
      return this.variant ? this.variant : ''
    },

    sizeInputClass() {
      return this.size ? this.size : ''
    },

    disabledInputClass() {
      return this.disabled ? 'disabled' : ''
    }
  }
})
</script>

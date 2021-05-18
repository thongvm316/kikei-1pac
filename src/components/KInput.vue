<template>
  <div :class="[{ 'k-input-has-icon': icon }]">
    <slot name="icon"/>
    <input
    :class="['k-input', [
      sizeInputClass,
      variantClass,
      disabledInputClass
    ]]"
    :type="nativeType"
    :placeholder="placeholder"
    :disabled="disabled">
  </div>
</template>

<script>
import { defineComponent } from 'vue'

const FORM_PROPS = {
  sizes: ['lg', 'md', 'sm'],
  variants: ['error'],
  nativeTypes: ['text', 'number']
}

Object.freeze(FORM_PROPS)

export default defineComponent ({
  name: 'KInput',

  props: {
    nativeType: {
      type: String,
      default: 'text',
      validator: nativeType => {
        return FORM_PROPS.nativeTypes.includes(nativeType)
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
    icon: Boolean,
    disabled: Boolean,
    variant: {
      type: String,
      validator: variant => {
        return FORM_PROPS.variants.includes(variant)
      }
    }
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

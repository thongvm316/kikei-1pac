<template>
  <button
    @click="$listener"
    :class="[
      'k-button',
      variantClass,
      sizeButtonClass,
      hasIconClass,
      circleButtonClass
    ]"
    :type="nativeType"
    :autofocus="autofocus"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script>
import { defineComponent } from 'vue'
import {
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  BUTTON_NATIVE_TYPES
} from './constants'

export default defineComponent({
  name: 'KButton',

  props: {
    variant: {
      type: String,
      default: BUTTON_VARIANTS.default,
      validator: variant => {
        return Object.values(BUTTON_VARIANTS).includes(variant)
      }
    },
    nativeType: {
      type: String,
      default: BUTTON_NATIVE_TYPES.button,
      validator: nativeType => {
        return Object.values(BUTTON_NATIVE_TYPES).includes(nativeType)
      }
    },
    size: {
      type: String,
      default: BUTTON_SIZES.md,
      validator: size => {
        return Object.values(BUTTON_SIZES).includes(size)
      }
    },
    disabled: Boolean,
    autofocus: Boolean,
    circle: Boolean,
    icon: Boolean
  },

  computed: {
    variantClass() {
      return this.variant ? `k-button--${this.variant}` : ''
    },

    sizeButtonClass() {
      return this.size ? `k-button--${this.size}` : ''
    },

    hasIconClass() {
      return this.icon ? 'has-icon' : ''
    },

    circleButtonClass() {
      return this.circle ? 'is-circle' : ''
    }
  }
})
</script>

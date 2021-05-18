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

const BUTTON_PROPS = {
  sizes: ['lg', 'md', 'sm'],
  nativeTypes: ['button', 'submit', 'reset'],
  variants: ['primary', 'danger', 'outline-primary', 'outline-danger', 'default']
}

Object.freeze(BUTTON_PROPS)

export default defineComponent({
  name: 'KButton',

  props: {
    variant: {
      type: String,
      default: 'default',
      validator: variant => {
        return BUTTON_PROPS.variants.includes(variant)
      }
    },
    nativeType: {
      type: String,
      default: 'button',
      validator: nativeType => {
        return BUTTON_PROPS.nativeTypes.includes(nativeType)
      }
    },
    disabled: Boolean,
    autofocus: Boolean,
    size: {
      type: String,
      validator: size => {
        return BUTTON_PROPS.sizes.includes(size)
      }
    },
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

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
        :placeholder="placeholder ? placeholder : ''"
        :disabled="disabled"
        :value="value"
        @input="$emit('update:value', $event.target.value)" />
    </div>

    <p class="k-input__error" v-if="!!error">{{ error }}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import {
  INPUT_NATIVE_TYPES,
  INPUT_VARIANTS,
  INPUT_SIZES,
  INPUT_ICON_POSITIONS
} from './constants'

export default defineComponent ({
  name: 'KInput',

  props: {
    value: {
      type: [String, Number]
    },

    nativeType: {
      type: String,
      default: INPUT_NATIVE_TYPES.text,
      validator: nativeType => {
        return Object.values(INPUT_NATIVE_TYPES).includes(nativeType)
      }
    },

    variant: {
      type: String,
      default: INPUT_VARIANTS.default,
      validator: variant => {
        return Object.values(INPUT_VARIANTS).includes(variant)
      }
    },

    size: {
      type: String,
      default: INPUT_SIZES.md,
      validator: size => {
        return Object.values(INPUT_SIZES).includes(size)
      }
    },

    iconPosition: {
      type: String,
      default: INPUT_ICON_POSITIONS.left,
      validator: pos => {
        return Object.values(INPUT_ICON_POSITIONS).includes(pos)
      }
    },

    label: String,
    placeholder: String,
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

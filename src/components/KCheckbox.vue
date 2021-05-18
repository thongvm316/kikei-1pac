<template>
  <label class="checkbox-item">
    <input
      type="checkbox"
      :disabled="disabled"
      :checked="checked"
      :name="name"
    >
    <span>
      <slot />
    </span>
  </label>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent ({
  name: 'KCheckbox',

  props: {
    disabled: Boolean,
    checked: Boolean,
    name: String
  }
})
</script>

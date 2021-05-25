<template>
  <div>
    <multiselect
      v-model="localSelectValue"
      :searchable="searchable"
      :mode="mode"
      :options="options"
      :label="label"
      :trackBy="trackBy"
      :max-height="maxHeight"
      :open-direction="openDirection"
      :placeholder="placeholder"
    >

      <template #option="{ option }">
        <slot name="hasCheckbox" :option="option" />
      </template>
    </multiselect>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from 'vue'
import Multiselect from '@vueform/multiselect'

import KCheckbox from '@/components/KCheckbox'
import {
    MULTIPLE_SELECT_MODES,
    MULTIPLE_SELECT_DIRECTIONS
  } from './constants'

export default defineComponent({
  name: 'KMultipleSelect',

  components: {
    Multiselect,
    KCheckbox
  },

  props: {
    value: [Array, String],

    mode: {
      type: String,
      default: MULTIPLE_SELECT_MODES.single,
      validator: mode => {
        return Object.values(MULTIPLE_SELECT_MODES).includes(mode)
      }
    },

    openDirection: {
      type: String,
      default: MULTIPLE_SELECT_DIRECTIONS.bottom,
      validator: openDirection => {
        return Object.values(MULTIPLE_SELECT_DIRECTIONS).includes(openDirection)
      }
    },

    label: {
      type: String,
      default: 'name'
    },

    trackBy: {
      type: String,
      default: 'name'
    },

    maxHeight: {
      type: Number,
      default: 171
    },

    options: Array,
    placeholder: String,
    searchable: Boolean
  },

  setup(props, context) {
    const localSelectValue = ref(null)
    const value = props.value

    onMounted(() => {
      localSelectValue.value = value
    })

    watch(localSelectValue, () => {
      context.emit('update:value', localSelectValue.value)
    })

    return {
      localSelectValue
    }
  }
})
</script>

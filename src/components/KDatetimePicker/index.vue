<template>
  <date-picker
    ref="pickerRef"
    v-model="date"
    mode="date"
    is24hr
    :popover="popover"
    :masks="masks"
    :is-range="isRange"
    class="k-date-picker"
    :columns="isRange ? 2 : 1"
  >
    <template #default="{ inputValue, inputEvents }">
      <div class="k-date-picker__default">
        <p v-if="!!label" class="k-date-picker__label">{{ label }}</p>
        <div class="k-date-picker__content">
          <k-input
            :class="['k-date-picker__input', isRange && 'k-date-picker__left']"
            :value="isRange ? inputValue.start : inputValue"
            :native-type="isModeMonth ? 'month' : 'date'"
            icon-position="right"
            placeholder="Select date"
            v-on="isRange ? inputEvents.start : inputEvents"
            @click="inputClick"
          >
            <template #icon>
              <date-icon />
            </template>
          </k-input>

          <div v-if="isRange" class="k-date-picker__swap--icon">
            <swap-right-icon />
          </div>

          <k-input
            v-if="isRange"
            class="k-date-picker__right"
            :value="isRange ? inputValue.end : inputValue"
            :native-type="isModeMonth ? 'month' : 'date'"
            icon-position="right"
            placeholder="Select date"
            v-on="isRange ? inputEvents.end : inputEvents"
            @click="inputClick"
          >
            <template #icon>
              <date-icon />
            </template>
          </k-input>
        </div>
      </div>
    </template>
  </date-picker>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { DatePicker } from 'v-calendar'
import KInput from '@/components/KInput'
import { PICKER_MODE } from './constans'

import DateIcon from '@/assets/icons/ico_date.svg'
import SwapRightIcon from '@/assets/icons/ico_swap_right.svg'

export default defineComponent({
  name: 'KTooltip',

  components: {
    DatePicker,
    KInput,
    SwapRightIcon,
    DateIcon
  },

  props: {
    value: {
      type: [Date, String, Number, Object],
      required: true
    },

    label: {
      type: String,
      default: ''
    },

    mode: {
      type: String,
      default: 'date',
      validator: (mode) => {
        return Object.values(PICKER_MODE).includes(mode)
      }
    },

    isRange: {
      type: Boolean,
      default: false
    }
  },

  setup(props, context) {
    const date = ref(props.value)
    const pickerRef = ref(null)
    const isModeMonth = props.mode === PICKER_MODE.month
    const masks = ref({})

    masks.value.input = isModeMonth ? 'YYYY-MM' : 'YYYY-MM-DD'

    const inputClick = () => {
      // console.log('pickerRef', pickerRef.value.$el)
      // const pickerEl = pickerRef.value.$el?.querySelector('.vc-header .vc-title')
      // console.log('pickerEl', pickerEl)
      // pickerEl.click()
    }

    watch(date, () => {
      context.emit('update:value', date.value)
    })

    return {
      date,
      inputClick,
      pickerRef,
      masks,
      isModeMonth
    }
  },

  data() {
    return {
      popover: {
        visibility: 'focus',
        placement: 'bottom-start'
        // keepVisibleOnInput: true,
      }
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

input[type='date' i]::-webkit-calendar-picker-indicator,
input[type='month' i]::-webkit-calendar-picker-indicator {
  display: none;
}

.k-date-picker {
  &__label {
    color: $color-grey-15;
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 4px;
  }

  &__content {
    @include flexbox(null, center);
  }

  &__swap--icon {
    margin: 0 8px;
  }

  &__input,
  &__left,
  &__right {
    width: 100%;
  }
}
</style>

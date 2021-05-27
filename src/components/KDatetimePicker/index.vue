<template>
  <div class="k-date-picker">
    <label class="k-date-picker__label">{{ label }}</label>
    <div class="k-date-picker__content">
      <div class="k-date-picker__input-wrapper">
        <flat-pickr
          v-model="dateStart"
          :config="configStart"
          :required="true"
          :class="['k-input__field default k-date-picker__input', sizeInputClass, disabledInputClass]"
          :disabled="disabled"
          placeholder="Select date"
          name="date-start"
          @on-change="onStartChange"
        >
        </flat-pickr>
        <div class="k-date-picker__date-icon" data-toggle>
          <date-icon />
        </div>
      </div>

      <div v-if="isRange" class="k-date-picker__swap-icon">
        <swap-right-icon />
      </div>

      <div v-if="isRange" class="k-date-picker__input-wrapper">
        <flat-pickr
          v-model="dateEnd"
          :config="configEnd"
          :required="true"
          :class="['k-input__field default k-date-picker__input', sizeInputClass, disabledInputClass]"
          :disabled="disabled"
          placeholder="Select date"
          name="date-end"
          @on-change="onEndChange"
        >
        </flat-pickr>
        <div class="k-date-picker__date-icon" data-toggle>
          <date-icon />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import FlatPickr from 'vue-flatpickr-component'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'
import { PICKER_MODES } from './constans'
import { INPUT_SIZES } from '@/components/KInput/constants'
import { deepCopy } from '@/helpers/json-parser'
import 'flatpickr/dist/flatpickr.css'
import 'flatpickr/dist/plugins/monthSelect/style.css'

import DateIcon from '@/assets/icons/ico_date.svg'
import SwapRightIcon from '@/assets/icons/ico_swap_right.svg'

export default defineComponent({
  name: 'KTooltip',

  components: {
    FlatPickr,
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
        return Object.values(PICKER_MODES).includes(mode)
      }
    },

    isRange: {
      type: Boolean,
      default: false
    },

    size: {
      type: String,
      default: INPUT_SIZES.md,
      validator: (size) => {
        return Object.values(INPUT_SIZES).includes(size)
      }
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  setup(props, context) {
    const isModeMonth = props.mode === PICKER_MODES.month
    const dateStart = ref(props.value)
    const dateEnd = ref(null)

    const configCommon = {
      wrap: true,
      altFormat: 'F j, Y',
      dateFormat: isModeMonth ? 'Y/m' : 'Y/m/d',
      allowInput: true
    }

    const configStart = ref(deepCopy(configCommon))
    const configEnd = ref(deepCopy(configCommon))

    if (isModeMonth) {
      configStart.value.plugins = [new monthSelectPlugin({ shorthand: true, dateFormat: 'Y/m' })]
      configEnd.value.plugins = [new monthSelectPlugin({ shorthand: true, dateFormat: 'Y/m' })]
    }

    if (props.isRange) {
      dateStart.value = new Date(props.value.start)
      dateEnd.value = new Date(props.value.end)
      configStart.value.minDate = null
      configStart.value.maxDate = null
      configEnd.value.minDate = null
      configEnd.value.maxDate = null
    }

    const onStartChange = (_, dateStr) => {
      if (props.isRange) configEnd.value.minDate = new Date(dateStr)
    }

    const onEndChange = (_, dateStr) => {
      configStart.value.maxDate = new Date(dateStr)
    }

    watch([dateStart, dateEnd], () => {
      context.emit(
        'update:value',
        props.isRange ? { start: new Date(dateStart.value), end: new Date(dateEnd.value) } : dateStart.value
      )
    })

    return {
      dateStart,
      dateEnd,
      configStart,
      configEnd,
      isModeMonth,
      onStartChange,
      onEndChange
    }
  },

  computed: {
    sizeInputClass() {
      return this.size ? this.size : ''
    },

    disabledInputClass() {
      return this.disabled ? 'disabled' : ''
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.k-date-picker {
  position: relative;

  &__label {
    color: $color-grey-15;
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 4px;
  }

  &__content {
    @include flexbox(null, center);
  }

  &__input-wrapper {
    position: relative;
  }

  .k-input__field + .k-input__field {
    margin-left: 0;
  }

  &__date-icon {
    position: absolute;
    top: 10px;
    right: 12px;
  }

  &__swap-icon {
    margin: 0 12px;
  }
}

.flatpickr-day {
  color: $color-primary-9;

  &:hover {
    background: $color-grey-94;
  }
}

.flatpickr-day.selected,
.flatpickr-monthSelect-month.selected {
  background: $color-primary-9;
  color: $color-grey-100;
}

.flatpickr-day.today {
  border-color: $color-primary-9;
}
</style>

<template>
  <div>
    <multiselect
      v-model="localSelectValue"
      :searchable="true"
      :mode="mode"
      :options="options"
      label="name"
      trackBy="name"
      :max-height="171"
      open-direction="bellow"
      :placeholder="placeholder"
    >
      <template v-slot:option="{ option }">
        <div class="option-custom">{{ option.name }}</div>
      </template>
    </multiselect>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from 'vue'
import Multiselect from '@vueform/multiselect'

import KCheckbox from '@/components/KCheckbox'

const MULTIPLE_SELECT_PROPS = {
  modes: ['multiple', 'single']
}

Object.freeze(MULTIPLE_SELECT_PROPS)

export default defineComponent({
  name: 'KMultipleSelect',

  components: {
    Multiselect,
    KCheckbox
  },

  props: {
    value: {
      require: true
    },
    options: Array,
    mode: {
      type: String,
      validator: mode => {
        return MULTIPLE_SELECT_PROPS.modes.includes(mode)
      }
    },
    placeholder: String
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

<style src="@vueform/multiselect/themes/default.css"></style>

<style lang="scss">
@import '@/styles/shared/_variables.scss';

.multiselect {
  .multiselect-input {
    border-radius: 2px;
  }

  .multiselect-options {
    margin-top: 1px;
    border: 0;
    box-shadow: 0px 16px 32px -12px rgba(51, 54, 60, 0.15);
    background-color: $color-grey-100;
  }

  .multiselect-option {
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
    color: $color-grey-15;
  }

  .multiselect-multiple-label,
  .multiselect-search input {
    color: $color-grey-15;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
  }

  .multiselect-placeholder {
    color: $color-grey-75;
  }

  &.is-open .multiselect-input {
    border-radius: 2px;
    border-color: $color-additional-blue-5;
    box-shadow: 0px 0px 0px 2px rgba(24, 144, 255, 0.2);
  }

  &.is-single .multiselect-option {
    &.is-pointed {
      background-color: $color-grey-94;
      color: $color-grey-15;
    }

    &.is-selected,
    &.is-selected.is-pointed {
      background-color: $color-primary-9;
      color: $color-primary-3;
      font-weight: 800;
    }
  }

  &.is-multiple {
    .multiselect-option.is-selected {
      color: $color-grey-15;

      .option-custom:before {
        border: 1px solid $color-additional-blue-6;
        background-color: $color-additional-blue-6;
      }

      .option-custom:after {
        visibility: visible;
        opacity: 1;
      }
    }

    .option-custom {
      padding-left: 24px;
      position: relative;

      &:before {
        content: '';
        position: absolute;
        top: 1px;
        left: 0;
        width: 16px;
        height: 16px;
        border: 1px solid $color-grey-85;
      }

      &:after {
        border-bottom: 2px solid $color-grey-100;
        border-left: 2px solid $color-grey-100;
        top: 5px;
        left: 3px;
        transform: rotate(-45deg);
        width: 10px;
        height: 5px;
        content: '';
        position: absolute;
        opacity: 0;
        visibility: hidden;
      }
    }
  }
}
</style>

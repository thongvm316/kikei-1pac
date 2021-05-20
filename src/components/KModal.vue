<template>
  <div :class="['modal-wrapper', { active: open }]">
    <span class="modal-overlay" @click="toggle"></span>

    <div class="modal">
      <div class="modal__head">
        <h3>{{ header }}</h3>
        <k-button @click="toggle">
          <close-icon />
        </k-button>
      </div>

      <div class="modal__body">
        <slot name="modal-body"></slot>
      </div>

      <div v-if="footer" class="modal__footer">
        <k-button
          v-if="!!cancelButtonModalText"
          size="md"
          variant="primary"
          @click="toggle"
        >
          {{ cancelButtonModalText }}
        </k-button>

        <k-button
          v-if="!!confirmButtonModalText"
          class="u-ml-16"
          size="md"
          variant="primary"
          @click="$emit('confirm-modal')"
        >
          {{ confirmButtonModalText }}
        </k-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import CloseIcon from '@/assets/icons/ico_close.svg'
import KButton from '@/components/KButton'

export default defineComponent ({
  name: 'KModal',

  props: {
    open: {
      type: Boolean,
      default: false,
    },

    header: {
      type: String,
      require: true,
    },

    cancelButtonModalText: {
      type: String,
      default: 'Cancel',
    },

    confirmButtonModalText: {
      type: String,
      default: 'Confirm',
    },

    footer: {
      type: Boolean,
      default: true,
    }
  },

  components: {
    CloseIcon,
    KButton
  },

  methods: {
    toggle() {
      this.$emit('update:open', !this.open);
    },
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/variables';

.modal-wrapper,
.modal-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.modal-wrapper {
  position: fixed;
  background: rgba(0, 0, 0, 0.3);
  z-index: 200;
  display: none;

  &.active {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.modal-overlay {
  position: absolute;
}

.modal {
  border-radius: 8px;
  background-color: $color-grey-100;
  margin: auto 16px;
  position: relative;
  width: 605px;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: $color-grey-94;
    border-radius: 8px 8px 0 0;
    font-size: 20px;
    color: $color-primary-9;
    line-height: 28px;
  }

  &__body {
    padding: 16px 16px 0 16px;
    max-height: 80vh;

    &.is-scroll {
      overflow-y: auto;
    }
  }

  &__footer {
    padding: 24px 0 16px 0;
    display: flex;
    justify-content: center;
  }
}
</style>

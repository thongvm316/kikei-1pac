<template>
  <div :class="['modal-wrapper', { active: open }]">
    <span class="modal-overlay" @click="toggle"></span>

    <div :class="['modal', sizeModalClass]">
      <div class="modal__content">
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
            size="md"
            variant="outline-primary"
            @click="toggle"
          >
            {{ cancelButtonModalText }}
          </k-button>

          <slot name="button-confirm">
            <k-button
              class="u-ml-16"
              size="md"
              variant="primary"
              @click="$emit('confirm-modal')"
            >
              {{ confirmButtonModalText }}
            </k-button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import CloseIcon from '@/assets/icons/ico_close.svg'
import KButton from '@/components/KButton'

const MODAL_PROPS = {
  sizes: ['lg', 'md', 'sm']
}

Object.freeze(MODAL_PROPS)

export default defineComponent ({
  name: 'KModal',

  props: {
    open: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      validator: size => {
        return MODAL_PROPS.sizes.includes(size)
      }
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

  computed: {
    sizeModalClass() {
      return this.size ? `modal--${this.size}` : ''
    }
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
    display: block;
  }
}

.modal-overlay {
  position: absolute;
}

.modal {
  margin: 16px auto;
  position: relative;
  height: calc(100% - 50px);

  &--lg {
    max-width: 800px;
  }

  &--md {
    max-width: 600px; // tmp
  }

  &--sm {
    max-width: 400px; // tmp
  }

  &__content {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    overflow: hidden;
    border-radius: 8px;
    background-color: $color-grey-100;
  }

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
    padding: 16px;
    overflow: auto;
  }

  &__footer {
    padding: 16px;
    display: flex;
    justify-content: center;
  }
}
</style>

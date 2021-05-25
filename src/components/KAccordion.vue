<template>
  <div ref="accorRef" class="accordion">
    <div v-if="!disableHeader" class="accordion__header" @click="toggleAccordionOpen">
      <slot name="header" />
    </div>
    <div
      class="accordion__contents"
      :style="{ height: isExpand ? 'auto' : `${contentHeight}px`, 'transition-duration': `${duration}ms` }"
    >
      <div class="accordion__inner">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted, onBeforeUnmount, watch, toRefs } from 'vue'
import { debounce } from '@/helpers/debounce'

export default defineComponent({
  props: {
    /**
     * open accordion
     */
    open: {
      type: Boolean,
      default: false
    },
    /**
     * Disable accordion
     */
    isExpand: {
      type: Boolean,
      default: false
    },
    /**
     * transition-duration(ms)
     */
    duration: {
      type: Number,
      default: 500
    },
    /**
     * Disable accordion header and only calculate content height from "open" prop
     */
    disableHeader: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const { open } = toRefs(props)
    const accorRef = ref(null)
    const isAccordionOpen = ref(false)
    const contentHeight = ref(0)

    const calculateContentHeight = () => {
      if ((props.disableHeader && !open.value) || (!props.disableHeader && !isAccordionOpen.value)) {
        contentHeight.value = 0
      } else {
        contentHeight.value = accorRef.value?.querySelector('.accordion__inner')?.clientHeight || 0
      }
    }

    const toggleAccordionOpen = () => {
      isAccordionOpen.value = !isAccordionOpen.value
      calculateContentHeight()
    }

    onMounted(() => {
      calculateContentHeight()
      window.addEventListener('resize', debounce(calculateContentHeight, 500))
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', calculateContentHeight)
    })

    watch(open, () => {
      calculateContentHeight()
    })

    return {
      accorRef,
      isAccordionOpen,
      toggleAccordionOpen,
      contentHeight
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.accordion {
  &__header {
    cursor: pointer;
  }

  &__contents {
    height: 0;
    overflow: hidden;
    transition-property: height;
    transition-timing-function: ease-in-out;
  }
}
</style>

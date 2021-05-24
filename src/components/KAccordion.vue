<template>
  <div ref="accorRef" class="accordion">
    <div v-if="open === undefined" class="accordion__header" @click="toggleAccordionOpen">
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
     * Invisible header and only open accordion from this prop
     */
    open: {
      type: Boolean,
      default: undefined
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
    }
  },

  setup(props) {
    const { open } = toRefs(props)
    const accorRef = ref(null)
    const isAccordionOpen = ref(false)
    const contentHeight = ref(0)

    const getContentHeight = () => {
      if (open.value === false || (open.value === undefined && !isAccordionOpen.value)) contentHeight.value = 0
      else contentHeight.value = accorRef.value?.querySelector('.accordion__inner')?.clientHeight || 0
    }

    const toggleAccordionOpen = () => {
      isAccordionOpen.value = !isAccordionOpen.value
      getContentHeight()
    }

    onMounted(() => {
      getContentHeight()
      window.addEventListener('resize', debounce(getContentHeight, 500))
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', getContentHeight)
    })

    watch(open, () => {
      getContentHeight()
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

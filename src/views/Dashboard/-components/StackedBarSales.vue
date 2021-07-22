<template lang="">
  <div class="stacked-bar u-flex u-justify-between u-items-center">
    <div ref="BarSRef" class="stacked-bar__item" />
    <div ref="BarARef" class="stacked-bar__item" />
    <div ref="BarBRef" class="stacked-bar__item" />
    <div ref="BarCRef" class="stacked-bar__item" />
    <div ref="BarARef" class="stacked-bar__item" />
    <div ref="BarERef" class="stacked-bar__item" />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'StackedBarSales',

  setup() {
    const BarSRef = ref()
    const BarARef = ref()
    const BarBRef = ref()
    const BarCRef = ref()
    const BarDRef = ref()
    const BarERef = ref()

    return {
      BarSRef,
      BarARef,
      BarBRef,
      BarCRef,
      BarDRef,
      BarERef
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.stacked-bar {
  width: 100%;
  height: 12px;
  margin-top: 12px;

  &__item {
    height: 100%;
    width: 100%;
    position: relative;

    &:after {
      @include flexbox(center, center);

      position: absolute;
      top: -6px;
      right: -12px;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      content: 'S';
      background-color: $color-additional-blue-6;
      z-index: 1;
    }
  }

  &__item:first-child {
    background-color: $color-additional-blue-6;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
  }

  &__item:last-child {
    background-color: #EB5757; // FIXME
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;

    &:after {
      display: none;
    }
  }
}
</style>

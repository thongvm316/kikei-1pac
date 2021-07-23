<template lang="">
  <div class="stacked-bar">
    <div ref="BarSRef" class="stacked-bar__item">
      <span>S</span>
    </div>
    <div ref="BarARef" class="stacked-bar__item">
      <span>A</span>
    </div>
    <div ref="BarBRef" class="stacked-bar__item">
      <span>B</span>
    </div>
    <div ref="BarCRef" class="stacked-bar__item">
      <span>C</span>
    </div>
    <div ref="BarDRef" class="stacked-bar__item">
      <span>D</span>
    </div>
    <div ref="BarERef" class="stacked-bar__item">
      <span>E</span>
    </div>
    <div ref="BarERef" class="stacked-bar__item"></div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'StackedBarSales',

  setup() {
    const BarSRef = ref()
    const BarARef = ref()
    const BarBRef = ref()
    const BarCRef = ref()
    const BarDRef = ref()
    const BarERef = ref()

    onMounted(() => {
      BarSRef.value.style.width = '20%'
      BarARef.value.style.width = '10%'
      BarBRef.value.style.width = '30%'
      BarCRef.value.style.width = '15%'
      BarDRef.value.style.width = '25%'
      BarERef.value.style.width = '24%'
    })

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
  @include flexbox(center, center);
  height: 12px;
  margin: 12px 32px;

  &__item {
    height: 100%;
    width: 100%;
    position: relative;
    background-color: $color-grey-100;

    span {
      @include flexbox(center, center);

      position: absolute;
      content: '';
      top: -6px;
      right: -12px;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background-color: $color-grey-85;
      z-index: 1;
    }
  }

  &__item:first-child {
    background-color: $color-additional-blue-6;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;

    span {
      background-color: $color-additional-blue-6;
    }
  }

  &__item:last-child {
    background-color: $color-additional-red-6;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
  }
}
</style>

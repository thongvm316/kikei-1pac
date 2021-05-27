<template>
  <ul class="tab">
    <li
      v-for="tab in tabs"
      :key="tab.value"
      :class="['tab__item', { 'is-active': tabActive === tab.value }]"
      @click="clickTab(tab.value)">{{ tab.label }}</li>
  </ul>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent ({
  name: 'KTabs',

  props: {
    tabs: Array,
    tabActive: String
  },

  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()

    const emitChangeTab = tab => emit('update:tabActive', tab)

    const clickTab = tab => {
      router.push({ query: { ...route.query, tab } })
      emitChangeTab(tab)
    }

    onMounted(() => {
      const { tab } = router.currentRoute._value.query
      if (!tab) return

      const indexValue = props.tabs.findIndex(item => item.value === tab)
      if (indexValue < 0) return

      emitChangeTab(tab)
    })

    return { clickTab }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.tab {
  @include flexbox(flex-start, flex-start);

  padding: 0 32px;
  background-color: $color-grey-100;
  border: 1px solid $color-grey-75;

  &__item {
    color: $color-grey-55;
    font-size: 14px;
    line-height: 22px;
    padding: 11px 0;
    cursor: pointer;

    &:not(:last-child) {
      margin-right: 24px;
    }

    &.is-active {
      color: $color-primary-10;
      font-weight: 800;
      position: relative;

      &:before {
        position: absolute;
        content: '';
        height: 4px;
        width: 100%;
        background-color: $color-primary-10;
        bottom: 0;
      }
    }
  }
}
</style>

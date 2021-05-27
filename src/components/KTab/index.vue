<template>
  <div>
    <ul class="tab">
      <li
        v-for="tab in tabsList"
        :key="tab.id"
        :class="['tab__item', { 'is-active': tabActive === tab.name.toLowerCase() }]"
        @click="onClickTab(tab.name)">{{ tab.name }}</li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent ({
  name: 'KTab',

  props: {
    tabsList: Array,
    tabActive: String
  },

  setup(props, context) {
    const router = useRouter()
    const route = useRoute()

    const onClickTab = name => {
      router.push({
        name: 'deposit',
        query: {
          ...route.query,
          tab: name.toLowerCase()
        },
      })

      context.emit('update:tabActive', name.toLowerCase())
    }

    onMounted(() => {
      const currentTapParam = router.currentRoute._value.query.tab?.toLowerCase()
      const nameTabList = props.tabsList.map(item => item.name.toLowerCase())

      if (!nameTabList.includes(currentTapParam)) return
      context.emit('update:tabActive', currentTapParam)
    })

    return {
      onClickTab
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/variables';

.tab {
  display: flex;
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

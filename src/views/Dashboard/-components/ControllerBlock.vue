<template>
  <div class="controller-block u-flex u-justify-between u-items-center u-mx-32">
    <p class="controller-block__title">{{ title }}</p>
    <div class="u-flex u-justify-between u-items-center">
      <div class="u-flex u-justify-between u-items-center">
        <div class="button-order">
          <a-button
            v-if="myBlock?.order !== 0"
            type="link"
            class="controller-block__triangle"
            @click="$emit('on-swap-block-order', { id: blockId, mode: ORDER_UP })"
          >
            <template #icon>
              <triangle-up-icon />
            </template>
          </a-button>

          <span class="button-order__tooltip">上に移動</span>
        </div>

        <div class="button-order">
          <a-button
            v-if="myBlock?.order !== dashboardBlocks?.length - 1"
            type="link"
            class="controller-block__triangle"
            @click="$emit('on-swap-block-order', { id: blockId, mode: ORDER_DOWN })"
          >
            <template #icon>
              <triangle-down-icon />
            </template>
          </a-button>

          <span class="button-order__tooltip">下に移動</span>
        </div>
      </div>

      <a-tooltip color="#fff" :title="isShowBlockContent ? '閉じる' : '開く'">
        <a-button type="default" class="controller-block__toogle-icon" @click="handleToggleShowContent">
          <template #icon>
            <minus-icon v-if="isShowBlockContent" />
            <add-icon v-else />
          </template>
        </a-button>
      </a-tooltip>
    </div>
  </div>

  <!-- block content -->
  <a-collapse v-model:activeKey="activeKey" :bordered="false" class="controller-collapse u-mt-8">
    <a-collapse-panel key="1">
      <a-tabs
        v-if="!isUnvisibleGroupTab"
        v-model:active-key="groupActive"
        default-active-key="1"
        :animated="false"
        @change="onHandleChangeGroup"
      >
        <a-tab-pane v-for="group in groupList" :key="group.id" :tab="group.name" />
      </a-tabs>

      <slot />
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { find } from 'lodash-es'
import { useStore } from 'vuex'

import { ORDER_UP, ORDER_DOWN } from '@/enums/dashboard.enum'
import services from '@/services'
import storageKeys from '@/enums/storage-keys'
import { deepCopy } from '@/helpers/json-parser'

import TriangleUpIcon from '@/assets/icons/ico_triangle_up.svg'
import TriangleDownIcon from '@/assets/icons/ico_triangle_down.svg'
import MinusIcon from '@/assets/icons/ico_minus.svg'
import AddIcon from '@/assets/icons/ico_add.svg'

export default defineComponent({
  name: 'ControllerBlock',

  components: {
    TriangleUpIcon,
    TriangleDownIcon,
    MinusIcon,
    AddIcon
  },

  props: {
    blockId: {
      type: Number,
      require: true
    },
    title: String,
    groupList: Object,
    isUnvisibleGroupTab: {
      type: Boolean,
      default: false
    }
  },

  emits: ['on-swap-block-order', 'on-change-group'],

  setup(props, { emit }) {
    const store = useStore()
    const StorageService = services.get('StorageService')

    const groupActive = ref()
    const isShowBlockContent = ref(true)
    const activeKey = ref(['1'])

    const dashboardBlocks = computed(() => store.state.dashboard.blocks)

    const onHandleChangeGroup = (id) => {
      const allGroupId = props.groupList
        .filter((group) => group.id !== 0)
        .reduce((acc, group) => {
          acc += acc ? ',' + group.id : group.id
          return acc
        }, '')

      const params = { groupId: id > 0 ? id : allGroupId }
      emit('on-change-group', params)

      // update groupId in store
      const _dashboardBlocks = dashboardBlocks.value.map((block) => ({
        ...block,
        groupId: block.id === props.blockId ? id : block.groupId
      }))

      updateBlockStore(_dashboardBlocks)
    }

    const handleToggleShowContent = () => {
      isShowBlockContent.value = !isShowBlockContent.value
      activeKey.value = activeKey.value.length > 0 ? [] : ['1']
    }

    const myBlock = computed(() => find(store.state.dashboard.blocks, { id: props.blockId }))

    const updateBlockStore = (data) => {
      StorageService.set(storageKeys.dashboardBlocks, data)
      store.commit('dashboard/STORE_DASHBOARD_BLOCKS', deepCopy(data))
    }

    return {
      groupActive,
      ORDER_UP,
      ORDER_DOWN,
      myBlock,
      isShowBlockContent,
      activeKey,
      dashboardBlocks,

      onHandleChangeGroup,
      handleToggleShowContent
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.controller-block {
  &__title {
    color: $color-grey-15;
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
    margin-bottom: 0;
  }

  &__triangle {
    @include flexbox(center, center);
    width: 18px;
    height: 24px;
    width: 20px;
    color: $color-grey-75;

    &:hover {
      color: $color-grey-55;
    }
  }

  &__toogle-icon {
    @include flexbox(center, center);
    height: 24px;
    width: 24px;
    margin-left: 32px;
  }
}

.controller-collapse {
  width: 100%;

  .ant-collapse-header {
    display: none;
  }

  .ant-collapse-content-box {
    padding: 0 !important;
  }

  .ant-collapse-item {
    border-bottom: 0;
  }
}

.controller-collapse.ant-collapse-borderless {
  background-color: transparent;
}

.button-order {
  position: relative;

  &:hover &__tooltip {
    display: inline-block
  }

  &__tooltip {
    @include x-centered();
    bottom: calc(100% + 4px);
    display: inline-block;
    padding: 6px 8px;
    white-space: nowrap;
    background-color: $color-grey-100;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    border-radius: 2px;
    z-index: 200;
    display: none;

    &:before {
      @include x-centered();
      content: '';
      width: 5px;
      height: 5px;
      background-color: $color-grey-100;
      box-shadow: 3px 3px 7px rgb(0 0 0 / 7%);
      transform: translateX(-50%) rotate(45deg);
      top: calc(100% - 3px);
      z-index: 200;
    }
  }
}
</style>

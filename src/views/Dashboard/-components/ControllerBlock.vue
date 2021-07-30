<template>
  <div class="controller-block u-flex u-justify-between u-items-center u-mx-32">
    <p class="ontroller-block__title">{{ title }}</p>
    <div class="u-flex u-justify-between u-items-center">
      <div class="u-flex u-justify-between u-items-center">
        <a-tooltip color="#fff" title="上に移動">
          <a-button
            v-if="myBlock?.order !== 0"
            type="link"
            class="controller-block__triangle u-flex u-justify-center u-items-center"
            @click="$emit('on-swap-block-order', { id: blockId, mode: ORDER_UP })"
          >
            <template #icon>
              <triangle-up-icon />
            </template>
          </a-button>
        </a-tooltip>

        <a-tooltip color="#fff" title="下に移動">
          <a-button
            v-if="myBlock?.order !== dashboardBlocks?.length - 1"
            type="link"
            class="controller-block__triangle u-flex u-justify-center u-items-center"
            @click="$emit('on-swap-block-order', { id: blockId, mode: ORDER_DOWN })"
          >
            <template #icon>
              <triangle-down-icon />
            </template>
          </a-button>
        </a-tooltip>
      </div>

      <a-tooltip color="#fff" :title="isShowBlockContent ? '閉じる' : '開く'">
        <a-button
          type="default"
          class="u-flex u-justify-center u-items-center u-ml-32"
          @click="handleToggleShowContent"
        >
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
  }

  &__triangle {
    width: 18px;

    &:hover {
      color: $color-grey-55;
    }
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
</style>

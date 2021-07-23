<template>
  <div class="controller-block u-flex u-justify-between u-items-center">
    <p>{{ title }}</p>
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
            v-if="myBlock?.order !== blockList.length - 1"
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
    <a-collapse-panel key="1" class="u-mx-n32">
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

import { ORDER_UP, ORDER_DOWN } from '@/enums/dashboard.enum'

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
    blockList: Object,
    title: String,
    groupList: Object,
    isUnvisibleGroupTab: {
      type: Boolean,
      default: false
    }
  },

  emits: ['on-swap-block-order'],

  setup(props) {
    const groupActive = ref()
    const isShowBlockContent = ref(true)
    const activeKey = ref(['1'])

    const onHandleChangeGroup = () => {}

    const handleToggleShowContent = () => {
      isShowBlockContent.value = !isShowBlockContent.value
      activeKey.value = activeKey.value.length > 0 ? [] : ['1']
    }

    const myBlock = computed(() => find(props.blockList, { id: props.blockId }))

    return {
      groupActive,
      ORDER_UP,
      ORDER_DOWN,
      myBlock,
      isShowBlockContent,
      activeKey,

      onHandleChangeGroup,
      handleToggleShowContent
    }
  }
})
</script>

<style lang="scss">
.controller-block {
  &__triangle {
    width: 18px;
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

  .ant-collapse-borderless {
    background-color: transparent !important;
  }
}
</style>

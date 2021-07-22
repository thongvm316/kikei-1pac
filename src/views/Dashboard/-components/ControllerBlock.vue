<template>
  <div class="controller-table u-flex u-justify-between u-items-center">
    <p>{{ title }}</p>
    <div class="u-flex u-justify-between u-items-center">
      <div class="u-flex u-justify-between u-items-center">
        <a-tooltip color="#fff" title="上に移動">
          <a-button
            v-if="myBlock?.order !== 0"
            type="link"
            class="controller-table__triangle u-flex u-justify-center u-items-center"
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
            class="controller-table__triangle u-flex u-justify-center u-items-center"
            @click="$emit('on-swap-block-order', { id: blockId, mode: ORDER_DOWN })"
          >
            <template #icon>
              <triangle-down-icon />
            </template>
          </a-button>
        </a-tooltip>
      </div>

      <a-tooltip color="#fff" :title="isShowBlockContent ? 'Hide' : 'Show'">
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
  <div v-show="isShowBlockContent">
    <a-tabs
      v-model:active-key="groupActive"
      default-active-key="1"
      class="u-mx-n32 u-mt-8"
      :animated="false"
      @change="onHandleChangeGroup"
    >
      <a-tab-pane v-for="group in groupList" :key="group.id" :tab="group.name" />
    </a-tabs>

    <slot></slot>
  </div>
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
    blockId: Number,
    blockList: Object,
    title: String,
    groupList: Object
  },

  emits: ['on-swap-block-order'],

  setup(props) {
    const groupActive = ref()
    const isShowBlockContent = ref(true)

    const onHandleChangeGroup = () => {}

    const handleToggleShowContent = () => {
      isShowBlockContent.value = !isShowBlockContent.value
    }

    const myBlock = computed(() => find(props.blockList, { id: props.blockId }))

    return {
      groupActive,
      ORDER_UP,
      ORDER_DOWN,
      myBlock,
      isShowBlockContent,

      onHandleChangeGroup,
      handleToggleShowContent
    }
  }
})
</script>

<style lang="scss">
.controller-table {
  &__triangle {
    width: 18px;
  }
}
</style>

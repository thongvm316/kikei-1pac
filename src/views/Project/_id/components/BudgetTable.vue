<template>
  <a-collapse v-model:activeKey="activeKey" class="project-budget-table">
    <a-collapse-panel key="1" header="予算">
      <a-button @click="handleOpenCostModal(COST_MODAL_TYPES[0].id)">Open modal 3</a-button>
      <a-button @click="handleOpenCostModal(COST_MODAL_TYPES[1].id)">Open modal 4</a-button>
      <a-button @click="handleOpenCostModal(COST_MODAL_TYPES[2].id)">Open modal 5</a-button>
    </a-collapse-panel>
  </a-collapse>

  <CostsModal
    v-if="isCostsModalOpen"
    v-model:visible="isCostsModalOpen"
    :title="titleCostModal"
    :cost-modal-type="costModalType"
  />
</template>

<script>
import { defineComponent, ref } from 'vue'
import { find } from 'lodash-es'

import CostsModal from './CostsModal'

import { COST_MODAL_TYPES } from '@/enums/project.enum'

export default defineComponent({
  name: 'ProjectBudgetTable',

  components: {
    CostsModal
  },

  setup() {
    const activeKey = ref(['1'])

    // costs modal
    const isCostsModalOpen = ref(false)
    const titleCostModal = ref('')
    const costModalType = ref()

    const handleOpenCostModal = (typeId) => {
      const costFound = find(COST_MODAL_TYPES, { id: typeId })
      if (!costFound) return

      isCostsModalOpen.value = true
      titleCostModal.value = costFound.title
      costModalType.value = typeId
    }

    return {
      isCostsModalOpen,

      COST_MODAL_TYPES,
      activeKey,
      titleCostModal,
      costModalType,

      handleOpenCostModal
    }
  }
})
</script>

<style lang="scss">
.project-budget-table {

}
</style>

<template>
  <a-modal
    v-model:visible="visible"
    class="estimate-money-modal"
    width="320px"
    centered
    title="受注金額の予算"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-spin :spinning="loading">
        <div class="list">
          <div v-for="item in projectMoneyEstimate" :key="item.id" class="list__item">
            <p>予測 ({{ item.month }})</p>
            <p>{{ item.estimateMoney }} ({{ item.currencyCode }})</p>
          </div>
        </div>
      </a-spin>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, onBeforeMount, ref } from 'vue'
import { getProjectMoneyEstimate } from '../../composables/useProject'

export default defineComponent({
  name: 'EstimateMoneyModal',

  props: {
    project: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const visible = ref()
    const projectMoneyEstimate = ref([])
    const loading = ref()

    const fetchProjectMoneyEstimate = async () => {
      loading.value = true
      try {
        const { data: projectMoneyEstimateRes } = await getProjectMoneyEstimate({
          projectId: props?.project?.value?.id
        })

        projectMoneyEstimate.value = projectMoneyEstimateRes
      } finally {
        loading.value = false
      }
    }

    onBeforeMount(() => {
      fetchProjectMoneyEstimate()
    })

    return {
      visible,
      projectMoneyEstimate,
      loading
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';

.estimate-money-modal {
  p {
    margin-bottom: 0;
    font-size: 12px;
  }

  .ant-modal-footer {
    padding: 16px 24px;
    text-align: left;
    max-height: 206px;
    overflow-y: scroll;
  }

  .list {
    &__item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;

      &:not(:last-child) {
        border-bottom: 1px solid $color-grey-85;
      }
    }
  }
}
</style>

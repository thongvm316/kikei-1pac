<template>
  <a-modal v-model:visible="visible" centered title="金額変更詳細" width="390px" class="money-history-modal">
    <template #footer>
      <div v-for="item in moneyHistory" :key="item.id" class="money-history">
        <p>{{ item.createdAt }}</p>
        <p>{{ item.money }} ({{ item.adCurrency.code }})</p>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MoneyHistoryModal',

  props: {
    project: Object
  },

  setup(props, { emit }) {
    const visible = ref()

    const moneyHistory = computed(() => props.project.value?.adProjectMoneyHistory || [])

    const handleCancel = () => {
      emit('update:visible', false)
    }

    return {
      visible,
      moneyHistory,
      handleCancel
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';

.money-history-modal {
  .ant-modal-footer {
    text-align: left;
    padding: 16px 24px 10px;
    max-height: 172px;
    overflow-y: auto;
  }

  .money-history {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    line-height: 18px;
    color: $color-grey-15;
    border-bottom: 1px solid $color-grey-85;
    padding-bottom: 6px;

    &:not(:first-child) {
      padding-top: 6px;
    }

    p {
      margin-bottom: 0;
    }
  }
}
</style>

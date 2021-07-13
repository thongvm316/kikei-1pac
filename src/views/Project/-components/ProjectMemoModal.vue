<template>
  <a-modal v-model:visible="visible" class="project-memo-modal" title="メモ" width="700px">
    <template #footer>
      <div class="project-memo-modal__content">
        <div class="project-memo-modal__label">メモ:</div>
        <div class="project-memo-modal__text">
          <p v-if="toggleShow && initMemo?.length > 175">
            {{ initMemo?.slice(0, 175) }}...<span class="project-memo-modal__toggle-btn" @click="toggleShow = false"
              >もっと見る</span
            >
          </p>
          <p v-else>
            {{ initMemo }}
            <span v-if="initMemo?.length > 175" class="project-memo-modal__toggle-btn" @click="toggleShow = true"
              >表示を縮小</span
            >
          </p>
        </div>
      </div>

      <div class="project-memo-modal__content">
        <div class="project-memo-modal__label">外注:</div>
        <div class="project-memo-modal__text">
          <p v-for="item in memoRecordSelected?.adProjectOrders" :key="item.id">
            {{ item.adCompany.name }}
            <span class="u-ml-12 u-mr-12">-</span>
            {{ item.money }} (JPY)
          </p>
        </div>
      </div>

      <div class="project-memo-modal__content">
        <div class="project-memo-modal__label">タグ:</div>
        <div class="project-memo-modal__tags">
          <a-tag v-for="item in memoRecordSelected?.tags" :key="item.id">
            {{ item }}
          </a-tag>
        </div>
      </div>

      <div class="project-memo-modal__content">
        <div class="project-memo-modal__label">顧客担当:</div>
        <div class="project-memo-modal__text">
          <p>{{ memoRecordSelected?.accountName }}</p>
        </div>
      </div>

      <div class="project-memo-modal__content">
        <div class="project-memo-modal__label">ディレクタ (予定):</div>
        <div class="project-memo-modal__text">
          <p>{{ memoRecordSelected?.director }}</p>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ProjectMemoModal',

  props: {
    memoRecordSelected: Object
  },

  setup(props, { emit }) {
    const visible = ref()
    const toggleShow = ref(true)
    const initMemo = computed(() => {
      return props.memoRecordSelected?.memo
    })

    const handleCancel = () => {
      emit('update:visible', false)
    }

    return {
      visible,
      initMemo,
      toggleShow,

      handleCancel
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';

.project-memo-modal {
  color: $color-grey-15;

  p {
    margin-bottom: 0;
  }

  .ant-modal-footer {
    padding: 16px 76px;
    text-align: left;
  }

  &__content + &__content {
    margin-top: 16px;
  }

  &__content {
    display: flex;
  }

  &__label {
    white-space: nowrap;
  }

  &__tags {
    margin-left: 24px;
    margin-top: -8px;

    .ant-tag {
      background-color: $color-grey-85;
      color: $color-grey-15;
      font-size: 12px;
      line-height: 18px;
      font-weight: normal;
      padding: 4px 8px;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 82px;

      + .ant-tag {
        margin-top: 8px;
      }
    }
  }

  &__text {
    margin-left: 24px;

    p + p {
      margin-top: 8px;
    }
  }

  &__toggle-btn {
    cursor: pointer;
    color: $color-additional-blue-6;
  }
}
</style>

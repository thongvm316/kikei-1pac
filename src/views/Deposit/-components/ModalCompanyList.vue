<template>
  <a-modal :visible="visible" width="800px" title="会社一覧" @ok="handleOk">
    <template #footer>
      <div class="modal-company">
        <div class="modal-company__left">
          <a-form ref="companyRef" :model="params" :rules="companyFormRules" layout="vertical" @submit="onSubmitForm">
            <a-form-item name="title" label="項目名">
              <a-input v-model:value="params.title" placeholder="入力してください" />
            </a-form-item>

            <a-form-item name="types" label="区分">
              <a-checkbox-group v-model:value="types" :options="typeOptions" />
            </a-form-item>

          </a-form>
        </div>
        <div class="modal-company__right">Table</div>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'

export default defineComponent({
  name: 'DepositCompanyList',

  props: {
    visible: {
      type: Boolean,
      required: true
    },
    company: {
      type: Number,
      required: true
    }
  },

  setup(props, context) {
    const localCompany = ref()

    const typeOptions = ['customer', 'partner']

    const params = reactive({
      title: '',
      types: []
    })

    const companyFormRules = []

    const handleOk = () => {
      context.emit('update:company', localCompany.value)
      context.emit('update:visible', false)
    }

    return {
      params,
      companyFormRules,
      typeOptions,
      handleOk
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.modal-company {
  @include flexbox(null, flex-start);
  flex-direction: row;

  &__left {
    width: 296px;
    background-color: $color-grey-94;
  }

  &__right {
    flex-grow: 1;
  }
}
</style>

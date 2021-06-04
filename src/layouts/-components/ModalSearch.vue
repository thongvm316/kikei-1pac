<template>
  <section class="modal">
    <a-button class="btn-modal" type="primary" @click="showModal"><add-icon class="add-icon" /> 新規企業追加</a-button>
    <a-modal v-model:visible="visible" width="800px" title="Basic Modal" @ok="handleOk">
      <template #footer>
        <a-button @click="handleCancel">クリア</a-button>
        <a-button type="primary">
          <template #icon>
            <span class="btn-icon">
              <search-icon />
            </span>
          </template>
          Submit
        </a-button>
      </template>
    </a-modal>
  </section>
</template>

<script>
import { defineComponent, ref } from 'vue'
import SearchIcon from '@/assets/icons/ico_search.svg'
import AddIcon from '@/assets/icons/ico_line-add.svg'

export default defineComponent({
  name: 'ModalSearch',

  components: {
    SearchIcon,
    AddIcon
  },

  setup() {
    const plainOptions = ['Apple', 'Pear', 'Orange']
    const checkedList = ref(['Apple', 'Orange'])
    const visible = ref(false)

    const handleCancel = () => {
      visible.value = false
    }

    const showModal = () => {
      visible.value = true
    }

    const handleOk = () => {
      visible.value = false
    }

    const onChange = () => {}

    return {
      plainOptions,
      checkedList,
      visible,
      handleCancel,
      showModal,
      handleOk,
      onChange,
      SearchIcon,
      AddIcon
    }
  },

  data() {
    return {
      input: ''
    }
  }
})
</script>

<style scoped lang="scss">
.modal {
  margin-bottom: 16px;
  text-align: -webkit-right;

  .btn-modal {
    width: auto;
    height: 24px;
    border-radius: 2px;
    padding: 1px 8px;
    text-align: center;
    display: flex;
    align-items: center;

    .add-icon {
      margin-right: 10.33px;
    }
  }
}
</style>

<template>
  <div>
    <a-date-picker />
    <a-button type="primary">Button</a-button>
    <a-button type="primary" shape="circle">
      <template #icon>
        <span class="btn-icon">
          <project-icon />
        </span>
      </template>
    </a-button>
    <a-button type="primary" shape="circle" size="small">
      <template #icon>
        <span class="btn-icon">
          <project-icon />
        </span>
      </template>
    </a-button>

    <a-button type="primary" shape="circle" size="small">
      <template #icon>
        <span class="btn-icon">
          <project-icon />
        </span>
      </template>
    </a-button>

    <a-button>Default</a-button>
    <a-button type="danger" ghost>Danger</a-button>
    <a-button disabled type="primary">
      <template #icon>
        <span class="btn-icon"><project-icon /></span>
      </template>
      Search
    </a-button>
    <div>
      <a-button disabled type="link">Link</a-button>
      <a-button type="link">Link</a-button>
    </div>

    <a-checkbox-group v-model:value="checkedList" :options="plainOptions" @change="onChange" />

     <a-pagination
      v-model:current="page"
      :total="101"
      :show-total="(total, range) => `${range[0]}-${range[1]} / ${total}件`"
      :page-size="10"
      size="small" />

    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-modal v-model:visible="visible" width="800px" title="Basic Modal" @ok="handleOk">
      <template #footer>
        <a-button @click="handleCancel">クリア</a-button>
        <a-button type="primary" @click="handleOk">
          <template #icon>
            <span class="btn-icon">
              <search-icon />
            </span>
          </template>
          Submit
        </a-button>
      </template>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import ProjectIcon from '@/assets/icons/ico_project.svg'
import SearchIcon from '@/assets/icons/ico_search.svg'

export default defineComponent({
  name: 'Dashboard',

  components: {
    ProjectIcon,
    SearchIcon
  },

  setup() {
    const plainOptions = ['Apple', 'Pear', 'Orange'];
    const checkedList = ref(['Apple', 'Orange'])
    const page = ref(3)
    const visible = ref(false)

    const onChange = () => {
      console.log('dsalkdksa')
    }

    const handleCancel = () => {
      visible.value = false
    }

    const showModal = () => {
      visible.value = true
    };

    const handleOk = e => {
      visible.value = false
    };

    return {
      page,
      plainOptions,
      checkedList,
      onChange,
      visible,
      showModal,
      handleOk,
      handleCancel
    }
  }
})
</script>

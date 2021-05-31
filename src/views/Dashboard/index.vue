<template>
  <div>
    <a-date-picker />
    <a-button type="primary">Button</a-button>
    <a-button type="primary" shape="circle">
      <template #icon>
        <search-outlined />
      </template>
    </a-button>
    <a-button type="primary" shape="circle" size="small">
      <template #icon>
        <search-outlined />
      </template>
    </a-button>

    <a-button disabled type="primary" shape="circle" size="small">
      <template #icon>
        <search-outlined />
      </template>
    </a-button>

    <a-button>Default</a-button>
    <a-button type="danger" ghost>Danger</a-button>
    <a-button disabled type="primary">
      <template #icon><search-outlined /></template>
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
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import ProjectIcon from '@/assets/icons/ico_project.svg'
import { SearchOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'Dashboard',

  components: {
    ProjectIcon,
    SearchOutlined
  },

  setup() {
    const plainOptions = ['Apple', 'Pear', 'Orange'];
    const checkedList = ref(['Apple', 'Orange'])
    const page = ref(3)

    const onChange = () => {
      console.log('dsalkdksa')
    }

    return {
      page,
      plainOptions,
      checkedList,
      onChange
    }
  }
})
</script>

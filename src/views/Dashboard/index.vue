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
      size="small"
    />

    <a-button type="primary" @click="showModal">Open Modal</a-button>
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
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>

    <div style="padding: 24px">
      <a-table
        :columns="columns"
        :data-source="data"
        :row-selection="rowSelection"
        :pagination="false"
        :expand-icon-column-index="expandIconColumnIndex"
        :expand-icon-as-cell="false"
      >
        <template #action="{ record }">
          <a-button :disabled="record.disabled" type="primary">確定</a-button>
        </template>

        <template #expandIcon="{ expanded, onExpand }">
          <arrow-up-icon v-if="expanded" class="u-cursor-pointer" @click="onExpand" />
          <arrow-down-icon v-else class="u-cursor-pointer" @click="onExpand" />
        </template>

        <template #expandedRowRender="{ record }">
          <p style="margin: 0">
            {{ record.description }}
          </p>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import ProjectIcon from '@/assets/icons/ico_project.svg'
import SearchIcon from '@/assets/icons/ico_search.svg'
import ArrowDownIcon from '@/assets/icons/ico_arrow_down.svg'
import ArrowUpIcon from '@/assets/icons/ico_arrow_up.svg'

// test
const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'Action', dataIndex: '', key: 'x', slots: { customRender: 'action' } },
  { title: '', dataIndex: 'xxx', key: 'xxx' }
]

const data = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    disabled: true
  },
  {
    key: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
    disabled: false
  },
  {
    key: 3,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
    disabled: false
  }
]

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}

const expandIconColumnIndex = 5

export default defineComponent({
  name: 'Dashboard',

  components: {
    ProjectIcon,
    SearchIcon,
    ArrowDownIcon,
    ArrowUpIcon
  },

  setup() {
    const plainOptions = ['Apple', 'Pear', 'Orange']
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
    }

    const handleOk = (e) => {
      visible.value = false
    }

    return {
      page,
      plainOptions,
      checkedList,
      onChange,
      visible,
      showModal,
      handleOk,
      handleCancel,
      data,
      columns,
      rowSelection,
      expandIconColumnIndex
    }
  }
})
</script>

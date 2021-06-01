<template>
  <div class="u-mx-32">
    <div class="u-flex u-justify-end u-mt-24 u-mb-16">
      <a-button>
        <template #icon><span class="btn-icon"><line-down-icon /></span></template>
        CSVファイルダウンロード
      </a-button>

      <a-button type="primary" class="u-ml-12">
        <template #icon><span class="btn-icon"><line-add-icon /></span></template>
        新規入出金追加
      </a-button>
    </div>

    <div class="u-flex u-justify-between u-mb-24">
      <a-checkbox v-model:checked="checkAll">チェックした項目全てを確定する</a-checkbox>

      <a-select
        v-model:value="value"
        show-arrow
        :maxTagCount="0"
        mode="multiple"
        placeholder="Select a bank"
        style="width: 200px"
        option-label-prop="label"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      >
        <template #maxTagPlaceholder>
          dsaas
        </template>
        <!-- <template #dropdownRender>
        <p>dsmnmkdsa</p>
        </template> -->
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
          <a-select-option value="tom">Tom</a-select-option>
      </a-select>

      <a-pagination
        v-model:current="page"
        :total="101"
        :show-total="(total, range) => `${range[0]}-${range[1]} / ${total}件`"
        :page-size="10"
        size="small" />
    </div>

    <div class="-mx-32">
      <a-table
        :columns="columns"
        :data-source="data"
        :row-selection="rowSelection"
        :pagination="false"
        :expand-icon-column-index="expandIconColumnIndex"
        :expand-icon-as-cell="false">
        <template #action="{ record }">
          <a-button :disabled="record.disabled" type="primary">確定</a-button>
        </template>

        <template #expandIcon="{ expanded, onExpand }">
          <arrow-up-icon class="u-cursor-pointer" @click="onExpand" v-if="expanded" />
          <arrow-down-icon class="u-cursor-pointer" v-else @click="onExpand" />
        </template>

        <!-- <template #expandedRowRender="{ record }">
          <p style="margin: 0">
            {{ record.description }}
          </p>
        </template> -->
      </a-table>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import LineDownIcon from '@/assets/icons/ico_line-down.svg'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'
import ArrowDownIcon from '@/assets/icons/ico_arrow_down.svg'
import ArrowUpIcon from '@/assets/icons/ico_arrow_up.svg'

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'Action', dataIndex: '', key: 'x', width: '10px'	, slots: { customRender: 'action',  } },
  { title: '', dataIndex: 'xxx', key: 'xxx' }
]

const data = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    disabled: true,

    children: [
      {
        key: 1,
        name: 'Nghia',
        age: 25,
        address: '1Pac'
      }
    ]
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
  },

  columnWidth: '10px',
  columnTitle: undefined
};

const expandIconColumnIndex = 5

export default defineComponent({
  name: 'DepositPage',

  components: {
    LineDownIcon,
    LineAddIcon,
    ArrowDownIcon,
    ArrowUpIcon
  },

  setup() {
    // checkbox
    const checkAll = ref(false)

    // select search
    const value = ref([])

    const handleChange = (value) => {
      console.log(`selected ${value}`)
    }
    const handleBlur = () => {
      console.log('blur')
    }
    const handleFocus = () => {
      console.log('focus')
    }

    // pagination
    const page = ref(3)

    return {
      // checkbox
      checkAll,

      // select search
      value,
      handleBlur,
      handleFocus,
      handleChange,

      // pagination
      page,

      // table
      data,
      columns,
      rowSelection,
      expandIconColumnIndex
    }
  }
})
</script>

<style lang="scss" scoped>
.-mx-32 {
  margin: 0 -32px;
}
</style>

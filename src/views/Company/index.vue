<template>
  <section>
    <Search />

    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="{
          showTotal: showTotal
        }"
        :expand-icon-column-index="expandIconColumnIndex"
        :expand-icon-as-cell="false"
        :scroll="{ y: '100vh' }"
      >
        <template #action="{ record }">
          <a-button :disabled="record.disabled" type="primary">確定</a-button>
        </template>
      </a-table>
    </div>
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import Table from '@/mixins/table.mixin'

const columns = [
  { title: '会社名', dataIndex: '会社名', key: '会社名', sorter: true },
  { title: '会社コード', dataIndex: '会社コード', key: '会社コード', sorter: true },
  { title: '国', dataIndex: '国', key: '国' },
  { title: '通貨', dataIndex: '通貨', key: '通貨' },
  { title: '区分', dataIndex: '区分', key: '区分' }
]

const data = []
for (let i = 0; i < 50; i++) {
  data.push({
    key: i,
    会社名: `Edward King ${i + 1}`,
    会社コード: `${i + 1}`,
    国: 'Japan',
    通貨: 'JPY',
    区分: '顧客、パートナー'
  })
}

const expandIconColumnIndex = 5

import Search from '@/views/Company/Search'

export default defineComponent({
  name: 'CompanyPage',

  components: {
    Search
  },

  mixins: [Table],

  setup() {
    return {
      data,
      columns,
      expandIconColumnIndex
    }
  }
})
</script>

<style scoped lang="scss">
.box-utilities {
  padding: 24px 32px 16px;
  text-align: right;
}
</style>

<template>
  <section>
    <div class="box-utilities">
      <ModalSearch />

      <Pagination />
    </div>

    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :expand-icon-column-index="expandIconColumnIndex"
        :expand-icon-as-cell="false"
        :scroll="{ y: '100vh' }"
      >
        <template #action="{ record }">
          <a-button :disabled="record.disabled" type="primary">確定</a-button>
        </template>

        <template #expandedRowRender="{ record }">
          <p>
            {{ record.description }}
          </p>
        </template>
      </a-table>
    </div>
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import ModalSearch from '@/layouts/-components/ModalSearch'
import Pagination from '@/layouts/-components/Pagination'

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

export default defineComponent({
  name: 'CompanyPage',
  components: {
    Pagination,
    ModalSearch
  },

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

<template>
  <section>
    <Search />
    <div class="box-utilities">
      <ModalSearch />

      <Pagination />
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :scroll="{ y: '100vh' }"
      >

      </a-table>
    </div>
  </section>
</template>

<script>
  import { defineComponent } from 'vue'
  import ModalSearch from '@/layouts/-components/ModalSearch'
  import Pagination from '@/layouts/-components/Pagination'
  import Search from '@/views/Company/Search'

  const columns = [
    { title: '日付', dataIndex: 'date', key: 'date', sorter: true },
    { title: 'ACB-JP', dataIndex: 'acb_jp', key: 'acb_jp' },
    { title: 'ACB-VN', dataIndex: 'acb_vn_1', key: 'acb_vn_1' },
    { title: 'ACB-VN', dataIndex: 'acb_vn_2', key: 'acb_vn_2' },
    { title: 'ACB-VN', dataIndex: 'acb_vn_3', key: 'acb_vn_3' },
    { title: '合計', dataIndex: 'total', key: 'total' }
  ]

  const data = [
  ]
  for (let i = 0; i < 50; i++) {
    data.push({
      key: i,
      date: '20/12/2021',
      acb_jp: '111,323,343,343',
      acb_vn_1: '111,323,3143,343',
      acb_vn_2: '111,323,3143,343',
      acb_vn_3: '111,323,3143,343',
      total: '111,323,341,243'
    })
  }

  export default defineComponent({
    name: 'FinancingPage',
    components: {
      Pagination,
      ModalSearch,
      Search
    },
    setup() {
      return {
        data,
        columns
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

<template>
  <section class="financing">
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

  const data = []
  for (let i = 0; i < 50; i++) {
    data.push({
      key: i,
      date: '20/12/2021',
      acb_jp: `${new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 2
      }).format(Math.random() * 99996999 * (Math.round(Math.random()) ? 1 : -1))}`,
      acb_vn_1: `${new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 2
      }).format(Math.random() * 999933999 * (Math.round(Math.random()) ? 1 : -1))}`,
      acb_vn_2: `${new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 2
      }).format(Math.random() * 99699999 * (Math.round(Math.random()) ? 1 : -1))}`,
      acb_vn_3: `${new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 2
      }).format(Math.random() * 999955599 * (Math.round(Math.random()) ? 1 : -1))}`,
      total: `${new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 2
      }).format(Math.random() * 999999999 * (Math.round(Math.random()) ? 1 : -1))}`
    })
  }

  export default defineComponent({
    name: 'FinancingPage',
    components: {
      Pagination,
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

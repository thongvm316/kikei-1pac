<template>
  <section class="financing">
    <Search />

    <a-button class="btn-download" @click="downloadCSV">
      <DownloadIcon class="btn-download-icon" />
      CSVファイルダウンロード
    </a-button>

    <div class="box-utilities">
      <Pagination />
    </div>

    <div>
      <a-table :columns="columns" :data-source="data" :pagination="false" :scroll="{ y: '100vh' }">
        <template #acb_jp="{ text: acb_jp }">
          <span :class="parseInt(acb_jp) < 0 ? 'text--red' : ''" @click="showNumberCell(acb_jp)">
            {{ acb_jp }}
          </span>
        </template>
        <template #acb_vn_1="{ text: acb_vn_1 }">
          <span :class="parseInt(acb_vn_1) < 0 ? 'text--red' : ''">
            {{ acb_vn_1 }}
          </span>
        </template>
        <template #acb_vn_2="{ text: acb_vn_2 }">
          <span :class="parseInt(acb_vn_2) < 0 ? 'text--red' : ''">
            {{ acb_vn_2 }}
          </span>
        </template>
        <template #acb_vn_3="{ text: acb_vn_3 }">
          <span :class="parseInt(acb_vn_3) < 0 ? 'text--red' : ''">
            {{ acb_vn_3 }}
          </span>
        </template>
      </a-table>
    </div>
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import Pagination from '@/layouts/-components/Pagination'
import Search from '@/views/Financing/Search'

import DownloadIcon from '@/assets/icons/ico_line-down.svg'

const columns = [
  { title: '日付', dataIndex: 'date', key: 'date', sorter: true },
  { title: 'ACB-JP', dataIndex: 'acb_jp', key: 'acb_jp', slots: { customRender: 'acb_jp' } },
  { title: 'ACB-VN', dataIndex: 'acb_vn_1', key: 'acb_vn_1', slots: { customRender: 'acb_vn_1' } },
  { title: 'ACB-VN', dataIndex: 'acb_vn_2', key: 'acb_vn_2', slots: { customRender: 'acb_vn_1' } },
  { title: 'ACB-VN', dataIndex: 'acb_vn_3', key: 'acb_vn_3', slots: { customRender: 'acb_vn_1' } },
  { title: '合計', dataIndex: 'total', key: 'total' }
]

const data = []
for (let i = 0; i < 30; i++) {
  data.push({
    key: i,
    date: '20/12/2021',
    acb_jp: `${new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 2,
      style: 'currency',
      currency: 'VND',
      currencyDisplay: 'symbol'
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
    }).format(Math.random() * 999999999 * (Math.round(Math.random()) ? 1 : 1))}`
  })
}

export default defineComponent({
  name: 'FinancingPage',
  components: { Pagination, Search, DownloadIcon },

  setup() {
    return {
      data,
      columns
    }
  },
  methods: {
    downloadCSV() {
      console.log('Download successful!')
    },

    showNumberCell(number) {
      console.log(number)
    }
  }
})
</script>
<style scoped lang="scss"></style>

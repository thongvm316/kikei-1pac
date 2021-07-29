<template>
  <table>
    <thead>
      <tr>
        <th></th>
        <th>顧客名</th>
        <th class="u-text-right">売上</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(item, index) in rankingData"
        :key="item.rankingData"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ item.companyName }}</td>
        <td class="u-text-right">{{ $filters.number_with_commas(item.revenue) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'RankingTable',

  props: {
    rankingData: Array
  },

  setup() {

  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/variables';

table {
  font-size: 12px;
  line-height: 18px;
  color: $color-grey-15;
  border: 1px solid $color-grey-75;
  width: 431px;
  cursor: pointer;

  thead {
    background-color: $color-grey-92;
    color: $color-primary-9;
    font-weight: 700;

    th:first-child {
      border-right: 1px solid $color-grey-75;
    }
  }

  tbody {
    tr {
      &:hover td {
        // background-color: $color-grey-96;
      }

      td {
        &:first-child {
          border-right: 1px solid $color-grey-75;
          color: $color-primary-9;
          font-weight: 700;
          text-align: center;
          width: 60px;
          background-color: $color-grey-92;
        }
      }
    }
  }

  th, td {
    padding: 16px;
    border-bottom: 1px solid $color-grey-75;
  }
}
</style>

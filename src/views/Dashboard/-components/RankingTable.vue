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
      <tr>
        <td>1</td>
        <td>ニューフォリア</td>
        <td class="u-text-right">1,999,999,999,999,999</td>
      </tr>
      <tr>
        <td>2</td>
        <td>ニューフォリア</td>
        <td class="u-text-right">1,999,999,999,999,999</td>
      </tr>
      <tr>
        <td>3</td>
        <td>ニューフォリア</td>
        <td class="u-text-right">1,999,999,999,999,999</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'RankingTable',

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

    tr {
      border-bottom: 1px solid $color-grey-75;
    }

    th {
      padding: 16px;

      &:first-child {
        border-right: 1px solid $color-grey-75;
      }
    }
  }

  tbody {
    tr {
      border-top: 1px solid $color-grey-75;

      &:hover td {
        background-color: $color-grey-96;
      }

      td {
        padding: 16px;

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
}
</style>

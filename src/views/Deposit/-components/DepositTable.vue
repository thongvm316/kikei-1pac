<template>
  <div class="k-table-responsive">
    <table class="k-table">
      <thead>
        <tr>
          <th>
            <div class="u-d-flex u-align-center">
              <span class="u-mr-8">更新日</span>
              <k-sort-caret
                @sort-asc="sortAsc"
                @sort-desc="sortDesc"/>
            </div>
          </th>
          <th class="mw-262">
            <div class="u-d-flex u-align-center">
              <span class="u-mr-8">クライアント / プロジェクト名</span>
              <k-sort-caret />
            </div>
          </th>
          <th>
            <div class="u-d-flex u-align-center">
              <span class="u-mr-8">受注確度</span>
              <k-sort-caret />
            </div>
          </th>
          <th>
            <div class="u-d-flex u-align-center">
              <span class="u-mr-8">リリース日></span>
              <k-sort-caret />
            </div>
          </th>
          <th>
            <div class="u-d-flex u-align-center">
              <span class="u-mr-8">受注金額</span>
              <k-sort-caret />
            </div>
          </th>
          <th>
            <div class="u-d-flex u-align-center">
              <span class="u-mr-8">計上月</span>
              <k-sort-caret />
            </div>
          </th>
          <th>
            <div class="u-d-flex u-align-center">
              <span class="u-mr-8">グループ</span>
              <k-sort-caret />
            </div>
          </th>
          <th>
            <div class="u-d-flex u-align-center">
              <span class="u-mr-8">営業担当</span>
              <k-sort-caret />
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>20/12/2021</td>
          <td>
            <div class="u-d-flex u-justify-space-between u-align-center">
              <ul>
                <li class="u-text-grey-55">GXX-YYYY-ZZZ</li>
                <li class="u-text-grey-55">ニューフォリア</li>
                <li class="u-text-weight-800">プロジェクト名クト名クト名</li>
              </ul>

              <ul class="u-d-flex">
                <li class="u-text-grey-55">調査中</li>
                <li class="u-text-grey-55">ラボ</li>
              </ul>
            </div>
          </td>
          <td class="u-text-center u-text-additional-blue-6 u-text-weight-800">S</td>
          <td class="u-text-center">20/12/2021</td>
          <td class="u-text-right">333.333.222</td>
          <td>2021/04/22</td>
          <td>gumiVietnam</td>
          <td>杉野</td>
        </tr>
        <tr>
          <td>20/12/2021</td>
          <td>
            <div class="u-d-flex u-justify-space-between u-align-center">
              <ul>
                <li class="u-text-grey-55">GXX-YYYY-ZZZ</li>
                <li class="u-text-grey-55">ニューフォリア</li>
                <li class="u-text-weight-800">プロジェクト名</li>
              </ul>

              <ul class="u-d-flex">
                <li class="u-text-grey-55">調査中</li>
                <li class="u-text-grey-55">ラボ</li>
              </ul>
            </div>
          </td>
          <td class="u-text-center u-text-additional-blue-6 u-text-weight-800">S</td>
          <td class="u-text-center">20/12/2021</td>
          <td class="u-text-right">333.222</td>
          <td>2021/04/22</td>
          <td>gumiVietnam</td>
          <td>杉野</td>
        </tr>
        <tr>
          <td>20/12/2021</td>
          <td>
            <div class="u-d-flex u-justify-space-between u-align-center">
              <ul>
                <li class="u-text-grey-55">GXX-YYYY-ZZZ</li>
                <li class="u-text-grey-55">ニューフォリア</li>
                <li class="u-text-weight-800">プロジェクト名</li>
              </ul>

              <ul class="u-d-flex">
                <li class="u-text-grey-55">調査中</li>
                <li class="u-text-grey-55">ラボ</li>
              </ul>
            </div>
          </td>
          <td class="u-text-center u-text-additional-blue-6 u-text-weight-800">S</td>
          <td class="u-text-center">20/12/2021</td>
          <td class="u-text-right">333.222</td>
          <td>2021/04/22</td>
          <td>gumiVietnam</td>
          <td>
            <k-button variant="primary" size="md"> Go to Edit page </k-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
const KSortCaret = defineAsyncComponent(() => import('@/components/KSortCaret'))
const KButton = defineAsyncComponent(() => import('@/components/KButton'))

export default defineComponent ({
  name: 'DepositTable',

  components: {
    KSortCaret,
    KButton
  },

  methods: {
    sortAsc() {
      console.log('Asc')
    },

    sortDesc() {
      console.log('Desc')
    }
  }
})
</script>

<style>

</style>

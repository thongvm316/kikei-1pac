<template>
  Deposit Page
  <!-- <div class="u-d-flex u-justify-end u-mt-24 u-mb-16">
    <div class="k-button-group">
      <k-button variant="outline-primary" size="sm" icon>
        <line-down-icon />CSVファイルダウンロード
      </k-button>

      <k-button variant="primary" size="sm" icon>
        <line-add-icon />新規入出金追加
      </k-button>
    </div>
  </div>

  <div class="u-d-flex u-justify-space-between u-mb-24">
    <k-checkbox
      v-model:value="checkboxModel"
      :options="checkboxOptions"
      inline
      name="label-1" />

    <k-multiselect
      v-model="selectModel"
      searchable
      mode="multiple"
      :options="selectOptions"
      label="name"
      trackBy="name"
      placeholder="Chọn ngân hàng...">
      <template #caret>
        <arrow-down-icon class="k-select-caret-icon"/>
      </template>
      <template #option="{ option }">
        <div class="k-select-option--checkbox">{{ option.name }}</div>
      </template>
    </k-multiselect>

    <k-pagination
      v-model:value="page"
      :total-item="71"
      :per-page="10"
      :click-handler="nextPage" />
  </div>

  <div class="-mx-32">
    <k-tabs
      :tabs="tabs"
      v-model:tab-active="tabActive" />

    <div v-if="tabActive === 'gumivietnam'" class="k-table-responsive">
      <table class="k-table">
        <thead>
          <tr>
            <th>
              <div class="u-d-flex u-align-center">
                <span class="u-mr-8">入出金日</span>
                <k-sort-caret
                  @sort-asc="sortAsc"
                  @sort-desc="sortDesc"/>
              </div>
            </th>
            <th class="mw-262">
              <div class="u-d-flex u-align-center">
                <span class="u-mr-8">計上月</span>
                <k-sort-caret />
              </div>
            </th>
            <th>
              <div class="u-d-flex u-align-center">
                <span class="u-mr-8">大分類</span>
                <k-sort-caret />
              </div>
            </th>
            <th>
              <div class="u-d-flex u-align-center">
                <span class="u-mr-8">中分類></span>
                <k-sort-caret />
              </div>
            </th>
            <th>
              <div class="u-d-flex u-align-center">
                <span class="u-mr-8">項目名</span>
                <k-sort-caret />
              </div>
            </th>
            <th>
              <div class="u-d-flex u-align-center">
                <span class="u-mr-8">区分</span>
                <k-sort-caret />
              </div>
            </th>
            <th>
              <div class="u-d-flex u-align-center">
                <span class="u-mr-8">入出金額 (VND)</span>
                <k-sort-caret />
              </div>
            </th>
            <th>
              <div class="u-d-flex u-align-center">
                <span class="u-mr-8">残高 (VND)</span>
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

    <table v-if="tabActive === 'vand'">

    </table>

    <table v-if="tabActive === 'グループ名'">

    </table>
  </div> -->
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
// import Multiselect from '@vueform/multiselect'

// const KPagination = defineAsyncComponent(() => import('@/components/KPagination'))
// const KButton = defineAsyncComponent(() => import('@/components/KButton'))
// const LineDownIcon = defineAsyncComponent(() => import('@/assets/icons/ico_line-down.svg'))
// const LineAddIcon = defineAsyncComponent(() => import('@/assets/icons/ico_line-add.svg'))
// const KCheckbox = defineAsyncComponent(() => import('@/components/KCheckbox'))
// const KTabs = defineAsyncComponent(() => import('@/components/KTabs'))
// const KSortCaret = defineAsyncComponent(() => import('@/components/KSortCaret'))
// import ArrowDownIcon from '@/assets/icons/ico_arrow_down.svg'
// import DepositTable from './-components/DepositTable'

export default defineComponent({
  name: 'DepositPage',

  // data() {
  //   return {
  //     page: 1,
  //     tabActive: 'gumivietnam',
  //     checkboxModel: ['all'],
  //     checkboxOptions: [
  //       {
  //         label: 'チェックした項目全てを確定する',
  //         value: 'all',
  //       }
  //     ],
  //     selectModel: null,
  //     selectOptions: [
  //       { value: 'batman', name: 'Batman' },
  //       { value: 'a', name: 'Amen' },
  //       { value: 'b', name: 'Alibaba' },
  //       { value: 'c', name: 'Hoho' },
  //       { value: 'd', name: 'Hihihihih' },
  //       { value: 'e', name: 'Emanan' }
  //     ],
  //     tabs: [
  //       {
  //         label: 'GumiVietNam',
  //         value: 'gumivietnam',
  //         isActive: true
  //       },

  //       {
  //         label: 'VAND',
  //         value: 'vand',
  //         isActive: false
  //       },

  //       {
  //         label: 'グループ名',
  //         value: 'グループ名',
  //         isActive: false
  //       }
  //     ]
  //   }
  // },

  // components: {
  //   KPagination,
  //   KButton,
  //   LineDownIcon,
  //   LineAddIcon,
  //   KCheckbox,
  //   KMultiselect: Multiselect,
  //   ArrowDownIcon,
  //   KTabs,
  //   DepositTable,
  //   KSortCaret
  // },

  // methods: {
  //   nextPage() {
  //     console.log(this.page)
  //   },

  //   sortAsc() {
  //     console.log('Asc')
  //   },

  //   sortDesc() {
  //     console.log('Desc')
  //   }
  // }
})
</script>

<style lang="scss" scoped>
.-mx-32 {
  margin-left: -32px;
  margin-right: -32px;
}
</style>

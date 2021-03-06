<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('deposit.search_deposit.title_search')"
    class="search-deposit"
    width="800px"
    @cancel="handleModalCancel"
  >
    <template #footer>
      <a-config-provider :locale="locales[locale]">
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('deposit.search_deposit.date') }}</label>

              <div class="form-select">
                <a-range-picker
                  v-model:value="state.dateDepositValue"
                  :style="{ width: '256px' }"
                  format="YYYY-MM-DD"
                  :placeholder="['YYYY/MM/DD', 'YYYY/MM/DD']"
                >
                  <template #suffixIcon>
                    <calendar-outlined />
                  </template>
                </a-range-picker>
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('deposit.search_deposit.statistics_month') }}</label>

              <div class="form-select">
                <a-range-picker
                  :value="state.statisticsDateDepositValue"
                  :style="{ width: '256px' }"
                  :mode="['month', 'month']"
                  format="YYYY-MM"
                  :placeholder="['YYYY/MM', 'YYYY/MM']"
                  @panelChange="handleChangeStatisticsDateValue"
                >
                  <template #suffixIcon>
                    <calendar-outlined />
                  </template>
                </a-range-picker>
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('deposit.search_deposit.type') }}</label>

              <div class="form-checkbox">
                <a-checkbox-group
                  v-model:value="state.type"
                  :options="typeDepositList"
                  @change="handleCheckedTypeDepositList($event)"
                />
              </div>
            </div>
          </div>

          <div v-if="categoryList.length > 0" class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('deposit.search_deposit.category') }}</label>

              <div class="form-checkbox">
                <a-checkbox-group
                  v-model:value="state.categoryId"
                  :options="categoryList"
                  @change="handleCheckedCategoryList($event)"
                />
              </div>
            </div>
          </div>

          <div v-if="subCategoryList.length > 0" class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('deposit.search_deposit.sub_category') }}</label>

              <div class="form-checkbox">
                <a-checkbox-group v-model:value="state.subcategoryId" :options="subCategoryList" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('deposit.search_deposit.confirm_label') }}</label>

              <div class="form-checkbox">
                <a-checkbox-group v-model:value="state.confirmed" :options="confirmedList" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('deposit.search_deposit.purpose') }}</label>

              <div class="form-checkbox">
                <a-input
                  v-model:value="state.purpose"
                  :placeholder="$t('deposit.search_deposit.purpose_place_holder')"
                />
              </div>
            </div>
          </div>

          <a-button key="back" type="default" @click="handleClearDepositFormSearch">
            {{ $t('deposit.search_deposit.clear_search') }}
          </a-button>
          <a-button key="submit" type="primary" html-type="submit">
            <template #icon>
              <span class="btn-icon">
                <search-icon />
              </span>
            </template>
            {{ $t('deposit.search_deposit.submit_search') }}
          </a-button>
        </form>
      </a-config-provider>
    </template>
  </a-modal>
</template>

<script>
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import { isEqual, pick, debounce } from 'lodash-es'

import localeJa from 'ant-design-vue/es/locale/ja_JP'
import localeEn from 'ant-design-vue/es/locale/en_US'

import SearchIcon from '@/assets/icons/ico_search.svg'
import { CalendarOutlined } from '@ant-design/icons-vue'

import { TYPE_NAME_DEPOSIT_FOR_FILTER, TYPE_NAME_DEPOSIT } from '@/enums/deposit.enum'

import { getCategory, getSubCategory } from '../composables/useDeposit'
import { deepCopy } from '@/helpers/json-parser'
import { fromStringToDateTimeFormatPicker } from '@/helpers/date-time-format'

export default defineComponent({
  name: 'SearchDepositModal',

  components: { SearchIcon, CalendarOutlined },

  emits: ['updateParamRequestDeposit', 'update:currentPage'],

  setup(_, { emit }) {
    const store = useStore()
    const route = useRoute()
    const { t, locale } = useI18n()

    const dataFilterStore = computed(() => store.state?.deposit?.filters || {})

    const typeDepositList = Object.keys(TYPE_NAME_DEPOSIT).map((item) => ({
      value: parseInt(item),
      label: t(`deposit.deposit_list.${TYPE_NAME_DEPOSIT[item]}`)
    }))

    const locales = ref({ en: localeEn, ja: localeJa })
    const categoryList = ref([])
    const subCategoryList = ref([])
    const confirmedList = ref([
      { value: false, label: t('deposit.search_deposit.confirm_no') },
      { value: true, label: t('deposit.search_deposit.confirm_yes') }
    ])

    const isNeedSubmit = ref(false)

    const initState = {
      dateDepositValue: [null, null],
      statisticsDateDepositValue: [null, null],
      type: [],
      categoryId: [],
      subcategoryId: [],
      confirmed: [],
      purpose: '',
      subcategoryCompanyId: null,
      subcategoryGroupId: null
    }

    const state = ref(deepCopy(initState))

    const visible = computed({
      get: () => store.state.search.currentRoute === route.name,
      set: (val) => {
        store.commit('search/STORE_SEARCH_CURRENT_ROUTE', val)
      }
    })

    const handleChangeStatisticsDateValue = (val) => {
      state.value.statisticsDateDepositValue = val
    }

    const handleClearDepositFormSearch = () => {
      const projectId = store.state.deposit?.filters?.data?.projectId

      isNeedSubmit.value = !(isEqual(state.value, initState) && !projectId)
      state.value = deepCopy(initState)

      // reset lists
      categoryList.value = []
      subCategoryList.value = []
    }

    const onSubmit = () => {
      const searchDataDeposit = {
        fromDate: state.value.dateDepositValue[0] ? moment(state.value.dateDepositValue[0]).format('YYYY-MM-DD') : null,
        toDate: state.value.dateDepositValue[1] ? moment(state.value.dateDepositValue[1]).format('YYYY-MM-DD') : null,
        statisticsFrom: state.value.statisticsDateDepositValue[0]
          ? moment(state.value.statisticsDateDepositValue[0]).format('YYYY-MM')
          : null,
        statisticsTo: state.value.statisticsDateDepositValue[1]
          ? moment(state.value.statisticsDateDepositValue[1]).format('YYYY-MM')
          : null,
        type: state.value.type,
        confirmed: state.value.confirmed,
        categoryId: state.value.categoryId,
        subcategoryId: state.value.subcategoryId,
        purpose: state.value.purpose,
        projectId: null,
        subcategoryCompanyId: state.value.subcategoryCompanyId,
        subcategoryGroupId: state.value.subcategoryCompanyId
      }

      if (isNeedSubmit.value) {
        const { skipQuickSelectMonth } = store.state.deposit?.filters?.data || {}
        skipQuickSelectMonth && (searchDataDeposit.skipQuickSelectMonth = false)
      }

      emit('updateParamRequestDeposit', { data: searchDataDeposit, params: { pageNumber: 1 } })

      visible.value = false
      isNeedSubmit.value = false
      store.commit('search/STORE_SEARCH_SHOW_BADGE', !isEqual(state.value, initState))
    }

    const handleCheckedTypeDepositList = debounce(async (event) => {
      const divisionTypes = event.map((divisionType) => TYPE_NAME_DEPOSIT_FOR_FILTER[divisionType])
      event = { division_type: divisionTypes.toString() }

      if (event.division_type) {
        const dataCategory = await getCategory(event)
        state.value.categoryId = []
        state.value.subcategoryId = []
        subCategoryList.value = []
        categoryList.value = toCategoryOptions(dataCategory.result?.data || [])
      } else {
        categoryList.value = []
      }
    }, 500)

    const toCategoryOptions = (options) => {
      if (!options) return

      return options.map((item) => {
        return { value: item.id, label: item.name }
      })
    }

    const handleCheckedCategoryList = debounce(async (event) => {
      event = { category_id: event.toString() }
      if (event.category_id) {
        state.value.subcategoryId = []
        subCategoryList.value = []
        const dataSubCategory = await getSubCategory(event)
        subCategoryList.value = toSubCategoryOptions(dataSubCategory.result?.data || [])
      } else {
        subCategoryList.value = []
      }
    }, 500)

    const toSubCategoryOptions = (options) => {
      if (!options) return

      return options.map((item) => {
        return { value: item.id, label: item.name, categoryId: item.categoryId }
      })
    }

    const handleModalCancel = () => {
      isNeedSubmit.value && onSubmit()
    }

    const applyFiltersStoreToState = async () => {
      // get state from store
      const dataFilterStore = store.state.deposit?.filters?.data || {}
      const filterData = pick(dataFilterStore, ['type', 'confirmed', 'categoryId', 'subcategoryId', 'purpose'])
      const stateStore = {
        ...filterData,
        dateDepositValue: [
          fromStringToDateTimeFormatPicker(dataFilterStore.fromDate, 'YYYY/MM/DD'),
          fromStringToDateTimeFormatPicker(dataFilterStore.toDate, 'YYYY/MM/DD')
        ],
        statisticsDateDepositValue: [
          fromStringToDateTimeFormatPicker(dataFilterStore.statisticsFrom, 'YYYY/MM/DD'),
          fromStringToDateTimeFormatPicker(dataFilterStore.statisticsTo, 'YYYY/MM/DD')
        ]
      }
      state.value = { ...state.value, ...stateStore }

      // get category list
      if (dataFilterStore.type && dataFilterStore.type.length > 0) {
        const divisionTypes = dataFilterStore.type.map((divisionType) => TYPE_NAME_DEPOSIT_FOR_FILTER[divisionType])
        const dataCategory = await getCategory({ divisionType: divisionTypes.toString() })
        categoryList.value = toCategoryOptions(dataCategory.result?.data || [])
      }

      // get subCategory list
      if (dataFilterStore.categoryId && dataFilterStore.categoryId.length > 0) {
        const dataSubCategory = await getSubCategory({ categoryId: dataFilterStore.categoryId.toString() })
        subCategoryList.value = toSubCategoryOptions(dataSubCategory.result?.data || [])
      }

      // set badge search
      const projectId = store.state.deposit?.filters?.data?.projectId
      store.commit('search/STORE_SEARCH_SHOW_BADGE', !(isEqual(state.value, initState) && !projectId))
    }

    onBeforeMount(() => {
      applyFiltersStoreToState()
    })

    watch(dataFilterStore, () => {
      applyFiltersStoreToState()
    })

    return {
      locales,
      locale,
      visible,
      typeDepositList,
      categoryList,
      subCategoryList,
      confirmedList,
      state,
      handleCheckedTypeDepositList,
      handleCheckedCategoryList,
      handleClearDepositFormSearch,
      handleModalCancel,
      onSubmit,
      handleChangeStatisticsDateValue
    }
  }
})
</script>

<style lang="scss">
.search-deposit {
  .ant-modal-footer {
    padding: 16px 127px;
    max-height: 650px;
    overflow-y: scroll;

    form {
      width: 100%;
    }

    .form-content {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 24px;
    }

    .form-label {
      width: 110px;
      text-align: left;
    }

    .form-select {
      text-align: left;
    }

    .form-checkbox {
      width: calc(100% - 120px);
      text-align: left;

      .ant-checkbox-group {
        display: flex;
        flex-wrap: wrap;
      }

      .ant-checkbox-wrapper {
        display: block;
        margin-bottom: 12px;
      }
    }
  }
}
</style>

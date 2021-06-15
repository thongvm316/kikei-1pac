<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('deposit.search_deposit.title_search')"
    class="search-deposit"
    width="800px"
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
                  v-model:value="state.statisticsDateDepositValue"
                  :style="{ width: '256px' }"
                  format="YYYY-MM"
                  :placeholder="['YYYY/MM', 'YYYY/MM']"
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
                <a-checkbox-group v-model:value="state.checkedTypeDepositList" :options="typeDepositList" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('deposit.search_deposit.statistics_month') }}</label>

              <div class="form-checkbox">
                <a-checkbox-group v-model:value="state.checkedCategotyList" :options="categoryList" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('deposit.search_deposit.sub_category') }}</label>

              <div class="form-checkbox">
                <a-checkbox-group v-model:value="state.checkedSubCategotyList" :options="subCategoryList" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('deposit.search_deposit.confirm_label') }}</label>

              <div class="form-checkbox">
                <a-checkbox-group v-model:value="state.checkedSubConfirmedList" :options="confirmedList" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('deposit.search_deposit.purpose') }}</label>

              <div class="form-checkbox">
                <a-input
                  v-model:value="state.valuePurpose"
                  :placeholder="$t('deposit.search_deposit.purpose_place_holder')"
                />
              </div>
            </div>
          </div>

          <a-button key="back" @click="handleClearDepositFormSearch">
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
import { defineComponent, ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

import localeJa from 'ant-design-vue/es/locale/ja_JP'
import localeEn from 'ant-design-vue/es/locale/en_US'

import SearchIcon from '@/assets/icons/ico_search.svg'
import { CalendarOutlined } from '@ant-design/icons-vue'

import { TYPE_NAME_DEPOSIT } from '@/enums/deposit.enum'

import { getCategory, getSubCategory } from '../composables/useDeposit'
import { deepCopy } from '@/helpers/json-parser'

export default defineComponent({
  name: 'SearchDepositModal',

  components: { SearchIcon, CalendarOutlined },

  emits: ['updateParamRequestDeposit'],

  setup(_, { emit }) {
    const store = useStore()
    const route = useRoute()
    const { t, locale } = useI18n()

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

    const initState = {
      dateDepositValue: [],
      statisticsDateDepositValue: [],
      checkedTypeDepositList: [],
      checkedCategotyList: [],
      checkedSubCategotyList: [],
      checkedSubConfirmedList: [],
      valuePurpose: ''
    }

    const state = ref(deepCopy(initState))

    const visible = computed({
      get: () => store.getters.currentRoute === route.name,
      set: (val) => {
        store.commit('setCurrentRoute', val)
      }
    })

    const handleClearDepositFormSearch = () => {
      state.value = initState
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
        type: state.value.checkedTypeDepositList,
        confirmed: state.value.checkedSubConfirmedList,
        categoryId: state.value.checkedCategotyList,
        subcategoryId: state.value.checkedSubCategotyList,
        purpose: state.value.valuePurpose
      }

      emit('updateParamRequestDeposit', searchDataDeposit)
      visible.value = false
    }

    const toCategoryOptions = (options) => {
      if (!options) return

      return options.map((item) => {
        return { value: item.id, label: item.name }
      })
    }

    const toSubCategoryOptions = (options) => {
      if (!options) return

      return options.map((item) => {
        return { value: item.id, label: item.name, categoryId: item.categoryId }
      })
    }

    onBeforeMount(async () => {
      const dataCategory = await getCategory()
      categoryList.value = toCategoryOptions(dataCategory.result?.data || [])

      const dataSubCategory = await getSubCategory()
      subCategoryList.value = toSubCategoryOptions(dataSubCategory.result?.data || [])
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

      handleClearDepositFormSearch,
      onSubmit
    }
  }
})
</script>

<style lang="scss">
.search-deposit {
  .ant-modal-footer {
    padding: 16px 140px;

    form {
      width: 100%;
    }

    .form-content {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 24px;
    }

    .form-label {
      width: 120px;
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

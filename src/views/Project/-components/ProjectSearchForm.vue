<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('project.title_search')"
    class="search-deposit"
    width="800px"
    @cancel="handleModalCancel"
  >
    <template #footer>
      <a-config-provider :locale="locales[locale]">
        <form @submit.prevent="onSubmit">
          <!-- Group -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('project.group_name') }}</label>

              <div class="form-select">
                <a-select
                  v-model:value="state.groupId"
                  show-arrow
                  :max-tag-count="0"
                  option-label-prop="label"
                  dropdown-class-name="multiple-select-custom"
                  mode="multiple"
                  :placeholder="$t('project.group_placeholder')"
                  style="width: 152px"
                >
                  <a-select-option v-for="group in dataGroups" :key="group.id" :value="group.id">
                    {{ group.name }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
          </div>
          <!--./Group -->

          <!-- Accounts -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('project.account_name') }}</label>

              <div class="form-select">
                <a-select
                  v-model:value="state.accountId"
                  show-arrow
                  :max-tag-count="0"
                  option-label-prop="label"
                  dropdown-class-name="multiple-select-custom"
                  mode="multiple"
                  :placeholder="$t('project.accounts_placeholder')"
                  style="width: 152px"
                >
                  <a-select-option v-for="account in dataAccounts" :key="account.id" :value="account.id">
                    {{ account.fullname }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
          </div>
          <!-- ./Accounts -->

          <!--Date From-->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('project.updated_date') }}</label>

              <div class="form-select">
                <a-range-picker
                  v-model:value="state.updatedDateValue"
                  style="width: 300px"
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
          <!--./Date From -->

          <!--Date From-->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('project.statistics_from_month') }}</label>

              <div class="form-select">
                <a-range-picker
                  :value="state.statisticsDateValue"
                  style="width: 300px"
                  format="YYYY-MM"
                  :mode="['month', 'month']"
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
          <!--./Date From -->

          <!-- Type -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('project.type') }}</label>
              <div class="form-checkbox">
                <a-checkbox-group v-model:value="state.type" name="projectType" :options="dataTypes" />
              </div>
            </div>
          </div>
          <!-- ./Type -->

          <!-- Status -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('project.status') }}</label>
              <div class="form-checkbox">
                <a-checkbox-group v-model:value="state.statusId" name="projectStatuses" :options="dataStatuses" />
              </div>
            </div>
          </div>
          <!-- ./Status -->

          <!-- Accuracy -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('project.accuracy_name') }}</label>
              <div class="form-checkbox">
                <a-checkbox-group v-model:value="state.accuracyId" name="projectAccuracies" :options="dataAccuracies" />
              </div>
            </div>
          </div>
          <!-- ./Accuracy -->

          <!-- Project Name -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('project.project_name') }}</label>
              <div class="form-checkbox">
                <a-input
                  v-model:value="state.name"
                  style="width: 340px"
                  name="projectName"
                  :placeholder="$t('project.purpose_placeholder')"
                />
              </div>
            </div>
          </div>
          <!-- ./Project Name -->

          <a-button key="back" type="default" @click="clearSearchForm">{{ $t('project.handle_cancel') }}</a-button>
          <a-button key="submit" type="primary" html-type="submit" :loading="loading">
            <template #icon>
              <span class="btn-icon">
                <search-icon />
              </span>
            </template>
            {{ $t('project.handle_ok') }}
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
import { isEqual, pick } from 'lodash-es'

import { PROJECT_TYPES } from '@/enums/project.enum'
import { STATUS_CODE } from '@/enums/project.enum'

import localeJa from 'ant-design-vue/es/locale/ja_JP'
import localeEn from 'ant-design-vue/es/locale/en_US'

import { useAccountList } from '../composables/useAccountList'
import { getProjectAccuracies, getProjectStatuses } from '../composables/useProject'
import { useGroupList } from '../composables/useGroupList'
import { deepCopy } from '@/helpers/json-parser'
import { fromStringToDateTimeFormatPicker } from '@/helpers/date-time-format'

import SearchIcon from '@/assets/icons/ico_search.svg'
import { CalendarOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'ProjectSearchForm',

  components: { SearchIcon, CalendarOutlined },

  setup(_, { emit }) {
    const store = useStore()
    const route = useRoute()
    const { t, locale } = useI18n()

    const locales = ref({ en: localeEn, ja: localeJa })
    const loading = ref(false)

    const initState = {
      groupId: [],
      accountId: [],
      updatedDateValue: [null, null],
      type: [],
      statusId: [],
      statisticsDateValue: [null, null],
      accuracyId: [],
      name: ''
    }
    const state = ref(deepCopy(initState))

    const dataAccounts = ref([])
    const dataGroups = ref([])
    const dataTypes = ref([])
    const dataStatuses = ref([])
    const dataAccuracies = ref([])
    const isNeedSubmit = ref(false)

    const handleChangeStatisticsDateValue = (val) => {
      state.value.statisticsDateValue = val
    }

    const toStatusOptions = (data) => {
      if (data.length <= 0) return []
      return data.map((item) => ({ label: item.name, value: item.id }))
    }

    const toAccuracyOptions = (data) => {
      if (data.length <= 0) return []
      return data.map((item) => ({ label: `${item.code} (${item.name})`, value: item.id }))
    }

    const visible = computed({
      get: () => store.state.search.currentRoute === route.name,
      set: (val) => {
        store.commit('search/STORE_SEARCH_CURRENT_ROUTE', val)
      }
    })

    const clearSearchForm = () => {
      isNeedSubmit.value = !isEqual(state.value, initState)
      state.value = deepCopy(initState)
    }

    const onSubmit = () => {
      const isEqualState = isEqual(state.value, initState)

      // parse to search data
      const searchData = {
        groupId: state.value.groupId,
        accountId: state.value.accountId,
        type: state.value.type,
        statusId: state.value.statusId,
        accuracyId: state.value.accuracyId,
        updatedFrom: state.value.updatedDateValue[0]
          ? moment(state.value.updatedDateValue[0]).startOf('day').format('YYYY-MM-DD LTS')
          : null,
        updatedTo: state.value.updatedDateValue[1]
          ? moment(state.value.updatedDateValue[1]).endOf('day').format('YYYY-MM-DD LTS')
          : null,
        statisticsFrom: state.value.statisticsDateValue[0]
          ? moment(state.value.statisticsDateValue[0]).format('YYYY-MM')
          : null,
        statisticsTo: state.value.statisticsDateValue[1]
          ? moment(state.value.statisticsDateValue[1]).format('YYYY-MM')
          : null,
        name: state.value.name,
        statusCode: [] // clear on second search
      }
      emit('on-search', { data: searchData, params: { pageNumber: 1 } })

      // close modal
      visible.value = false
      isNeedSubmit.value = false
      store.commit('search/STORE_SEARCH_SHOW_BADGE', !isEqualState)
    }

    const handleModalCancel = () => {
      isNeedSubmit.value && onSubmit()
    }

    onBeforeMount(async () => {
      // accounts
      dataAccounts.value = await useAccountList()
      // groups
      const paramsGroup = { allGroup: true }
      const { data: groups } = await useGroupList(paramsGroup)
      dataGroups.value = groups
      // statuses
      const { data: statuses } = await getProjectStatuses()
      dataStatuses.value = toStatusOptions(statuses)
      // accuracies
      const { data: accuracies } = await getProjectAccuracies()
      dataAccuracies.value = toAccuracyOptions(accuracies)
      dataTypes.value = PROJECT_TYPES.map((type) => ({
        ...type,
        label: t(`project.${type.label}`)
      }))

      // get state from store
      const dataFilterStore = store.state.project?.filters?.data || {}
      const filterData = pick(dataFilterStore, ['groupId', 'accountId', 'type', 'statusId', 'accuracyId', 'name'])
      const stateStore = {
        ...filterData,
        updatedDateValue: [
          fromStringToDateTimeFormatPicker(dataFilterStore.updatedFrom, 'YYYY/MM/DD'),
          fromStringToDateTimeFormatPicker(dataFilterStore.updatedTo, 'YYYY/MM/DD')
        ],
        statisticsDateValue: [
          fromStringToDateTimeFormatPicker(dataFilterStore.statisticsFrom, 'YYYY/MM/DD'),
          fromStringToDateTimeFormatPicker(dataFilterStore.statisticsTo, 'YYYY/MM/DD')
        ]
      }
      state.value = { ...state.value, ...stateStore }

      // check status code
      const isEqualState = isEqual(state.value, initState)
      state.value.statusCode = isEqualState ? STATUS_CODE : [] // default in the first load page

      store.commit('search/STORE_SEARCH_SHOW_BADGE', !isEqualState)
    })

    return {
      t,
      locales,
      locale,
      loading,
      visible,
      dataGroups,
      dataTypes,
      dataStatuses,
      dataAccounts,
      dataAccuracies,
      onSubmit,
      clearSearchForm,
      state,
      handleModalCancel,
      handleChangeStatisticsDateValue
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

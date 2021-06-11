<template>
  <a-modal v-model:visible="visible" :title="$t('project.title_search')" class="search-deposit" width="1000px">
    <template #footer>
      <a-config-provider :locale="locales[locale]">
        <form @submit.prevent="onSubmit">
          <!-- Group -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('project.group_name') }}</label>

              <div class="form-select">
                <a-select
                  v-model:value="groupValue"
                  show-arrow
                  :max-tag-count="0"
                  option-label-prop="label"
                  dropdown-class-name="multiple-select-custom"
                  mode="multiple"
                  :placeholder="$t('project.group_name')"
                  style="width: 152px"
                >
                  <template #menuItemSelectedIcon>
                    <a-checkbox :checked="true" />
                  </template>
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
                  v-model:value="accountValue"
                  show-arrow
                  :max-tag-count="0"
                  option-label-prop="label"
                  dropdown-class-name="multiple-select-custom"
                  mode="multiple"
                  :placeholder="$t('project.account_name')"
                  style="width: 152px"
                >
                  <template #menuItemSelectedIcon>
                    <a-checkbox :checked="true" />
                  </template>
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
                  v-model:value="updatedDateValue"
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
                  v-model:value="statisticsDateValue"
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

          <!-- Type -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('project.type') }}</label>
              <div class="form-checkbox">
                <a-checkbox-group v-model:value="typeValue" name="projectType" :options="dataTypes" />
              </div>
            </div>
          </div>
          <!-- ./Type -->

          <!-- Status -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('project.status') }}</label>
              <div class="form-checkbox">
                <a-checkbox-group v-model:value="statusValue" name="projectStatuses" :options="dataStatuses" />
              </div>
            </div>
          </div>
          <!-- ./Status -->

          <!-- Accuracy -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('project.accuracy_name') }}</label>
              <div class="form-checkbox">
                <a-checkbox-group v-model:value="accuracyValue" name="projectAccuracies" :options="dataAccuracies" />
              </div>
            </div>
          </div>
          <!-- ./Accuracy -->

          <!-- Project Name -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('project.project_name') }}</label>
              <div class="form-checkbox">
                <a-input v-model:value="nameValue" style="width: 340px" name="projectName" />
              </div>
            </div>
          </div>
          <!-- ./Project Name -->

          <a-button key="back" @click="clearSearchForm">{{ $t('financing.handle_cancel') }}</a-button>
          <a-button key="submit" type="primary" html-type="submit" :loading="loading">
            <template #icon>
              <span class="btn-icon">
                <search-icon />
              </span>
            </template>
            {{ $t('financing.handle_ok') }}
          </a-button>
        </form>
      </a-config-provider>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, reactive, computed, onBeforeMount, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

import { PROJECT_TYPES } from '@/enums/project.enum'

import localeJa from 'ant-design-vue/es/locale/ja_JP'
import localeEn from 'ant-design-vue/es/locale/en_US'

import { useAccountList } from '../composables/useAccountList'
import { getProjectAccuracies, getProjectStatuses } from '../composables/useProject'

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
    const state = reactive({
      groupValue: [],
      accountValue: [],
      updatedDateValue: [],
      typeValue: [],
      statusValue: [],
      statisticsDateValue: [],
      accuracyValue: [],
      nameValue: ''
    })

    const dataAccounts = ref([])
    const dataGroups = ref([])
    const dataTypes = ref([])
    const dataStatuses = ref([])
    const dataAccuracies = ref([])

    const toStatusOptions = (data) => {
      if (data.length <= 0) return []
      return data.map((item) => ({ label: item.name, value: item.id }))
    }

    const toAccuracyOptions = (data) => {
      if (data.length <= 0) return []
      return data.map((item) => ({ label: `${item.code} (${item.name})`, value: item.id }))
    }

    const visible = computed({
      get: () => store.getters.currentRoute === route.name,
      set: (val) => {
        store.commit('setCurrentRoute', val)
      }
    })

    const clearSearchForm = () => {
      ;(state.groupValue = []),
      (state.accountValue = []),
      (state.updatedDateValue = []),
      (state.typeValue = []),
      (state.statusValue = []),
      (state.statisticsDateValue = []),
      (state.accuracyValue = []),
      (state.nameValue = '')
    }

    const onSubmit = () => {
      // parse to search data
      const searchData = {
        groupId: state.groupValue,
        accountId: state.accountValue,
        type: state.typeValue,
        statusId: state.statusValue,
        accuracyId: state.accuracyValue,
        updatedFrom: state.updatedDateValue[0] ? moment(state.updatedDateValue[0]).format('YYYY-MM-DD') : null,
        updatedTo: state.updatedDateValue[1] ? moment(state.updatedDateValue[1]).format('YYYY-MM-DD') : null,
        statisticsFrom: state.statisticsDateValue[0] ? moment(state.statisticsDateValue[0]).format('YYYY-MM') : null,
        statisticsTo: state.statisticsDateValue[1] ? moment(state.statisticsDateValue[1]).format('YYYY-MM') : null,
        name: state.nameValue
      }
      emit('on-search', searchData)

      // close modal
      visible.value = false
    }

    onBeforeMount(async () => {
      // accounts
      dataAccounts.value = await useAccountList()
      // groups
      const { data: groups } = await getProjectStatuses()
      dataGroups.value = groups
      // statuses
      const { data: statuses } = await getProjectStatuses()
      dataStatuses.value = toStatusOptions(statuses)
      // accuracies
      const { data: accuracies } = await getProjectAccuracies()
      dataAccuracies.value = toAccuracyOptions(accuracies)
      dataTypes.value = PROJECT_TYPES.map(type => ({
        ...type,
        label: t(`project.${type.label}`)
      }))
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
      ...toRefs(state)
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

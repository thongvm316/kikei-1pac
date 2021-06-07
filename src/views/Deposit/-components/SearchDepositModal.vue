<template>
  <a-modal v-model:visible="visible" :title="$t('financing.title_search')" class="search-deposit" width="800px">
    <template #footer>
      <a-config-provider :locale="locales[locale]">
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">入出金日</label>

              <div class="form-select">
                <a-range-picker
                  style="width: 256px"
                  format="YYYY-MM-DD"
                  v-model:value="dateDepositValue"
                  :placeholder="['YYYY/MM/DD', 'YYYY/MM/DD']">
                  <template #suffixIcon>
                    <calendar-outlined />
                  </template>
                </a-range-picker>
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-content">
              <label class="form-label">計上月</label>

              <div class="form-select">
                <a-range-picker
                  style="width: 256px"
                  format="YYYY-MM"
                  v-model:value="statisticsDateDepositValue"
                  :placeholder="['YYYY/MM', 'YYYY/MM']">
                  <template #suffixIcon>
                    <calendar-outlined />
                  </template>
                </a-range-picker>
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-content">
              <label class="form-label">区分</label>

              <div class="form-checkbox">
                <a-checkbox-group v-model:value="checkedTypeDepositList" :options="typeDepositList"  />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-content">
              <label class="form-label">大分類</label>

              <div class="form-checkbox">
                <a-checkbox-group v-model:value="checkedCategotyList" :options="categoryList"  />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-content">
              <label class="form-label">中分類</label>

              <div class="form-checkbox">
                <a-checkbox-group v-model:value="checkedSubCategotyList" :options="subCategoryList"  />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-content">
              <label class="form-label">確定</label>

              <div class="form-checkbox">
                <a-checkbox-group v-model:value="checkedSubConfirmedList" :options="confirmedList"  />
              </div>
            </div>
          </div>

          <a-button key="back" @click="handleCancel">{{ $t('financing.handle_cancel') }}</a-button>
          <a-button key="submit" type="primary" html-type="submit">
            <template #icon>
              <span class="btn-icon">
                <search-icon />
              </span>
            </template>
            Ok
          </a-button>
        </form>
      </a-config-provider>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, computed, reactive, toRefs, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

import localeJa from 'ant-design-vue/es/locale/ja_JP'
import localeEn from 'ant-design-vue/es/locale/en_US'

import SearchIcon from '@/assets/icons/ico_search.svg'
import { CalendarOutlined } from '@ant-design/icons-vue'

import { typeDepositEnums } from '@/enums/deposit.enum'

import { getCategory, getSubCategory } from '../composables/useDepositService'

const typeDepositList = typeDepositEnums.map(item => {
  return { value: item.type, label: item.name }
})

export default defineComponent({
  name: 'SearchDepositModal',

  components: { SearchIcon, CalendarOutlined },

  props: {
    currentActiveIdGroup: Number
  },

  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const { t, locale } = useI18n()

    const locales = ref({ en: localeEn, ja: localeJa })
    const categoryList = ref([])
    const subCategoryList = ref([])
    const confirmedList = ref([
      { value: 1, label: 'Yes' },
      { value: 2, label: 'No' }
    ])

    const state = reactive({
      dateDepositValue: [],
      statisticsDateDepositValue: [],
      checkedTypeDepositList: [typeDepositList[0].value],
      checkedCategotyList: [],
      checkedSubCategotyList: [],
      checkedSubConfirmedList: [confirmedList.value[0].value]
    })

    const visible = computed({
      get: () => store.getters.currentRoute === route.name,
      set: (val) => {
        store.commit('setCurrentRoute', val)
      }
    })

    const handleCancel = () => {
      visible.value = false
    }

    const onSubmit = () => {
      const searchDataDeposit = {
        group_id: props.currentActiveIdGroup,
        fromDate: state.dateDepositValue[0] ? moment(state.dateDepositValue[0]).format('YYYY-MM-DD') : null,
        toDate: state.dateDepositValue[1] ? moment(state.dateDepositValue[1]).format('YYYY-MM-DD') : null,
        statisticsFrom: state.statisticsDateDepositValue[0] ? moment(state.statisticsDateDepositValue[0]).format('YYYY-MM') : null,
        statisticsTo: state.statisticsDateDepositValue[1] ? moment(state.statisticsDateDepositValue[1]).format('YYYY-MM') : null,
        type: state.checkedTypeDepositList,
        confirmed: state.checkedSubConfirmedList,
        categoryId: state.checkedCategotyList,
        subcategoryId: state.checkedSubCategotyList
      }

      emit('on-search', searchDataDeposit)
      visible.value = false
    }

    const toCategoryOptions = (options) => {
      if (!options) return

      return options.map(item => {
        return { value: item.id, label: item.name  }
      })
    }

    const toSubCategoryOptions = (options) => {
      if (!options) return

      return options.map(item => {
        return { value: item.id, label: item.name, categoryId: item.categoryId }
      })
    }

    onBeforeMount(async () => {
      const dataCategory = await getCategory()
      categoryList.value = toCategoryOptions(dataCategory.result?.data || [])
      state.checkedCategotyList = [categoryList.value[0].value]

      const dataSubCategory = await getSubCategory({ categoryId: 8 })
      subCategoryList.value = toSubCategoryOptions(dataSubCategory.result?.data || [])
      state.checkedSubCategotyList = [subCategoryList.value[0].value]
    })

    return {
      locales,
      locale,
      visible,
      typeDepositList,
      categoryList,
      subCategoryList,
      confirmedList,
      ...toRefs(state),

      handleCancel,
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

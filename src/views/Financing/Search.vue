<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('financing.title_search')"
    class="search-financing"
    width="800px"
    @cancel="handleModalCancel"
  >
    <template #footer>
      <form @submit.prevent="onSearch">
        <!-- Group -->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('financing.group') }}</label>

            <div class="form-select">
              <a-select
                v-model:value="filter.group_id"
                :placeholder="$t('financing.please_select')"
                style="width: 152px"
                @change="handleChangeGroups($event)"
              >
                <a-select-option v-for="item in groupList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </div>
        <!--./Group -->
        <!--Stages-->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('financing.stages') }}</label>

            <div class="form-select">
              <a-select
                v-model:value="filter.period_id"
                allow-clear
                :placeholder="$t('financing.please_select')"
                :disabled="isDisabledStages"
                @change="handleChangePeriod($event)"
              >
                <a-select-option v-for="item in periodList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <span style="margin-left: 4px">{{ $t('financing.term') }}</span>
            </div>
          </div>
        </div>
        <!--./Stages -->
        <!--Date From-->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label"></label>

            <div class="form-select">
              <a-range-picker
                v-model:value="filter.date_from_to"
                :style="{ width: '300px' }"
                format="YYYY-MM-DD"
                :placeholder="['YYYY/MM/DD', 'YYYY/MM/DD']"
                :disabled="isDisabledDate"
                @change="onChangeDate"
              >
                <template #suffixIcon>
                  <CalendarOutlined />
                </template>
              </a-range-picker>
            </div>
          </div>
        </div>
        <!--./Date From -->
        <!-- Display -->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('financing.display') }}</label>

            <div class="form-checkbox">
              <a-radio-group v-model:value="filter.show_by">
                <a-radio v-for="item in SHOW_BY" :key="item.id" :value="item.id">
                  {{ $t(`financing.${item.value}`) }}
                </a-radio>
              </a-radio-group>
            </div>
          </div>
        </div>
        <!-- ./Display -->

        <a-button key="back" @click="handleClear">{{ $t('financing.handle_cancel') }}</a-button>
        <a-button key="submit" type="primary" html-type="submit" :loading="loading">
          <template #icon>
            <span class="btn-icon">
              <search-icon />
            </span>
          </template>
          {{ $t('financing.handle_ok') }}
        </a-button>
      </form>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { isEqual, remove } from 'lodash-es'

import { SHOW_BY } from '@/enums/financing.enum'
import SearchIcon from '@/assets/icons/ico_search.svg'
import { CalendarOutlined } from '@ant-design/icons-vue'
import useGetPeriodListService from '@/views/Financing/composables/useGetPeriodListService'

export default defineComponent({
  name: 'Search',

  components: { SearchIcon, CalendarOutlined },

  setup(props, context) {
    const store = useStore()
    const route = useRoute()
    const { t } = useI18n()

    const loading = ref(false)
    const groupList = ref([])
    const isDisabledStages = ref(true)
    const isDisabledDate = ref(true)
    let periodList = ref([])
    const isNeedSubmit = ref(false)

    const initialStateFilter = {
      group_id: null,
      period_id: null,
      date_from_to: [],
      show_by: 0
    }

    const filter = reactive({ ...initialStateFilter })

    onMounted(async () => {
      groupList.value = [...route.meta['lists']]
    })

    const visible = computed({
      get: () => store.state.search.currentRoute === route.name,
      set: (val) => {
        store.commit('search/STORE_SEARCH_CURRENT_ROUTE', val)
      }
    })

    const handleClear = () => {
      isNeedSubmit.value = !isEqual(filter, initialStateFilter)
      Object.assign(filter, initialStateFilter)
    }

    const handleChangeGroups = async (event) => {
      if (event) {
        const { getPeriods } = useGetPeriodListService(event)
        const { result } = await getPeriods()

        periodList.value = result.data
        isDisabledStages.value = false
        isDisabledDate.value = false
      }
    }

    const handleChangePeriod = async (event) => {
      if (event) {
        remove(filter.date_from_to)
      }
      isDisabledDate.value = !(typeof event === 'undefined' || event === 'null')
    }

    const onChangeDate = async (value, dateString) => {
      filter.date_from_to = dateString
    }

    const onSearch = () => {
      const data = {
        group_id: filter.group_id,
        period_id: filter.period_id,
        date_from_to: filter.date_from_to,
        show_by: filter.show_by
      }

      context.emit('filter-changed', data)
      visible.value = false
      isNeedSubmit.value = false
    }

    const handleModalCancel = () => {
      isNeedSubmit.value && onSearch()
    }

    onBeforeMount(async () => {
      store.commit('search/STORE_SEARCH_SHOW_BADGE', true)
    })

    return {
      loading,
      visible,
      t,
      groupList,
      periodList,
      filter,
      SHOW_BY,
      isDisabledStages,
      isDisabledDate,
      handleClear,
      handleChangeGroups,
      handleChangePeriod,
      onChangeDate,
      onSearch,
      handleModalCancel
    }
  }
})
</script>
<style scoped lang="scss"></style>

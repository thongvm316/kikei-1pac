<template>
  <div class="financing__header">
    <div class="financing__header--top u-mx-32">
      <div class="financing__header--wrap">
        <!--Stages-->
        <div class="form-group">
          <label class="form-label">{{ $t('financing.financing_list.stages') }}:</label>

          <div class="form-select">
            <a-select v-model:value="filter.period_id" allow-clear @change="onChangePeriod">
              <a-select-option v-for="item in periodList" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <!--./Stages -->
        <!--Date From-->
        <div class="form-group">
          <label class="form-label"> {{ $t('financing.financing_list.date') }}: </label>

          <div class="form-select">
            <a-range-picker
              v-model:value="filter.date_from_to"
              :format="filter.show_by ? 'YYYY-MM-DD' : 'YYYY-MM'"
              :style="{ width: '260px' }"
              :placeholder="filter.show_by ? ['YYYY/MM/DD', 'YYYY/MM/DD'] : ['YYYY/MM', 'YYYY/MM']"
              @change="onChangeDate"
            >
              <template #suffixIcon>
                <CalendarOutlined />
              </template>
            </a-range-picker>
          </div>
        </div>
        <!--./Date From -->
        <!-- Display -->
        <div class="form-group">
          <label class="form-label">{{ $t('financing.financing_list.display') }}:</label>

          <div class="form-checkbox">
            <a-radio-group v-model:value="filter.show_by" @change="onChangeShowBy">
              <a-radio
                v-for="item in SHOW_BY"
                :key="item.id"
                :value="item.id"
                :disabled="item.id === 1 ? isDisabledDisplay : false"
              >
                {{ $t(`financing.financing_list.${item.value}`) }}
              </a-radio>
            </a-radio-group>
          </div>
        </div>
        <!-- ./Display -->
      </div>
      <!-- Download CSV -->
      <a-tooltip placement="topLeft" title="CSV ファイルダウンロード">
        <a-button type="link" class="btn-download" :loading="isLoadingExportCsv" @click="onExportFinancingCsv">
          <template #icon>
            <span class="btn-icon" style="height: 28px"><icon-csv /></span>
          </template>
        </a-button>
      </a-tooltip>
      <!-- ./Download CSV -->
    </div>

    <div class="financing__header--middle">
      <a-tabs v-model:activeKey="filter.group_id" default-active-key="1" :animated="false" @change="onChangeTabGroup">
        <a-tab-pane v-for="item in groupList" :key="item.id" :tab="item.name"></a-tab-pane>
      </a-tabs>
    </div>

    <div class="financing__header--bottom u-mx-32">
      <!-- Bank Account -->
      <div class="form-group">
        <div class="form-select form-select-bank">
          <a-select v-model:value="filter.bank_account_ids" :disabled="isDisabledBank" @change="onChangeBankAccount">
            <a-select-option v-for="item in bankAccountList" :key="item.id" :value="item.id">
              <span v-if="item.currencyCode">
                {{ item.name + ' (' + item.currencyCode + ')' }}
              </span>
              <span v-else>
                {{ item.name }}
              </span>
            </a-select-option>
          </a-select>
        </div>
        <!-- View mode -->
        <div class="form-checkbox">
          <a-radio-group v-model:value="filter.view_mode" @change="onChangeViewMode(filter.view_mode)">
            <a-radio v-for="item in VIEW_MODE" :key="item.id" :value="item.id">
              {{ $t(`financing.financing_list.${item.value}`) }}
            </a-radio>
          </a-radio-group>
        </div>
        <!-- ./View mode -->
      </div>
      <!-- ./Bank Account -->

      <!-- Currency -->
      <div v-if="!isDisabledCurrency" class="form-group">
        <label class="form-label">
          <span v-if="filter.group_id"> {{ $t('financing.financing_list.currency') }}: </span>
          <span v-else> {{ $t('financing.financing_list.currency_by_all_group') }}:</span>
        </label>

        <div class="form-select form-select-currency">
          <a-select v-model:value="filter.currency_code" @change="onChangeCurrency">
            <a-select-option v-for="item in currencyList" :key="item.id" :value="item.code">
              {{ item.code }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <!-- ./Currency -->
    </div>
  </div>
</template>
<script>
export default defineComponent({
  name: 'BalanceRegistrationFilter',
  setup() {}
})
</script>

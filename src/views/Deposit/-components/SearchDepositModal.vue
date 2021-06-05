<template>
  <a-modal v-model:visible="visible" :title="$t('financing.title_search')" class="search-deposit" width="800px">
    <template #footer>
      <a-config-provider :locale="locales[locale]">
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">入出金日</label>

              <div class="form-select">
                <a-range-picker style="width: 256px" format="YYYY-MM" :placeholder="['YYYY/MM', 'YYYY/MM']">
                  <template #suffixIcon>
                    <CalendarOutlined />
                  </template>
                </a-range-picker>
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-content">
              <label class="form-label">計上月</label>

              <div class="form-select">
                <a-range-picker style="width: 256px" format="YYYY-MM" :placeholder="['YYYY/MM', 'YYYY/MM']">
                  <template #suffixIcon>
                    <CalendarOutlined />
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

          <!-- Category -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">大分類</label>

              <div class="form-checkbox">
                <a-checkbox-group v-model:value="checkedCategotyList" :options="categoryList"  />
              </div>
            </div>
          </div>

          <!-- Sub Category -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">中分類</label>

              <div class="form-checkbox">
                <a-checkbox-group v-model:value="checkedSubCategotyList" :options="subCategoryList"  />
              </div>
            </div>
          </div>

          <!-- Confirmed -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">Confirmed ?</label>

              <div class="form-checkbox">
                <a-radio-group :options="confirmedOptions">
                  <a-radio :value="1"></a-radio>
                  <a-radio :value="2"></a-radio>
                </a-radio-group>
              </div>
            </div>
          </div>

          <a-button key="back" @click="handleCancel">{{ $t('financing.handle_cancel') }}</a-button>
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
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import localeJa from 'ant-design-vue/es/locale/ja_JP'
import localeEn from 'ant-design-vue/es/locale/en_US'

import SearchIcon from '@/assets/icons/ico_search.svg'
import { CalendarOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'Search',

  components: { SearchIcon, CalendarOutlined },

  setup() {
    const store = useStore()
    const route = useRoute()
    const { t, locale } = useI18n()

    const locales = ref({ en: localeEn, ja: localeJa })
    const loading = ref(false)
    const typeDepositList = ['Sales', 'Payment', 'Unclear', 'Cash Transfer']
    const checkedTypeDepositList = ref(['Sales'])
    const categoryList = ref(['大分類 (1)', '大分類 (2)', '大分類 (3)', '大分類 (4)', '大分類 (5)', '大分類 (6)', '大分類 (7)', '大分類 (8)'])
    const checkedCategotyList = ref(['大分類 (1)'])

    const subCategoryList = ref(['大分類 (1)', '大分類 (2)', '大分類 (3)', '大分類 (4)', '大分類 (5)', '大分類 (6)', '大分類 (7)', '大分類 (8)' ])
    const checkedSubCategotyList = ref(['大分類 (1)'])

    const confirmedOptions = ref(['Yes', 'No'])

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
      alert('ok')
    }

    return {
      locales,
      locale,
      loading,
      visible,
      typeDepositList,
      checkedTypeDepositList,
      categoryList,
      checkedCategotyList,
      subCategoryList,
      checkedSubCategotyList,
      confirmedOptions,

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

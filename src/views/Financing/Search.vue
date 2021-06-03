<template>
  <a-modal v-model:visible="visible" :title="$t('financing.title_search')" class="search-financing" width="800px">
    <template #footer>
      <a-config-provider :locale="locales[locale]">
        <form @submit.prevent="onSubmit">
          <!-- Group -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label">{{ $t('financing.group') }}</label>

              <div class="form-select">
                <a-select
                  v-model:value="groupsValue"
                  :placeholder="$t('financing.group_placeholder')"
                  style="width: 152px"
                  @change="handleChange"
                >
                  <a-select-option v-for="group in dataGroups" :key="group">
                    {{ group }}
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
                <a-select v-model:value="stagesValue" placeholder="" style="width: 80px" @change="handleChange">
                  <a-select-option v-for="stage in dataStages" :key="stage" :value="stage">
                    {{ stage }}
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
                  style="width: 300px"
                  format="YYYY-MM"
                  :placeholder="['YYYY/MM', 'YYYY/MM']"
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
                <a-radio-group :options="display" @change="handleChange">
                  <a-radio :value="1"></a-radio>
                  <a-radio :value="2"></a-radio>
                </a-radio-group>
              </div>
            </div>
          </div>
          <!-- ./Display -->

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
  import { defineComponent, ref, reactive, computed } from 'vue'
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
      const groupsValue = ref()
      const stagesValue = ref()

      const dataGroups = reactive(['tomato', 'orange', 'carrot'])
      const dataStages = reactive(['One', 'Two', 'Three'])
      const display = reactive([t('financing.display_monthly'), t('financing.display_all')])

      const visible = computed({
        get: () => store.getters.currentRoute === route.name,
        set: (val) => {
          store.commit('setCurrentRoute', val)
        }
      })

      function handleOk() {
        loading.value = true
        setTimeout(() => {
          loading.value = false
          visible.value = false
        }, 2000)
      }

      function handleCancel() {
        visible.value = false
      }

      function onSubmit() {
        alert('ok')
      }

      function handleChange() {
        console.log('aa')
      }

      return {
        locales,
        locale,
        loading,
        visible,
        groupsValue,
        stagesValue,
        dataGroups,
        dataStages,
        display,
        handleOk,
        handleCancel,
        onSubmit,
        handleChange
      }
    }
  })
</script>
<style scoped lang="scss">
</style>

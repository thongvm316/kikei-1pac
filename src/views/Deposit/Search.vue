<template>
  <section>
    <div>
      <a-modal
        v-model:visible="visible"
        :title="$t('deposit.title_search')"
        class="search-deposit"
        width="85%"
        max-height="85%"
      >
        <template #footer>
          <div class="form-deposit">
            <Form class="form-left" @submit="onSubmit">
              <!-- Keyword -->
              <div class="form-group">
                <Field v-slot="{ field, handleChange }" v-model="filter.keyword" :name="$t('deposit.keyword')">
                  <div class="form-content">
                    <label class="form-label">{{ $t('deposit.keyword') }}</label>
                    <div class="form-input">
                      <a-input :value="field.value" :placeholder="$t('deposit.place_input')" @change="handleChange" />
                    </div>
                  </div>
                </Field>
              </div>

              <!-- Classification -->
              <Field
                v-slot="{ field, handleChange }"
                v-model="filter.classification"
                :name="$t('deposit.classification')"
              >
                <div class="checkbox__input">
                  <label class="label-input">
                    {{ $t('deposit.classification') }}
                  </label>
                  <a-checkbox-group v-model="field.value" :options="plainOptions" @change="handleChange" />
                </div>
              </Field>

              <!-- Country -->
              <Field v-slot="{ field, handleChange }" v-model="filter.country" :name="$t('deposit.country')">
                <div class="checkbox__input">
                  <label class="label-input">
                    {{ $t('deposit.country') }}
                  </label>
                  <a-checkbox-group v-model="field.value" :options="countries" @change="handleChange" />
                </div>
              </Field>

              <!-- Currency -->
              <Field v-slot="{ field, handleChange }" v-model="filter.currency" :name="$t('deposit.currency')">
                <div class="checkbox__input">
                  <label class="label-input">
                    {{ $t('deposit.currency') }}
                  </label>
                  <a-checkbox-group v-model="field.value" :options="currencies" @change="handleChange" />
                </div>
              </Field>

              <a-button key="submit" type="primary" html-type="submit" :loading="loading">
                <template #icon>
                  <span class="btn-icon">
                    <search-icon />
                  </span>
                </template>
                {{ $t('deposit.handle_ok') }}
              </a-button>
            </Form>
          </div>

          <div class="table-deposit">
            <a-table
              :columns="columns"
              :data-source="data"
              :pagination="false"
              :expand-icon-as-cell="false"
              :scroll="{ y: 350 }"
              table-layout="fixed"
            >
              <template #action="{ record }">
                <a-button :disabled="record.disabled" type="primary">確定</a-button>
              </template>
            </a-table>

            <a-pagination v-model:current="page" :total="101" :page-size="10" size="small" />
          </div>
        </template>
      </a-modal>
    </div>
  </section>
</template>

<script>
import { computed, defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import SearchIcon from '@/assets/icons/ico_search.svg'

const columns = [
  { title: '選択', dataIndex: 'select', key: 'select', slots: { customRender: 'action' } },
  { title: '企業名', dataIndex: 'company', key: 'company' },
  { title: '企業コード', dataIndex: 'idCompany', key: 'idCompany' },
  { title: '国', dataIndex: 'country', key: 'country' },
  { title: '通貨', dataIndex: 'currency', key: 'currency' },
  { title: '区分', dataIndex: 'division', key: 'division' }
]

const data = []
for (let i = 0; i < 50; i++) {
  data.push({
    key: i,
    company: 'HITACHI VIETNAM',
    idCompany: 'GXX',
    country: 'Japan',
    currency: 'JPY',
    division: '顧客'
  })
}

export default defineComponent({
  name: 'Search',

  components: {
    SearchIcon
  },

  setup() {
    const store = useStore()
    const route = useRoute()

    const page = ref(3)
    const loading = ref(false)
    const plainOptions = reactive(['顧客', 'パートナー'])
    const countries = reactive(['Japan', 'Vietnam'])
    const currencies = reactive(['JPY', 'VND'])
    const filter = reactive({ keyword: '', classification: [], country: [], currency: [] })

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

    return {
      page,
      loading,
      visible,
      plainOptions,
      countries,
      currencies,
      filter,
      handleOk,
      handleCancel,
      onSubmit,
      data,
      columns
    }
  }
})
</script>

<style scoped></style>

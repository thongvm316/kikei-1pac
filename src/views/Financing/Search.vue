<template>
  <a-modal v-model:visible="visible" :title="$t('financing.title_search')" class="search-financing" width="800px">
    <template #footer>
      <Form @submit="onSubmit">
        <!-- Group -->
        <div class="form-group">
          <Field
            v-slot="{ field, errors, handleChange }"
            v-model="filter.keyword"
            :name="$t('financing.keyword')"
            rules="required"
          >
            <div class="form-content">
              <label class="form-label">{{ $t('financing.keyword') }}</label>

              <div class="form-select">
                <a-select default-value="lucy" style="width: 152px" @change="handleChange">
                  <a-select-option value="jack">
                    Jack
                  </a-select-option>
                  <a-select-option value="lucy">
                    Lucy
                  </a-select-option>
                  <a-select-option value="Yiminghe">
                    yiminghe
                  </a-select-option>
                </a-select>
                <ErrorMessage v-slot="{ message }" as="span" :name="$t('financing.keyword')" class="errors">
                  {{ message }}
                </ErrorMessage>
              </div>

            </div>
          </Field>
        </div>
        <!--./Group -->
        <!--Stage-->
        <div class="form-group">
          <Field
            v-slot="{ field, errors, handleChange }"
            v-model="filter.keyword"
            :name="$t('financing.keyword')"
            rules="required"
          >
            <div class="form-content">
              <label class="form-label">{{ $t('financing.stage') }}</label>

              <div class="form-select">
                <a-select default-value="lucy" style="width: 81px" @change="handleChange">
                  <a-select-option value="jack">
                    Jack
                  </a-select-option>
                  <a-select-option value="lucy">
                    Lucy
                  </a-select-option>
                  <a-select-option value="Yiminghe">
                    yiminghe
                  </a-select-option>
                </a-select>
                <ErrorMessage v-slot="{ message }" as="span" :name="$t('financing.keyword')" class="errors">
                  {{ message }}
                </ErrorMessage>
              </div>

            </div>
          </Field>
        </div>
        <!--./Stage -->
        <!--Date From-->
        <div class="form-group">
          <Field
            v-slot="{ field, errors, handleChange }"
            v-model="filter.keyword"
            :name="$t('financing.keyword')"
            rules="required"
          >
            <div class="form-content">
              <label class="form-label"></label>

              <div class="form-select">
                <a-date-picker @change="onChange" style="width: 142px" />
                <ErrorMessage v-slot="{ message }" as="span" :name="$t('financing.keyword')" class="errors">
                  {{ message }}
                </ErrorMessage>
              </div>
              <div class="form-select">
                <SwapRightIcon />
              </div>
              <div class="form-select">
                <a-date-picker @change="onChange" style="width: 142px" />
                <ErrorMessage v-slot="{ message }" as="span" :name="$t('financing.keyword')" class="errors">
                  {{ message }}
                </ErrorMessage>
              </div>
            </div>
          </Field>
        </div>
        <!--./Date From -->
        <!-- Display -->
        <div class="form-group">
          <Field
            v-slot="{ field, handleChange }"
            v-model="filter.classification"
            :name="$t('financing.classification')"
            rules="required"
          >
            <div class="form-content">
              <label class="form-label">{{ $t('financing.display') }}</label>
              <div class="form-checkbox">
                <a-radio-group v-model="value" :options="plainOptions" @change="onChange">
                  <a-radio :value="1">
                  </a-radio>
                  <a-radio :value="2">
                  </a-radio>
                </a-radio-group>

              </div>
            </div>
            <!-- Error message -->
            <ErrorMessage v-slot="{ message }" as="span" :name="$t('financing.classification')" class="errors">{{
              message
              }}
            </ErrorMessage>
          </Field>
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
      </Form>
    </template>
  </a-modal>
</template>

<script>
  import { defineComponent, ref, reactive } from 'vue'

  import SearchIcon from '@/assets/icons/ico_search.svg'
  import SwapRightIcon from '@/assets/icons/ico_swap_right.svg'

  export default defineComponent({
    name: 'Search',
    components: {
      SearchIcon,
      SwapRightIcon
    },
    setup() {
      const loading = ref(false)
      const visible = ref(true)
      const plainOptions = reactive(['顧客', 'パートナー'])
      const countries = reactive(['Japan', 'Vietnam'])
      const currencies = reactive(['JPY', 'VND'])
      const filter = reactive({ keyword: '', classification: [], country: [], currency: [] })

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
        loading,
        visible,
        plainOptions,
        countries,
        currencies,
        filter,
        handleOk,
        handleCancel,
        onSubmit
      }
    }
  })
</script>

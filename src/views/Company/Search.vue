<template>
  <a-modal v-model:visible="visible" :title="$t('company.title_search')" class="search-company" width="800px">
    <template #footer>
      <Form @submit="onSubmit">
        <!-- Keyword -->
        <div class="form-group">
          <Field
            v-slot="{ field, errors, handleChange }"
            v-model="filter.keyword"
            :name="$t('company.keyword')"
            rules="required"
          >
            <div class="form-content">
              <label class="form-label">{{ $t('company.keyword') }}</label>
              <div class="form-input">
                <a-input
                  :value="field.value"
                  :class="{ has__error: errors.length }"
                  class="w-339"
                  placeholder="入力してください"
                  @change="handleChange"
                />
                <!-- note -->
                <span class="note" v-text="`※会社名、会社コードより検索します`" />
                <!-- Error message -->
                <ErrorMessage v-slot="{ message }" as="span" :name="$t('company.keyword')" class="errors">
                  {{ message }}
                </ErrorMessage>
              </div>
            </div>
          </Field>
        </div>

        <!-- Classification -->
        <div class="form-group">
          <Field
            v-slot="{ field, handleChange }"
            v-model="filter.classification"
            :name="$t('company.classification')"
            rules="required"
          >
            <div class="checkbox__input">
              <label class="label-input">
                {{ $t('company.classification') }}
              </label>
              <a-checkbox-group v-model="field.value" :options="plainOptions" @change="handleChange" />
            </div>
            <!-- Error message -->
            <ErrorMessage v-slot="{ message }" as="span" :name="$t('company.classification')" class="errors">{{
              message
            }}</ErrorMessage>
          </Field>
        </div>

        <!-- Country -->
        <Field v-slot="{ field, handleChange }" v-model="filter.country" :name="$t('company.country')" rules="required">
          <div class="checkbox__input">
            <label class="label-input">
              {{ $t('company.country') }}
            </label>
            <a-checkbox-group v-model="field.value" :options="countries" @change="handleChange" />
          </div>
          <!-- Error message -->
          <ErrorMessage v-slot="{ message }" as="span" :name="$t('company.country')" class="errors">{{
            message
          }}</ErrorMessage>
        </Field>

        <!-- Currency -->
        <Field
          v-slot="{ field, handleChange }"
          v-model="filter.currency"
          :name="$t('company.currency')"
          rules="required"
        >
          <div class="checkbox__input">
            <label class="label-input">
              {{ $t('company.currency') }}
            </label>
            <a-checkbox-group v-model="field.value" :options="currencies" @change="handleChange" />
          </div>
          <!-- Error message -->
          <ErrorMessage v-slot="{ message }" as="span" :name="$t('company.currency')" class="errors">{{
            message
          }}</ErrorMessage>
        </Field>

        <a-button key="back" @click="handleCancel">{{ $t('company.handle_cancel') }}</a-button>
        <a-button key="submit" type="primary" html-type="submit" :loading="loading">
          <template #icon>
            <span class="btn-icon">
              <search-icon />
            </span>
          </template>
          {{ $t('company.handle_ok') }}
        </a-button>
      </Form>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'

import SearchIcon from '@/assets/icons/ico_search.svg'

export default defineComponent({
  name: 'Search',
  components: {
    SearchIcon
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

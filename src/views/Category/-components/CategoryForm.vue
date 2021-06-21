<template>
  <div class="card-common">
    <!-- Form -->
    <form @submit="onSubmit">
      <!-- Category name -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.name" name="categoryName" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('category.categoryName') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="categoryName" class="errors">
                {{ replaceField(message, 'categoryName') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- DIVISIONCATEGORY -->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('category.category_division') }}</label>

          <div class="form-input">
            <a-radio-group v-model:value="form.division_type">
              <a-radio v-for="item in DIVISIONCATEGORY" :key="item.id" :value="item.id">{{
                $t(`category.${item.value}`)
              }}</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>

      <!-- DIVISIONMEDIUM -->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('category.medium_classification') }}</label>

          <div class="form-input">
            <a-radio-group v-model:value="form.subcategory_kind">
              <a-radio v-for="item in DIVISIONMEDIUM" :key="item.id" :value="item.id">{{
                $t(`category.${item.value}`)
              }}</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>

      <!-- INUSE -->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('category.use_distinction') }}</label>

          <div class="form-input">
            <a-radio-group v-model:value="form.in_use">
              <a-radio v-for="item in INUSE" :key="item.id" :value="item.id">{{
                $t(`category.${item.value}`)
              }}</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>

      <!-- Action Section Submit & Cancel -->
      <div class="card-footer">
        <a-button key="back" style="width: 105px; margin-right: 16px" @click="handleCancel"
          >{{ $t('common.cancel') }}
        </a-button>
        <a-button key="submit" type="primary" html-type="submit" style="width: 105px">
          {{ $route.name === 'category-edit' ? $t('common.edit') : $t('common.new') }}
        </a-button>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'

import { DIVISIONCATEGORY, DIVISIONMEDIUM, INUSE } from '@/enums/category.enum'

import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'
import useUpdateCategoryService from '@/views/Category/composables/useUpdateCategoryService'
import useCreateCategoryService from '@/views/Category/composables/useCreateCategoryService'

export default defineComponent({
  name: 'CategoryForm',

  setup() {
    let form = ref({
      name: '',
      subcategory_kind: 0,
      division_type: 0,
      in_use: 0
    })
    const router = useRouter()
    const route = useRoute()
    const { handleSubmit, setFieldError } = useForm()
    const { t, locale } = useI18n()

    onMounted(() => {
      if ('id' in route.params && route.name === 'category-edit') {
        form.value = { ...form.value, ...camelToSnakeCase(route.meta['detail']) }
      }
    })

    const handleCancel = () => {
      router.push({ name: 'category' })
    }

    const onSubmit = handleSubmit(() => {
      let data = { ...form.value }
      data = { ...deleteEmptyValue(data) }

      if (route.name === 'category-edit') {
        updateCategory(data)
      } else {
        createCategory(data)
      }
    })

    const updateCategory = async (data) => {
      const id = route.params.id
      // eslint-disable-next-line no-useless-catch
      try {
        const { updateCategory } = useUpdateCategoryService(id, data)
        await updateCategory()
        // await this.onSuccess(this.$t('message_success'), this.$t('update_message_successfully'))
        await router.push({ name: 'category' }).catch((err) => err)
      } catch (err) {
        throw err
      }
    }

    const createCategory = async (data) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const { createCategory } = useCreateCategoryService(data)
        await createCategory()
        await router.push({ name: 'category' })
      } catch (err) {
        checkErrorsApi(err)
        throw err
      }
    }

    const checkErrorsApi = (err) => {
      for (let item in err.response.data.errors) {
        locale.value === 'en'
          ? (err.response.data.errors[item] = 'The content existed')
          : (err.response.data.errors[item] = '内容は存在しました。')
        setFieldError(item, err.response.data.errors[item])
      }
    }

    const replaceField = (text, field) => {
      return text.replace(field, t(`category.${field}`))
    }

    return {
      form,
      onSubmit,
      handleCancel,
      updateCategory,
      createCategory,
      replaceField,
      DIVISIONCATEGORY,
      DIVISIONMEDIUM,
      INUSE
    }
  }
})
</script>

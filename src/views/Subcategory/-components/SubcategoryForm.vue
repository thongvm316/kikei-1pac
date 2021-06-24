<template>
  <div class="card-common">
    <!-- Form -->
    <form @submit="onSubmit">
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

import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'
import useUpdateSubcategoryService from '@/views/Subcategory/composables/useUpdateSubcategoryService'
import useCreateSubcategoryService from '@/views/Subcategory/composables/useCreateSubcategoryService'

export default defineComponent({
  name: 'SubcategoryForm',

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
      if ('id' in route.params && route.name === 'subcategory-edit') {
        form.value = { ...form.value, ...camelToSnakeCase(route.meta['detail']) }
      }
    })

    const handleCancel = () => {
      router.push({ name: 'subcategory' })
    }

    const onSubmit = handleSubmit(() => {
      let data = { ...form.value }
      data = { ...deleteEmptyValue(data) }

      if (route.name === 'subcategory-edit') {
        updateSubCategory(data)
      } else {
        createSubCategory(data)
      }
    })

    const updateSubCategory = async (data) => {
      const id = route.params.id
      // eslint-disable-next-line no-useless-catch
      try {
        const { updateSubCategory } = useUpdateSubcategoryService(id, data)
        await updateSubCategory()
        // await this.onSuccess(this.$t('message_success'), this.$t('update_message_successfully'))
        await router.push({ name: 'subcategory' }).catch((err) => err)
      } catch (err) {
        throw err
      }
    }

    const createSubCategory = async (data) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const { createSubCategory } = useCreateSubcategoryService(data)
        await createSubCategory()
        await router.push({ name: 'subcategory' })
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
      return text.replace(field, t(`subcategory.${field}`))
    }

    return {
      form,
      onSubmit,
      handleCancel,
      updateSubcategory,
      createSubCategory,
      replaceField,
    }
  }
})
</script>

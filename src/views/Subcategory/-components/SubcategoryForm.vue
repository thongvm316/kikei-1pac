<template>
<div class="card-common">
    <!-- Form -->
    <form @submit="onSubmit">
      <!-- category Name-->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.category_name" name="category_id">
          <div class="form-content">
            <label class="form-label">{{ $t('subcategory.category') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                maxLength="20"
                class="w-300"
                :disabled=true
                @change="handleChange"
              ></a-input>
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="category" class="errors">
                {{ replaceField(message, 'category') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- subcategory name -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.name" name="name" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('subcategory.subcategoryName') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="name" class="errors">
                {{ replaceField(message, 'name') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- subcategory example -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.example" name="example">
          <div class="form-content">
            <label class="form-label">{{ $t('subcategory.example') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="example" class="errors">
                {{ replaceField(message, 'example') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- INUSE -->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('subcategory.use_distinction') }}</label>

          <div class="form-input">
            <a-radio-group v-model:value="form.in_use">
              <a-radio v-for="item in INUSE" :key="item.id" :value="item.boolean">{{
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
          {{ $route.name === 'subcategory-edit' ? $t('common.edit') : $t('common.new') }}
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
import useUpdateSubCategoryService from '@/views/Subcategory/composables/useUpdateSubcategoryService'
import useCreateSubCategoryService from '@/views/Subcategory/composables/useCreateSubcategoryService'
import {INUSE} from '@/enums/subcategory.enum'

export default defineComponent({
  name: 'SubCategoryForm',

  setup() {
    let form = ref({
      category_id: 5,
      name: '',
      example:'',
      in_use: 0,
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
        const { updateSubCategory } = useUpdateSubCategoryService(id, data)
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
        const { createSubCategory } = useCreateSubCategoryService(data)
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
      updateSubCategory,
      createSubCategory,
      replaceField,
      INUSE,
    }
  }
})
</script>

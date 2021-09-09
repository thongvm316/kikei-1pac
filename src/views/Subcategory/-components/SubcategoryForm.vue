<template>
  <div class="card-common">
    <!-- Form -->
    <form @submit="onSubmit">
      <!-- category Name-->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('subcategory.category') }}</label>
          <div class="form-input">
            <a-input
              v-model:value="$route.query.name"
              max-length="20"
              class="w-300"
              :disabled="true"
              :placeholder="$t('common.please_enter')"
            />
          </div>
        </div>
      </div>

      <!-- subcategory name -->
      <div class="form-group">
        <Field
          v-slot="{ field, handleChange, errors }"
          v-model="form.name"
          name="subcategory_name"
          rules="input_required"
        >
          <div class="form-content">
            <label class="form-label required">{{ $t('subcategory.subcategory_name') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                :class="errors.length ? 'input_border' : ''"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="subcategory_name" class="errors">
                {{ replaceField(message, 'subcategory_name') }}
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
        <a-button key="back" class="btn-close" style="width: 105px; margin-right: 16px" @click="handleCancel"
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
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'

import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'
import useUpdateSubCategoryService from '@/views/Subcategory/composables/useUpdateSubcategoryService'
import useCreateSubCategoryService from '@/views/Subcategory/composables/useCreateSubcategoryService'
import { INUSE } from '@/enums/subcategory.enum'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'SubCategoryForm',

  setup() {
    let form = ref({
      category_id: 0,
      name: '',
      example: '',
      in_use: true
    })

    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const { handleSubmit, setFieldError } = useForm()
    const { t, locale } = useI18n()
    let idSelected = ref({})

    const subcategoryEnums = ref({
      subcategory_name: t('subcategory.error_subcategory_name')
    })

    const tmpErrors = ref()

    onMounted(() => {
      if ('id' in route.params && route.name === 'subcategory-edit') {
        form.value = { ...form.value, ...camelToSnakeCase(route.meta['detail']) }
      } else {
        form.value.category_id = parseInt(route.params.category_id)
        form.value.category_name = route.params.name
      }
    })

    watch(
      () => locale.value,
      () => {
        verifyErrors(tmpErrors.value)
      }
    )

    const handleCancel = () => {
      idSelected.value = {
        key_search: route.query.key_search,
        category_id: route.query.category_id,
        name: route.query.name,
        id: route.query.id
      }
      router.push({
        name: 'subcategory',
        params: route.params,
        query: idSelected.value
      })
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
        await router.push({ name: 'subcategory', params: route.params, query: route.query })
      } catch (err) {
        throw err
      }

      //show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'success',
        duration: 5,
        message: locale.value === 'en' ? 'Update' + form.value.name : form.value.name + 'が更新されました'
      })
    }

    const createSubCategory = async (data) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const { createSubCategory } = useCreateSubCategoryService(data)
        await createSubCategory()
        await router.push({ name: 'subcategory', params: route.params, query: route.query })
      } catch (err) {
        checkErrorsApi(err)
        throw err
      }
    }

    const checkErrorsApi = (err) => {
      tmpErrors.value = camelToSnakeCase(err.response.data.errors)

      verifyErrors(tmpErrors.value)
    }

    const verifyErrors = (errs) => {
      for (let item in errs) {
        if (item === 'company_code') item = 'company_code_project'

        locale.value === 'en'
          ? (errs[item] = `${subcategoryEnums.value[item]} existed`)
          : (errs[item] = `${subcategoryEnums.value[item]}は存在しました`)

        setFieldError(item, errs[item])
      }
    }

    const replaceField = (text, field) => {
      return text.replace(field, t(`subcategory.error_${field}`))
    }

    return {
      form,
      onSubmit,
      handleCancel,
      updateSubCategory,
      createSubCategory,
      replaceField,
      INUSE
    }
  }
})
</script>

<template>
  <div class="card-common">
    <!-- Form -->
    <form @submit="onSubmit">
      <!-- Category name -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange, errors }" v-model="form.name" name="category_name" rules="input_required">
          <div class="form-content">
            <label class="form-label required">{{ $t('category.category_name') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                :class="errors.length ? 'input_border' : ''"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="category_name" class="errors">
                {{ replaceField(message, 'category_name') }}
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
              <a-radio
                v-for="item in DIVISIONMEDIUM"
                :key="item.id"
                :value="item.id"
                @change="item.id === 0 ? (isOpen = true) : (isOpen = false)"
                >{{ $t(`category.${item.value}`) }}</a-radio
              >
            </a-radio-group>
          </div>

          <template v-if="isOpen">
            <div class="form-group form-other">
              <Field v-slot="{ field, handleChange }" v-model="form.subcategory_other" name="categoryOther">
                <div class="form-content">
                  <label class="form-label">{{ $t('category.categoryOther') }}</label>
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
          </template>
        </div>
      </div>

      <!-- INUSE -->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('category.use_distinction') }}</label>

          <div class="form-input">
            <a-radio-group v-model:value="form.in_use">
              <a-radio v-for="item in INUSE" :key="item.id" :value="item.boolean">{{
                $t(`category.${item.value}`)
              }}</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>

      <!-- INREPORT -->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('category.report') }}</label>

          <div class="form-input">
            <a-radio-group v-model:value="form.show_in_report">
              <a-radio v-for="item in INREPORT" :key="item.id" :value="item.boolean">
                <template v-if="item.boolean"><CheckOutlined /></template>
                <template v-else><CloseOutlined /></template>
              </a-radio>
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

import { DIVISIONCATEGORY, DIVISIONMEDIUM, INUSE, INREPORT } from '@/enums/category.enum'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'

import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'
import useUpdateCategoryService from '@/views/Category/composables/useUpdateCategoryService'
import useCreateCategoryService from '@/views/Category/composables/useCreateCategoryService'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'CategoryForm',

  components: { CheckOutlined, CloseOutlined },

  setup() {
    let form = ref({
      name: '',
      subcategory_kind: 10,
      division_type: 0,
      in_use: true,
      subcategory_other: '',
      description: '',
      show_in_report: true
    })
    const isOpen = ref(false)
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const { handleSubmit, setFieldError } = useForm()
    const { t, locale } = useI18n()

    const categoryEnums = ref({
      category_name: t('category.error_category_name')
    })

    onMounted(() => {
      if ('id' in route.params && route.name === 'category-edit') {
        form.value = { ...form.value, ...camelToSnakeCase(route.meta['detail']) }
      }
    })

    const handleCancel = () => {
      router.push({ name: 'category', params: route.params, query: route.query })
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
        await router.push({ name: 'category' })
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
      err.response.data.errors = camelToSnakeCase(err.response.data.errors)

      for (let item in err.response.data.errors) {
        locale.value === 'en'
          ? (err.response.data.errors[item] = `${categoryEnums.value[item]} existed`)
          : (err.response.data.errors[item] = `${categoryEnums.value[item]}が存在しました`)
        setFieldError(item, err.response.data.errors[item])
      }
    }

    const replaceField = (text, field) => {
      return text.replace(field, t(`category.error_${field}`))
    }

    return {
      form,
      onSubmit,
      isOpen,
      handleCancel,
      updateCategory,
      createCategory,
      replaceField,
      DIVISIONCATEGORY,
      DIVISIONMEDIUM,
      INUSE,
      INREPORT
    }
  }
})
</script>

<style scoped lang="scss">
.form-other {
  margin-top: 12px;
  margin-left: 24px;
}
</style>

<template>
  <div class="card-common form-create">
    <modal-upload-electronic-seal
      v-model:visible="modalCrop"
      :file-content="fileContent"
      @back-modal="handleBack($event)"
      @file-img="onFileImg($event)"
    />

    <modal-delete-company-infomation
      v-model:visible="openDelete"
      :props-data-delete="propsDataDelete"
      class="close-modal-delete"
    />

    <modal-leave-group-setting v-model:visible="modalLeave" />

    <form @submit.prevent="onSubmit">
      <!-- Registered name -->
      <div class="form-group">
        <Field
          v-slot="{ field, handleChange, errors }"
          v-model="form.registered_name"
          name="registered_name"
          rules="input_required"
        >
          <div class="form-content">
            <label class="form-label required">{{ $t('company_infomation.registered_name') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('company_infomation.please_enter')"
                class="w-300"
                :class="errors.length ? 'input_border' : ''"
                @input="changeInput"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="registered_name" class="errors">
                {{ replaceField(message, 'registered_name') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- Display name -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange, errors }" v-model="form.name" name="name" rules="input_required">
          <div class="form-content">
            <label class="form-label required">{{ $t('company_infomation.name') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('company_infomation.please_enter')"
                class="w-300"
                :class="errors.length ? 'input_border' : ''"
                @input="changeInput"
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

      <!-- Country -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.country_id" name="country" rules="select_required">
          <div class="form-content">
            <label class="form-label required">{{ $t('company_infomation.country') }}</label>
            <div class="form-input">
              <a-select v-model:value="field.value" style="width: 300px" @change="handleChange" @select="changeSelect">
                <a-select-option v-for="country in countryList" :key="country.id" :value="country.id">
                  {{ $t(`company_infomation.${country.code}`) }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </Field>
      </div>

      <div class="line-4">
        <div class="line-4__left">
          <!-- Address -->
          <div class="form-group">
            <Field
              v-slot="{ field, handleChange, errors }"
              v-model="form.address"
              name="address"
              rules="input_required"
            >
              <div class="form-content">
                <label class="form-label required">{{ $t('company_infomation.address') }}</label>
                <div class="form-input">
                  <a-input
                    :value="field.value"
                    :placeholder="$t('company_infomation.please_enter')"
                    class="w-300"
                    :class="errors.length ? 'input_border' : ''"
                    @input="changeInput"
                    @change="handleChange"
                  />
                  <!-- Error message -->
                  <ErrorMessage v-slot="{ message }" as="span" name="address" class="errors">
                    {{ replaceField(message, 'address') }}
                  </ErrorMessage>
                </div>
              </div>
            </Field>
          </div>
        </div>

        <div class="line-4__right">
          <!-- Postal code -->
          <div class="form-group">
            <Field
              v-slot="{ field, handleChange, errors }"
              v-model="form.postal_code"
              name="postal_code"
              rules="input_required"
            >
              <div class="form-content">
                <label class="form-label required">{{ $t('company_infomation.postal_code') }}</label>
                <div class="form-input">
                  <a-input
                    :value="field.value"
                    :placeholder="$t('company_infomation.please_enter')"
                    class="w-300"
                    :class="errors.length ? 'input_border' : ''"
                    @input="changeInput"
                    @change="handleChange"
                  />
                  <!-- Error message -->
                  <ErrorMessage v-slot="{ message }" as="span" name="postal_code" class="errors">
                    {{ replaceField(message, 'postal_code') }}
                  </ErrorMessage>
                </div>
              </div>
            </Field>
          </div>
        </div>
      </div>

      <!-- Telephone number -->
      <div class="form-group">
        <Field
          v-slot="{ field, handleChange, errors }"
          v-model="form.phone_number"
          name="phone_number"
          rules="input_required|numeric"
        >
          <div class="form-content">
            <label class="form-label required">{{ $t('company_infomation.error_phone_number') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('company_infomation.please_enter')"
                class="w-300"
                :class="errors.length ? 'input_border' : ''"
                @input="changeInput"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="phone_number" class="errors">
                <template v-if="message === 'phone_numberは数字のみ使用できます'">
                  {{ $t('company_infomation.error_empty_number') }}
                </template>
                <template v-else>
                  {{ replaceField(message, 'phone_number') }}
                </template>
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- Representative name -->
      <div class="form-group">
        <Field
          v-slot="{ field, handleChange, errors }"
          v-model="form.representative_name"
          name="representative_name"
          rules="input_required"
        >
          <div class="form-content">
            <label class="form-label required">{{ $t('company_infomation.representative_name') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('company_infomation.please_enter')"
                class="w-300"
                :class="errors.length ? 'input_border' : ''"
                @input="changeInput"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="representative_name" class="errors">
                {{ replaceField(message, 'representative_name') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- In roman letters -->
      <div class="form-group">
        <Field
          v-slot="{ field, handleChange, errors }"
          v-model="form.representative_name_latin"
          name="in_roman_letters"
          rules="input_required"
        >
          <div class="form-content">
            <label class="form-label required">{{ $t('company_infomation.in_roman_letters') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('company_infomation.please_enter')"
                class="w-300"
                :class="errors.length ? 'input_border' : ''"
                @input="changeInput"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="in_roman_letters" class="errors">
                {{ replaceField(message, 'in_roman_letters') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <div class="form-group">
        <div class="line-8">
          <div class="line-8__left">
            <!-- Fiscal year -->

            <div class="form-content">
              <label class="form-label required">{{ $t('company_infomation.fiscal_year') }}</label>
              <div class="form-select">
                <a-range-picker
                  :value="form.fiscal_year"
                  :format="'YYYY-MM-DD'"
                  :style="{ width: '256px' }"
                  :placeholder="['YYYY/MM/DD', 'YYYY/MM/DD']"
                  :class="checkDateEmpty ? 'input_border' : ''"
                  @change="onChangeDate"
                >
                  <template #suffixIcon>
                    <CalendarOutlined />
                  </template>
                </a-range-picker>
              </div>
            </div>
          </div>

          <div class="line-8__right">
            <p>
              <span>{{ form.current_year }}</span
              >{{ $t('company_infomation.year') }}<span>{{ form.current_month }}</span
              >{{ $t('company_infomation.as_of_month') }}
            </p>

            <!-- Period -->
            <p class="label-period">{{ $t('company_infomation.no_num') }}</p>

            <Field
              v-slot="{ field, handleChange }"
              v-model="form.period_name"
              name="period"
              rules="input_required|numeric"
            >
              <div class="form-content">
                <div class="form-input">
                  <a-input
                    :value="field.value"
                    :placeholder="$t('company_infomation.please_enter_period')"
                    class="w-300"
                    :class="checkPeriodConflictColor ? 'input_border' : ''"
                    @input="changeInput"
                    @change="handleChange"
                  />

                  <p>{{ $t('company_infomation.period') }}</p>
                </div>
              </div>
            </Field>
          </div>
        </div>
        <!-- Error message -->
        <ErrorMessage v-slot="{ message }" as="span" name="period" class="errors">
          <template v-if="message === 'periodは数字のみ使用できます'">
            {{ $t('company_infomation.error_empty_number') }}
          </template>
          <template v-else>
            {{ replaceField(message, 'period') }}
          </template>
        </ErrorMessage>

        <template v-if="checkDate">
          <span class="errors">{{ $t('company_infomation.empty_date') }}</span>
        </template>
        <template v-if="checkDatePastFuture">
          <span class="errors">{{ $t('company_infomation.empty_date_past_future') }}</span>
        </template>
        <template v-if="checkDatePeriod">
          <span class="errors">{{ $t('company_infomation.empty_period_field') }}</span>
        </template>
        <template v-if="checkPeriodConflict">
          <span class="errors">{{ $t('company_infomation.empty_period') }}</span>
        </template>
        <template v-else>
          <span></span>
        </template>
      </div>

      <!-- Upload -->
      <div class="upload">
        <!--upload img-->
        <div class="upload__img">
          <div class="container">
            <label class="form-label-line8">{{ $t('company_infomation.electronic_seal') }}<span>*</span></label>
            <!--            <template v-if="checkImgEmpty">-->
            <div class="form-group">
              <div class="form-content">
                <div :class="checkImgEmpty ? 'avatar-upload' : 'avatar-upload-empty'">
                  <div :class="checkImgEmpty ? 'avatar-edit' : 'avatar-edit-empty'">
                    <input
                      id="imageUpload"
                      ref="imageUpload"
                      type="file"
                      accept="image/*"
                      hidden
                      @change="onFileChange($event)"
                      @click="resetUploadImage"
                    />
                    <label v-if="!checkImgEmpty" for="imageUpload">
                      <div class="image-upload">
                        <img src="../../../assets/icons/ico_addimg.png" alt="add-img" />
                        <p>{{ $t('company_infomation.upload_image') }}</p>
                      </div>
                    </label>
                    <a-tooltip v-if="checkImgEmpty" color="#fff" :title="$t('modal.tooltip_img')" class="pencil-icon">
                      <label for="imageUpload"></label>
                    </a-tooltip>
                  </div>
                  <div v-if="checkImgEmpty" class="avatar-preview">
                    <template v-if="image">
                      <div id="imagePreview-avatar" :style="{ backgroundImage: `url(${image})` }"></div>
                    </template>
                    <template v-else>
                      <div id="imagePreview"></div>
                    </template>
                  </div>
                </div>

                <!-- Error message -->
                <template v-if="checkImgInuse">
                  <span class="errors">{{ $t('company_infomation.empty_image') }}</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales target setting -->
      <div class="form-group line-10">
        <label class="form-label-line10">{{ $t('company_infomation.sales_target_setting') }}<span>*</span></label>
        <div class="sales-group">
          <p>
            {{ dateStart[0] }}<span>{{ $t('company_infomation.year') }}</span
            >{{ dateStart[1] }}<span>{{ $t('company_infomation.month') }}</span
            >{{ dateStart[2] }}<span>{{ $t('company_infomation.day') }}</span
            >～{{ dateFinish[0] }}<span>{{ $t('company_infomation.year') }}</span
            >{{ dateFinish[1] }}<span>{{ $t('company_infomation.month') }}</span
            >{{ dateFinish[2] }}<span>{{ $t('company_infomation.day') }}</span
            >（<span>{{ $t('company_infomation.no_num') }}</span
            >{{ form.period.name }}<span>{{ $t('company_infomation.period') }}</span
            >）
          </p>

          <Field
            v-slot="{ field, handleChange, errors }"
            v-model="form.money"
            name="target_money"
            rules="input_required|numeric"
          >
            <div class="form-content">
              <div class="form-input">
                <a-input
                  :value="field.value"
                  :placeholder="$t('company_infomation.please_enter_sales')"
                  class="w-300"
                  :class="errors.length ? 'input_border' : ''"
                  :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                  @input="changeInput"
                  @change="handleChange"
                />
                <!-- Error message -->
                <ErrorMessage v-slot="{ message }" as="span" name="target_money" class="errors">
                  <template v-if="message === 'target_moneyは数字のみ使用できます'">
                    {{ $t('company_infomation.error_empty_number') }}
                  </template>
                  <template v-else>
                    {{ replaceField(message, 'target_money') }}
                  </template>
                </ErrorMessage>
              </div>
            </div>
          </Field>

          <Field v-slot="{ field, handleChange }" v-model="form.currency_id" name="currency">
            <div class="form-content">
              <div class="form-input">
                <a-select v-model:value="field.value" class="form-select" @change="handleChange" @select="changeSelect">
                  <a-select-option v-for="currency in currencyList" :key="currency.id" :value="currency.id">
                    {{ $t(`company_infomation.${currency.code}`) }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
          </Field>
        </div>
      </div>

      <company-table-infomation v-show="showTable" :get-data-table="getDataTable" />
      <div class="show-table" @click="handleCollapse">
        <p v-show="showTable">{{ $t('company_infomation.header_close') }}</p>
        <icon-cher-von-right id="icon-right" :class="showTable ? 'transition-top' : 'transition-bottom'" />
      </div>

      <!-- Action Section Submit & Cancel -->
      <div class="card-footer">
        <template v-if="showBtnDel">
          <a-button class="btn-delete-danger" style="margin-right: 16px" @click="handleDeleteRecord">
            {{ $t('modal.delete') }}
          </a-button>
        </template>
        <template v-if="showBtnCancle">
          <a-button class="btn-close" style="margin-right: 16px" @click="handleRevertRecord">
            {{ $t('modal.revert') }}
          </a-button>
        </template>
        <template v-if="isCreate">
          <a-button key="back" class="btn-close" style="width: 105px; margin-right: 16px" @click="handleCancel"
            >{{ $t('common.cancel') }}
          </a-button>
        </template>
        <a-button
          key="submit"
          :disabled="isCreate ? !isCreate : !showBtnCancle"
          type="primary"
          html-type="submit"
          style="width: 105px"
          @click="handleClickSubmit"
        >
          {{ $route.name === 'company-edit' ? $t('common.edit') : $t('common.new') }}
        </a-button>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { forEach, isEmpty, keys, pick, split, uniqueId } from 'lodash-es'
import { currentDate } from '@/helpers/extend-financing'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { camelCaseKeysToUnderscore, camelToSnakeCase } from '@/helpers/camel-to-sake-case'

import useGetCountryListService from '@/views/CompanyInformation/compasables/useGetCountryListService'
import useGetCurrencyListService from '@/views/CompanyInformation/compasables/useGetCurrencyListService'
import useCreateCompanyInfomationService from '@/views/CompanyInformation/compasables/useCreateCompanyInfomation'
import useUpdateCompanyInfomationService from '@/views/CompanyInformation/compasables/useUpdateCompanyInfomationService'

import { CalendarOutlined } from '@ant-design/icons-vue'

import ModalUploadElectronicSeal from '@/components/ModalUploadElectronicSeal'
import CompanyTableInfomation from '@/views/CompanyInformation/-components/CompanyTableInfomation'
import ModalDeleteCompanyInfomation from '@/components/ModalDeleteCompanyInfomation'
import IconCherVonRight from '@/assets/icons/ico_chervon_right.svg'
import moment from 'moment'
import ModalLeaveGroupSetting from '@/components/ModalLeaveGroupSetting'

export default defineComponent({
  name: 'CompanyFormInformation',

  components: {
    ModalLeaveGroupSetting,
    ModalDeleteCompanyInfomation,
    CompanyTableInfomation,
    ModalUploadElectronicSeal,
    CalendarOutlined,
    IconCherVonRight
  },

  props: {
    getDetailTab: {
      type: [Array, Object],
      required: true,
      default: () => []
    },
    targetTab: {
      type: [Array, Object],
      required: true,
      default: () => []
    },
    tabId: {
      type: Number,
      required: true
    },
    checkCreate: {
      type: Boolean,
      required: true
    }
  },

  emits: ['handleCancle'],

  setup(props, { emit }) {
    const store = useStore()
    const { t, locale } = useI18n()
    const { handleSubmit, resetForm, setFieldError } = useForm()

    const { getDetailTab } = toRefs(props)
    const { targetTab } = toRefs(props)
    const { tabId } = toRefs(props)
    const { checkCreate } = toRefs(props)

    let form = ref({
      registered_name: '',
      name: '',
      country_id: 1,
      address: '',
      postal_code: '',
      phone_number: '',
      representative_name: '',
      representative_name_latin: '',
      fiscal_year: [null, null],
      period_name: '',
      period: {
        finished_date: '',
        id: 0,
        name: '',
        started_date: ''
      },
      group_revenue_target: {
        currency_id: 1,
        id: 0,
        money: ''
      },
      money: '',
      currency_id: 1,
      company_seal: '',
      current_year: moment().year(),
      current_month: moment().format('MM')
    })

    const resetFormData = ref({ ...form.value })

    const modalCrop = ref(false)
    const checkImgEmpty = ref(false)
    const checkImgInuse = ref(false)
    const checkDate = ref(false)
    const checkDateEmpty = ref(false)
    const checkDatePastFuture = ref(false)
    const checkDatePeriod = ref(false)
    const checkPeriodEmpty = ref(false)
    const checkPeriodConflict = ref(false)
    const checkPeriodConflictColor = ref(false)
    const isClickSubmit = ref(false)
    const showBtnDel = ref(false)
    const showHeader = ref(false)
    const openDelete = ref(false)
    const showTable = ref(false)
    const modalLeave = ref(false)
    const showBtnCancle = ref(false)
    const isCreate = ref(false)

    const tmpErrors = ref()
    const image = ref()
    const imageUpload = ref()
    const base64result = ref()
    const fileContent = ref([])
    const periodList = ref([])
    const activeKey = ref([])
    const dateStart = ref([])
    const dateFinish = ref([])
    const countryList = ref([])
    const currencyList = ref([])
    const getDataTable = ref([])
    const getTargetTab = ref([])
    const saveDate = ref({})
    const propsDataDelete = ref({})

    const idTab = ref(1)

    const companyEnums = ref({
      name: t('company_infomation.conflict_name'),
      phone_number: t('company_infomation.conflict_phone_number'),
      registered_name: t('company_infomation.conflict_registered_name'),
      target_money: t('company_infomation.required_target_money')
    })

    watch(
      () => locale.value,
      () => {
        verifyErrors(tmpErrors.value)
      }
    )

    watch(getDetailTab, (value) => {
      showBtnDel.value = camelCaseKeysToUnderscore(value)
      form.value = {
        ...form.value,
        ...showBtnDel.value,
        period_name: showBtnDel.value.period.name,
        currency_id: showBtnDel.value.group_revenue_target.currency_id,
        money: showBtnDel.value.group_revenue_target.money
      }

      form.value.fiscal_year[0] = currentDate(form.value.period.started_date)
      form.value.fiscal_year[1] = currentDate(form.value.period.finished_date)

      dateStart.value = [...split(form.value.period.started_date, '-')]
      dateFinish.value = [...split(form.value.period.finished_date, '-')]

      if (form.value.company_seal) {
        checkImgEmpty.value = true
        image.value = form.value.company_seal
      }

      if (form.value.currency_id === 0) {
        form.value.currency_id = currencyList.value[0].id
        form.value.group_revenue_target.currency_id = currencyList.value[0].id
      }

      showHeader.value = false
      checkDate.value = false
      checkPeriodConflict.value = false
      checkDatePeriod.value = false
      checkDatePastFuture.value = false
      checkDateEmpty.value = false
      checkPeriodConflictColor.value = false
    })

    watch(checkCreate, (value) => {
      showBtnDel.value = !value
    })

    // Fetch list table
    watch(targetTab, (value) => {
      showBtnCancle.value = false
      getTargetTab.value = value
      getDataTable.value = value
    })

    watch(tabId, (value) => {
      idTab.value = value
    })

    // Fetch data country
    const fetchCountryList = async () => {
      const { getCountry } = useGetCountryListService()
      const { result } = await getCountry()

      countryList.value = result?.data
    }

    // Fetch data currency
    const fetchCurrencyList = async () => {
      const { getCurrencyCompanyInfomation } = useGetCurrencyListService()
      const { result } = await getCurrencyCompanyInfomation()

      currencyList.value = result?.data
    }

    // Change date rang picker
    const onChangeDate = async (value, dateString) => {
      store.state.company.isCreate ? (showBtnCancle.value = true) : (showBtnCancle.value = false)
      form.value.fiscal_year[0] = !dateString[0] && !dateString[1] ? null : currentDate(dateString[0])
      form.value.fiscal_year[1] = !dateString[0] && !dateString[1] ? null : currentDate(dateString[1])

      if (!dateString[0] && !dateString[1]) {
        saveDate.value = showBtnDel.value.period
      } else {
        dateStart.value = [...split(form.value.period.started_date, '-')]
        dateFinish.value = [...split(form.value.period.finished_date, '-')]
      }

      checkDate.value = false
      checkDateEmpty.value = false
      checkDatePastFuture.value = false
      isClickSubmit.value = false
    }

    const resetUploadImage = () => {
      imageUpload.value.value = []
    }

    const onFileChange = async (e) => {
      store.state.company.isCreate ? (showBtnCancle.value = true) : (showBtnCancle.value = false)
      const files = e.target.files || e.dataTransfer.files
      const fileUploads = []

      if (!files.length) return

      modalCrop.value = true

      for (let file of files) {
        file = Object.assign(file, {
          uid: uniqueId('imageUpload_'),
          src: await toBase64(file)
        })
        fileUploads.push(file)
      }

      fileContent.value = [...fileUploads]
    }

    const onFileImg = (file) => {
      image.value = file.src
      checkImgEmpty.value = true
      checkImgInuse.value = false
    }

    const toBase64 = (file) => {
      const reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    }

    const handleBack = (e) => {
      checkImgEmpty.value = e
    }

    const handleCancel = () => {
      checkImgInuse.value = false
      checkDate.value = false
      checkDateEmpty.value = false
      isClickSubmit.value = false
      showBtnCancle.value = false
      isCreate.value = false
      emit('handleCancle', true)
      store.commit('company/STORE_COMPANY_INFOMATION_REMOVE', false)
      store.commit('company/STORE_COMPANY_INFOMATION_ISCREATE', true)
      store.commit('company/STORE_COMPANY_INFOMATION_LEAVEGROUP', true)
    }

    const handleClickSubmit = () => {
      if (image.value || form.value.fiscal_year[0] === null || form.value.fiscal_year[1] === null) {
        isClickSubmit.value = true
      }
    }

    const handleCollapse = async () => {
      showHeader.value = !showHeader.value
      showTable.value = !showTable.value
    }

    const onSubmit = handleSubmit(() => {
      if (!image.value) {
        checkImgInuse.value = true
      } else {
        let data = { ...form.value }

        if (!isEmpty(fileContent.value)) {
          base64result.value = image.value.split(',')[1]
          if (base64result.value === undefined) base64result.value = image.value
          data = {
            ...form.value,
            company_seal: base64result.value
          }
        }

        if (store.state.company.isCreate) {
          updateCompany(data)
        } else {
          createCompany(data)
        }
      }
    })

    const updateCompany = async (value) => {
      let data = {
        ...value,
        group_revenue_target: {
          ...value.group_revenue_target,
          currency_id: value.currency_id,
          money: Math.floor(value.money)
        },
        period: {
          ...value.period,
          name: value.period_name,
          started_date: form.value.fiscal_year[0],
          finished_date: form.value.fiscal_year[1]
        }
      }

      delete data.currency_id
      delete data.period_name
      delete data.fiscal_year
      delete data.money

      // eslint-disable-next-line no-useless-catch
      try {
        const { updateCompanyInfomation } = useUpdateCompanyInfomationService(tabId.value, data)
        await updateCompanyInfomation()

        //show notification
        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          duration: 5,
          message:
            locale.value === 'en'
              ? t('company_infomation.update_tab') + data.name
              : data.name + t('company_infomation.update_tab')
        })

        checkDatePastFuture.value = false
        checkDateEmpty.value = false
        checkDatePeriod.value = false
        checkImgInuse.value = false
        checkDate.value = false
        checkPeriodConflictColor.value = false

        store.commit('company/STORE_COMPANY_INFOMATION_UPDATE', true)
      } catch (err) {
        checkErrorsApi(err)
        throw err
      }
    }

    const createCompany = async (value) => {
      value.period = {
        finished_date: value.period.finished_date,
        name: value.period.name,
        started_date: value.period.started_date
      }

      value.group_revenue_target = {
        currency_id: value.group_revenue_target.currency_id,
        money: value.group_revenue_target.money
      }

      pick(value.period, keys(value.period))
      pick(value.group_revenue_target, keys(value.group_revenue_target))

      let data = {
        ...value,
        group_revenue_target: {
          ...value.group_revenue_target,
          currency_id: value.currency_id,
          money: value.money
        },
        period: {
          ...value.period,
          name: value.period_name,
          started_date: form.value.fiscal_year[0],
          finished_date: form.value.fiscal_year[1]
        }
      }

      delete data.currency_id
      delete data.period_name
      delete data.fiscal_year
      delete data.money

      // eslint-disable-next-line no-useless-catch
      try {
        const { createCompanyInfomation } = useCreateCompanyInfomationService(data)
        const { result } = await createCompanyInfomation()

        store.commit('company/STORE_COMPANY_INFOMATION_ISCREATED', result.data)

        //show notification
        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          duration: 5,
          message: locale.value === 'en' ? t('company_infomation.create_tab') : t('company_infomation.create_tab')
        })
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
      checkDate.value = false
      checkPeriodConflict.value = false
      checkDatePeriod.value = false
      checkDatePastFuture.value = false
      checkDateEmpty.value = false
      checkPeriodConflictColor.value = false

      forEach(errs, (value, key) => {
        if (key === 'company_seal') {
          checkImgInuse.value = true
        }

        if ((value === 'required' && key === 'finished_date') || (value === 'required' && key === 'started_date')) {
          checkDate.value = true
          checkDateEmpty.value = true
        }

        if (key === 'period_name' && value === 'conflict') {
          checkPeriodConflictColor.value = true
          checkPeriodConflict.value = true
        }

        if (value === 'no_older_than_one_year') {
          checkDatePeriod.value = true
          checkDateEmpty.value = true
        }

        if (
          value === 'started_date_not_more_than_one_year_from_today' ||
          value === 'finished_date_must_be_bigger_or_equal_today'
        ) {
          checkDatePastFuture.value = true
          checkDateEmpty.value = true
        }

        locale.value === 'en' ? (errs[key] = `${companyEnums.value[key]}`) : (errs[key] = `${companyEnums.value[key]}`)

        setFieldError(key, errs[key])
      })
    }

    const handleDeleteRecord = async () => {
      openDelete.value = true
      propsDataDelete.value = {
        id: tabId.value,
        name: form.value.name
      }
    }

    const handleRevertRecord = () => {
      checkDate.value = false
      checkPeriodConflict.value = false
      checkDatePeriod.value = false
      checkDatePastFuture.value = false
      checkDateEmpty.value = false
      checkPeriodConflictColor.value = false

      form.value = {
        ...form.value,
        ...showBtnDel.value
      }

      form.value.period_name = form.value.period.name

      image.value = form.value.company_seal

      form.value.money = form.value.group_revenue_target.money
      form.value.currency_id = form.value.group_revenue_target.currency_id

      form.value.fiscal_year[0] = form.value.period.started_date
      form.value.fiscal_year[1] = form.value.period.finished_date

      dateStart.value = [...split(form.value.period.started_date, '-')]
      dateFinish.value = [...split(form.value.period.finished_date, '-')]
    }

    const replaceField = (text, field) => {
      if (text === 'undefined') return

      if (field === 'period') checkPeriodConflict.value = false

      if (!store.state.company.isCreate) {
        checkImgInuse.value = true
        checkDate.value = true
        checkDateEmpty.value = true
        checkPeriodConflictColor.value = true
      } else {
        checkPeriodEmpty.value = true
        checkDatePeriod.value = false
      }
      return text.replace(field, t(`company_infomation.error_${field}`))
    }

    const changeInput = () => {
      store.state.company.isCreate ? (showBtnCancle.value = true) : (showBtnCancle.value = false)
    }

    const changeSelect = () => {
      store.state.company.isCreate ? (showBtnCancle.value = true) : (showBtnCancle.value = false)
    }

    onMounted(() => {
      fetchCountryList()
      fetchCurrencyList()
      showBtnCancle.value = false
    })

    watch(
      () => store.state.company.isCreate,
      () => {
        if (!store.state.company.isCreate) {
          form.value = {
            ...resetFormData.value,
            fiscal_year: [null, null]
          }
          resetForm()
          checkImgEmpty.value = false
          showBtnDel.value = false
          checkImgInuse.value = false
          checkDate.value = false
          checkDateEmpty.value = false
          checkPeriodConflictColor.value = false
          showTable.value = false
          isClickSubmit.value = false
          showBtnCancle.value = false
          isCreate.value = true
          dateStart.value = []
          dateFinish.value = []
          store.commit('company/STORE_COMPANY_INFOMATION_ISCREATE', false)
        }
      }
    )

    watch(
      () => store.state.company.checkSideBar,
      () => {
        if (store.state.company.checkSideBar) {
          modalLeave.value = true
        }
      }
    )

    watch(
      () => store.state.company.isChangeTab,
      () => {
        if (store.state.company.isChangeTab) {
          showHeader.value = false
        }
      }
    )

    return {
      onSubmit,
      image,
      form,
      modalCrop,
      fileContent,
      imageUpload,
      checkImgEmpty,
      periodList,
      checkImgInuse,
      checkDate,
      checkDateEmpty,
      checkDatePastFuture,
      checkDatePeriod,
      checkPeriodEmpty,
      checkPeriodConflict,
      checkPeriodConflictColor,
      activeKey,
      dateStart,
      dateFinish,
      showBtnDel,
      countryList,
      currencyList,
      showHeader,
      getDataTable,
      openDelete,
      propsDataDelete,
      showTable,
      modalLeave,
      showBtnCancle,
      isCreate,
      changeInput,
      changeSelect,
      handleCollapse,
      replaceField,
      handleCancel,
      onFileImg,
      onChangeDate,
      handleBack,
      onFileChange,
      resetUploadImage,
      handleClickSubmit,
      handleDeleteRecord,
      handleRevertRecord
    }
  }
})
</script>

<style scoped lang="scss">
.form-create {
  .line-4 {
    display: flex;

    &__left {
      margin-right: 20px;
    }

    &__right {
      input {
        width: 163px;
      }
    }
  }

  .line-8 {
    display: flex;
    align-items: flex-end;

    &__left {
      margin-right: 24px;

      .form-select {
        margin-top: 5px;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      height: 32px;
      margin-bottom: 1px;

      p {
        margin-bottom: 0;
        color: #8c8c8c;
        margin-right: 12px;

        span {
          color: #262626;
        }
      }

      .label-period {
        margin-right: 6px;
        color: #262626;
      }

      .form-group {
        margin-bottom: 0;
      }

      .form-input {
        display: flex;
        align-items: center;
        margin-top: 0 !important;

        input {
          height: 32px;
          width: 49px;
          padding: 3px 1px;
          text-align: center;
        }

        p {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 2px;
          color: #262626;
        }
      }
    }
  }

  .form-label-line10 {
    span {
      color: #cd201f;
      margin-left: 6px;
    }
  }

  .line-10 {
    margin-bottom: 0;
  }

  .show-table {
    display: flex;
    justify-content: flex-end;
    border: 1px solid #d9d9d9;
    max-width: 750px;
    align-items: center;
    height: 32px;
    padding-right: 18px;
    border-radius: 0 0 2px 2px;
    background-color: #ffffff;
    cursor: pointer;

    p {
      margin: 0 10px 0 0;
      padding: 5px 0;
    }

    .transition-top {
      transition: 0.3s;
      transform: rotate(-90deg);
    }

    .transition-bottom {
      transition: 0.3s;
      transform: rotate(90deg);
    }
  }

  .ant-table-wrapper {
    max-width: 750px;
  }

  .card-footer {
    .btn-delete-danger {
      color: #ff4d4f;
      border-color: #ff4d4f;
      text-shadow: none;
      box-shadow: none;

      &:hover {
        background-color: #ff4d4f;
        color: #ffffff;
      }
    }
  }

  .sales-group {
    display: flex;
    background-color: #ffffff;
    border: 1px solid #d9d9d9;
    padding: 16px 16px 16px 32px;
    margin-top: 5px;

    p {
      flex: 1;
      margin: 7px 0;
      font-size: 12px;
      line-height: 18px;
    }

    .form-input {
      margin-top: 0 !important;

      input {
        text-align: end;
      }
    }

    .form-select {
      width: 85px;
    }
  }

  .container {
    padding: 0;
    margin: 0;

    .form-label-line8 {
      span {
        color: #cd201f;
        margin-left: 6px;
      }
    }

    .errors {
      color: #ff4d4f;
    }

    .avatar-upload {
      position: relative;
      max-width: 130px;
      margin-top: 5px;

      .avatar-edit {
        position: absolute;
        right: 0;
        z-index: 1;
        top: 65px;
        height: 34px;

        input {
          display: none;

          + label {
            display: inline-block;
            width: 34px;
            height: 34px;
            margin-bottom: 0;
            border-radius: 100%;
            background: #ffffff;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
            cursor: pointer;
            font-weight: normal;
            transition: all 0.2s ease-in-out;
            background-image: url('../../../assets/icons/ico_addimg.png');
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            transform: scaleX(-1);
            border: 1px solid #064780;

            &:hover {
              background: #31aaf1;
              border: 1px solid #31aaf1;
              background-image: url('../../../assets/icons/ico_addimg.png');
              background-position: center;
              background-repeat: no-repeat;
              background-size: cover;
              transform: scaleX(-1);
            }
          }
        }
      }

      .avatar-preview {
        width: 100px;
        height: 100px;
        position: relative;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        background-color: #bfbfbf;
        margin-bottom: 20px;

        #imagePreview {
          width: 50%;
          height: 50%;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          background-image: url('../../../assets/icons/ico_user.png');
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }

        #imagePreview-avatar {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          background-image: url('../../../assets/icons/ico_user.png');
        }
      }
    }

    .avatar-upload-empty {
      position: relative;
      max-width: 186px;
      height: 28px;
      margin-top: 5px;

      .avatar-edit-empty {
        height: 100%;
        cursor: pointer;

        input {
          display: none;

          + label {
            display: inline-block;
            width: 100%;
            height: 28px;
            margin-bottom: 0;
            border: 1px solid #064780;
            border-radius: 2px;
            position: relative;

            .image-upload {
              position: absolute;
              display: flex;
              width: 100%;
              height: 100%;
              cursor: pointer;

              img {
                width: 24px;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                margin: auto 6px;
                transform: scaleX(-1);
                color: #064780;
              }

              p {
                margin-bottom: 0;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                margin: auto;
                margin: auto 6px;
                color: #064780;
                font-size: 14px;
                line-height: 22px;
              }
            }
          }
        }
      }

      .avatar-preview {
        width: 100px;
        height: 100px;
        position: relative;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        background-color: #bfbfbf;
        margin-bottom: 20px;

        #imagePreview {
          width: 50%;
          height: 50%;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          background-image: url('../../../assets/icons/ico_user.png');
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }

        #imagePreview-avatar {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          background-image: url('../../../assets/icons/ico_user.png');
        }
      }
    }
  }

  .upload {
    position: relative;
    margin: 0;

    .overlay-loading {
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 999;
      background: rgba(255, 255, 255, 0.5);

      .ant-spin {
        .ant-spin-dot {
          font-size: 24px;
        }
      }

      .spin-loading {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>

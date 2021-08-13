<template>
  <div class="card-common">
    <!-- Form -->
    <form @submit="onSubmit">
      <!-- ID username-->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.username" name="login_id" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('account.login_id') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                :maxlength="20"
                class="w-300"
                :disabled="isDisableEditField"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="login_id" class="errors">
                {{ replaceField(message, 'login_id') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- Full name -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.fullname" name="full_name" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('account.full_name') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="full_name" class="errors">
                {{ replaceField(message, 'full_name') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- Password -->
      <div v-if="isHiddenField" class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.password" name="password" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('account.password') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                :disabled="isDisableEditField"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="password" class="errors">
                {{ replaceField(message, 'password') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
        <div class="u-ml-16 u-mt-12">
          <a-checkbox v-model:checked="autoGeneratePassW">パスワードを自動生成する</a-checkbox>
        </div>
      </div>

      <!-- Status -->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('account.status') }}</label>

          <div class="form-input">
            <a-radio-group v-model:value="form.active">
              <a-radio v-for="item in ACTIVE" :key="item.id" :value="item.id">{{
                $t(`account.${item.value}`)
              }}</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>

      <!-- Type -->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('account.sales') }}</label>

          <div class="form-input">
            <a-checkbox-group v-model:value="form.types">
              <a-checkbox v-for="item in TYPE" :key="item.id" :value="item.id">
                {{ $t(`account.${item.value}`) }}
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>
      </div>

      <!-- Memo -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.memo" :name="$t('account.memo')">
          <div class="form-content">
            <label class="form-label">{{ $t('account.memo') }}</label>
            <div class="form-input">
              <a-textarea
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                :style="{ width: '300px', height: '160px' }"
                @change="handleChange"
              />
            </div>
          </div>
        </Field>
      </div>

      <!-- Permission Group-->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('account.group_permissions') }}</label>

          <PermissionTable
            v-model:group-list-allowed-access="groupListAllowedAccess"
            :group-permissions="form.groupPermissions"
            :is-group-permission="true"
            :group-list="groupList"
            :templates-permission="templatesPermission"
            @handle-change-permission="handleChangePermission"
            @handle-template-list="handleTemplateList($event)"
            @delete-permission-template="deletePermissionTemplate($event)"
          />
        </div>
      </div>

      <!-- Permission Setting-->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('account.setting_permissions') }}</label>

          <PermissionTable
            v-model:group-list-allowed-access="groupListAllowedAccess"
            :group-permissions="form.groupPermissions"
            :is-group-permission="false"
            :group-list="groupList"
            :templates-permission="templatesPermission"
            @handle-change-permission="handleChangePermission"
            @handle-template-list="handleTemplateList($event)"
            @delete-permission-template="deletePermissionTemplate($event)"
          />
        </div>
      </div>

      <!-- Action Section Submit & Cancel -->
      <div class="card-footer">
        <a-button key="back" class="btn-cancel" @click="handleCancel">
          {{ $t('common.cancel') }}
        </a-button>
        <a-button key="submit" type="primary" html-type="submit" class="btn-submit">
          {{ $route.name === 'account-edit' ? $t('common.edit') : $t('common.new') }}
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
import { useStore } from 'vuex'
import { findIndex, cloneDeep, find } from 'lodash-es'

import { TYPE, ACTIVE } from '@/enums/account.enum'
import { PAGE_PERMISSIONS } from '@/enums/account.enum'

import useUpdateAccountService from '@/views/SettingAccount/composables/useUpdateAccountService'
import useCreateAccountService from '@/views/SettingAccount/composables/useCreateAccountService'
import { getGroups } from '../composables/useGroupService'
import { getPermissionTemplate } from '../composables/usePermissionService'
import PermissionTable from './PermissionTable'

export default defineComponent({
  name: 'AccountForm',

  components: {
    PermissionTable
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const { handleSubmit, setFieldError } = useForm()
    const { t, locale } = useI18n()

    const isHiddenField = ref(false)
    const isDisableEditField = ref(false)

    const autoGeneratePassW = ref(false)

    const groupList = ref([])
    const groupListAllowedAccess = ref([])

    const templatesPermission = ref()

    let form = ref({
      accountGroupId: 1,
      username: '',
      password: '',
      email: '',
      fullname: '',
      types: [],
      memo: '',
      active: true,
      isAdmin: false,
      groupPermissions: []
    })

    const createPermissionDefault = () => {
      const groupPermissionsDefault = []
      const permissionGroup = PAGE_PERMISSIONS.filter((page) => page.isGroupPermission).map((page) => ({
        featureKey: page.value,
        permissionKey: null
      }))
      const permissionSetting = PAGE_PERMISSIONS.filter((page) => !page.isGroupPermission).map((page) => ({
        featureKey: page.value,
        permissionKey: null
      }))

      // template type: 1
      groupList.value.forEach((group) => {
        groupPermissionsDefault.push({
          id: group.id,
          groupId: group.id,
          permissions: cloneDeep(permissionGroup),
          templateName: '',
          templateId: null,
          displayTemplateType: 1
        })
      })

      // template type: 2
      groupPermissionsDefault.push({
        id: 0,
        groupId: null,
        permissions: cloneDeep(permissionSetting),
        templateName: '',
        templateId: null,
        displayTemplateType: 2
      })

      return groupPermissionsDefault
    }

    const mergeGroupPermission = (objValue, srcValue) => {
      const groupPermissionMerged = [...objValue]

      srcValue.forEach((group) => {
        const groupIndexFound = findIndex(groupPermissionMerged, { groupId: group.groupId })

        if (groupIndexFound === -1) {
          groupPermissionMerged.push(group)
        } else {
          const permissions = [...(groupPermissionMerged[groupIndexFound]?.permissions || [])]

          ;(group?.permissions || []).forEach((page) => {
            const pageIndexFound = findIndex(permissions, { featureKey: page.featureKey })
            if (pageIndexFound === -1) permissions.push(page)
          })

          groupPermissionMerged[groupIndexFound].permissions = permissions
        }

        return group
      })

      return groupPermissionMerged
    }

    onMounted(async () => {
      // template permissions
      const templateRes = await getPermissionTemplate()
      templatesPermission.value = templateRes.data.result.data

      // fetch group
      const groupReponse = await getGroups()
      groupList.value = groupReponse?.result?.data || []

      // permission list
      const groupPermissionsDefault = createPermissionDefault()
      const groupPermissionsRequested = route.meta['detail']?.groupPermissions || []
      const groupPermissionsMerged = mergeGroupPermission(groupPermissionsRequested, groupPermissionsDefault)

      if ('id' in route.params && route.name === 'account-edit') {
        isDisableEditField.value = true
        form.value = { ...form.value, ...route.meta['detail'], groupPermissions: groupPermissionsMerged }
      } else {
        isHiddenField.value = true
        form.value = { ...form.value, groupPermissions: groupPermissionsDefault }
      }
    })

    watch(autoGeneratePassW, (value) => {
      value ? (form.value.password = Math.random().toString(36).slice(-8)) : (form.value.password = '')
    })

    const handleCancel = () => {
      router.push({ name: 'account', params: route.params, query: route.query })
    }

    const onSubmit = handleSubmit(() => {
      let data = { ...form.value }
      delete data.id

      // check group permission
      const groupPermissions = data.groupPermissions
        .filter((group) => {
          const groupAllowedFound = find(groupListAllowedAccess.value, { id: group.id })
          const isGroupAllowAccess = groupAllowedFound && groupAllowedFound.isAllow

          const isPermisionEmpty = group.permissions.every((page) => page.permissionKey === null)
          const isTempalteEmpty = group.templateId
          const isGroupAllow = isGroupAllowAccess && !(isPermisionEmpty && isTempalteEmpty)

          return isGroupAllow
        })
        .map((group) => {
          const groupAllowedFound = find(groupListAllowedAccess.value, { id: group.id })
          const isGroupAllowAccess = groupAllowedFound && groupAllowedFound.isAllow
          const isPermisionNotEmpty = group.permissions.some((page) => page.permissionKey !== null)
          const isTemplatePermission = group?.templateId || null

          const permissions =
            !isTemplatePermission && isGroupAllowAccess && isPermisionNotEmpty
              ? group.permissions.filter((page) => page.permissionKey !== null)
              : null

          const groupModified = {
            ...group,
            permissions
          }

          // remove fields
          delete groupModified.id
          delete groupModified.templateName

          return groupModified
        })

      data.groupPermissions = groupPermissions

      if (route.name === 'account-edit') {
        updateAccount(data)
      } else {
        createAccount(data)
      }
    })

    const updateAccount = async (data) => {
      const id = route.params.id
      // eslint-disable-next-line no-useless-catch
      try {
        const { updateAccount } = useUpdateAccountService(id, data)
        await updateAccount()
        //show notification
        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'success',
          duration: 5,
          message: locale.value === 'en' ? data.username + 'updated success' : data.username + ' が更新されました'
        })
        await router.push({ name: 'account', query: route.query }).catch((err) => err)
      } catch (err) {
        throw err
      }
    }

    const createAccount = async (data) => {
      // eslint-disable-next-line no-useless-catch
      try {
        console.log('create', data)
        const { createAccount } = useCreateAccountService(data)
        await createAccount()
        //show notification
        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'success',
          duration: 5,
          message:
            locale.value === 'en' ? data.username + 'created account success' : data.username + ' が追加されました'
        })
        await router.push({ name: 'account', query: route.query })
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
      return text.replace(field, t(`account.${field}`))
    }

    const handleChangePermission = ({
      groupPermissionId,
      featureKey,
      value,
      templateName = '',
      templateId = null,
      permissions = null,
      IS_CHANGE_TEMPLATE
    }) => {
      const groupIndex = findIndex(form.value.groupPermissions, { id: groupPermissionId })
      if (groupIndex === -1) return

      const formNew = cloneDeep(form.value)
      if (IS_CHANGE_TEMPLATE) {
        formNew.groupPermissions[groupIndex].permissions = permissions
        formNew.groupPermissions[groupIndex].templateName = templateName
        formNew.groupPermissions[groupIndex].templateId = templateId
      } else {
        const permissionIndex = findIndex(form.value.groupPermissions[groupIndex].permissions, {
          featureKey: featureKey
        })
        if (permissionIndex === -1) return

        formNew.groupPermissions[groupIndex].permissions[permissionIndex].permissionKey = value
        formNew.groupPermissions[groupIndex].templateName = ''
        formNew.groupPermissions[groupIndex].templateId = null
      }

      form.value = formNew
    }

    const handleTemplateList = (template) => {
      templatesPermission.value.push(template)
    }

    const deletePermissionTemplate = (templateId) => {
      templatesPermission.value = templatesPermission.value.filter((item) => item.id !== templateId)
    }

    return {
      form,
      TYPE,
      ACTIVE,
      isHiddenField,
      isDisableEditField,
      autoGeneratePassW,
      groupList,
      templatesPermission,
      groupListAllowedAccess,

      onSubmit,
      handleCancel,
      updateAccount,
      createAccount,
      replaceField,
      handleChangePermission,
      handleTemplateList,
      deletePermissionTemplate
    }
  }
})
</script>

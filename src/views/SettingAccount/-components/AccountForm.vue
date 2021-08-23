<template>
  <div class="card-common">
    <!-- Form -->
    <form @submit="onSubmit">
      <!-- Full name -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange, errorMessage }" v-model="form.fullname" name="full_name" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('account.full_name') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                :class="['w-300', { 'has-error': !!errorMessage }]"
                @change="handleChange"
                :disabled="isDisableEditField"
              />
              <!-- Error message -->
              <ErrorMessage as="span" name="full_name" class="errors">
                {{ $t('account.full_name_error') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- ID email -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange, errorMessage }" v-model="form.username" name="email" rules="input_required|email">
          <div class="form-content">
            <label class="form-label required">{{ $t('account.email') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                :maxlength="50"
                :class="['w-300', { 'has-error': !!errorMessage }]"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="email" class="errors">
                {{ replaceField(message, 'email') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
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
        <Field v-model="isMissingPermission" name="permission" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('account.group_permissions') }}</label>

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
          <ErrorMessage as="span" name="permission" class="errors"> グループを選択してください </ErrorMessage>
        </Field>
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
import { defineComponent, ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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

    const groupList = ref([])
    const groupListAllowedAccess = ref([])

    const templatesPermission = ref()

    let form = ref({
      accountGroupId: 1,
      username: '',
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

    const updateGroupPermissionsDefault = (groupPermissionsDefault, groupPermissionsRequested) => {
      const groupPermissionsModify = cloneDeep(groupPermissionsDefault)
      let listAllowedAccess = []

      groupPermissionsRequested.forEach((group) => {
        const groupIndexFound = findIndex(groupPermissionsModify, { groupId: group.groupId })

        if (groupIndexFound === -1) {
          groupPermissionsModify.push(group)
        } else {
          // update permissions
          const permissions = cloneDeep(groupPermissionsModify[groupIndexFound]?.permissions || [])
          let permissionsRequested = group?.permissions || []
          let isAllow = false

          permissionsRequested.forEach((page) => {
            const pageIndexFound = findIndex(permissions, { featureKey: page.featureKey })
            if (pageIndexFound !== -1) {
              const permissionKey = page?.permissionKey || null
              groupPermissionsModify[groupIndexFound].permissions[pageIndexFound].permissionKey = permissionKey

              if (!!permissionKey && !isAllow) isAllow = true
            }
          })

          // update templates
          groupPermissionsModify[groupIndexFound].templateId = group.templateId
          groupPermissionsModify[groupIndexFound].templateName = group.templateName

          // update Group List Allowed Access
          listAllowedAccess.push({
            id: groupPermissionsModify[groupIndexFound].id,
            isAllow: isAllow
          })
        }

        return group
      })

      groupListAllowedAccess.value = listAllowedAccess

      return groupPermissionsModify
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

      if ('id' in route.params && route.name === 'account-edit') {
        isDisableEditField.value = true

        const groupPermissionsRequested = route.meta['detail']?.groupPermissions || []
        const groupPermissionsModify = updateGroupPermissionsDefault(groupPermissionsDefault, groupPermissionsRequested)

        form.value = { ...form.value, ...route.meta['detail'], groupPermissions: groupPermissionsModify }
      } else {
        isHiddenField.value = true
        form.value = { ...form.value, groupPermissions: groupPermissionsDefault }
      }
    })

    const handleCancel = () => {
      router.push({ name: 'account', params: route.params, query: route.query })
    }

    const valueSubmit = computed(() => {
      let data = { ...form.value }

      // check group permission
      const groupPermissions = data.groupPermissions
        .filter((group) => {
          // check group checked and not empty
          const groupAllowedFound = find(groupListAllowedAccess.value, { id: group.id })
          const isGroupAllowAccess = groupAllowedFound && groupAllowedFound.isAllow
          const isPermisionNotEmpty = !group.permissions.every((page) => page.permissionKey === null)
          const isGroupAllow = (isGroupAllowAccess && isPermisionNotEmpty) || false

          return isGroupAllow
        })
        .map((group) => {
          let groupModified = cloneDeep(group)

          // remove permissionKey null
          const permission = group?.permissions || []
          groupModified.permissions = permission.filter((page) => page.permissionKey !== null)

          // remove fields
          delete groupModified.id
          delete groupModified.templateName

          return groupModified
        })

      data.groupPermissions = groupPermissions
      delete data.id

      return data
    })

    const isMissingPermission = computed(() => {
      return valueSubmit.value.groupPermissions.filter((item) => item.displayTemplateType === 1).length > 0
    })

    const onSubmit = handleSubmit(() => {
      if (route.name === 'account-edit') {
        updateAccount(valueSubmit.value)
      } else {
        createAccount(valueSubmit.value)
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

      const formNew = cloneDeep(form.value)
      if (IS_CHANGE_TEMPLATE) {
        const groupTemplateType2 = findIndex(form.value.groupPermissions, { displayTemplateType: 2 })
        const index = groupIndex < 0 ? groupTemplateType2 : groupIndex

        formNew.groupPermissions[index].permissions = permissions
        formNew.groupPermissions[index].templateName = templateName
        formNew.groupPermissions[index].templateId = templateId
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
      const formNew = cloneDeep(form.value)
      templatesPermission.value.push(template)

      const { groupId, permissions, id, templateName } = template

      // eslint-disable-next-line no-extra-boolean-cast
      const idPermission = !!groupId ? groupId : 0
      const groupIndex = findIndex(form.value.groupPermissions, { id: idPermission })

      formNew.groupPermissions[groupIndex].permissions = permissions
      formNew.groupPermissions[groupIndex].templateName = templateName
      formNew.groupPermissions[groupIndex].templateId = id

      form.value = formNew
    }

    const deletePermissionTemplate = (templateId) => {
      const formNew = cloneDeep(form.value)
      templatesPermission.value = templatesPermission.value.filter((item) => item.id !== templateId)

      const groupIndex = findIndex(form.value.groupPermissions, { templateId: templateId })
      if (groupIndex < 0) return

      formNew.groupPermissions[groupIndex].permissions = formNew.groupPermissions[groupIndex].permissions.map(
        (item) => ({ featureKey: item.featureKey, permissionKey: null })
      )
      formNew.groupPermissions[groupIndex].templateName = ''
      formNew.groupPermissions[groupIndex].templateId = null

      form.value = formNew
    }

    const replaceField = (text, field) => {
      return text.replace(field, t(`account.${field}`))
    }

    return {
      form,
      TYPE,
      ACTIVE,
      isHiddenField,
      isDisableEditField,
      groupList,
      templatesPermission,
      groupListAllowedAccess,
      isMissingPermission,

      onSubmit,
      handleCancel,
      updateAccount,
      createAccount,
      handleChangePermission,
      handleTemplateList,
      deletePermissionTemplate,
      replaceField
    }
  }
})
</script>

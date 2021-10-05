<template>
  <div class="setting-account-form">
    <!--    Modal Account-->
    <modal-setting-acount
      v-model:visible="isShowModalActivate"
      :show-modal-activate="isShowModalActivate"
      :is-checked-radio="isCheckedRadio"
      :is-activate="isActivate"
      :is-pending="isPending"
      @is-checked="form.active = $event"
    />

    <a-modal v-model:visible="isSubmit" class="modal-account-success-confirm" :closable="false">
      <template #footer>
        <div class="group-text">
          <p>{{ $t('modal.text_line1') }}</p>
          <p>{{ $t('modal.text_line2') }}</p>
        </div>
        <a-button key="submit" type="primary" html-type="submit" @click="handleConfirm">
          {{ $t('modal.handle_account_success') }}
        </a-button>
      </template>
    </a-modal>

    <!-- Form -->
    <form @submit="onSubmit">
      <!-- Full name -->
      <div>
        <Field v-slot="{ field, handleChange, errorMessage }" v-model="form.fullname" name="full_name" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('account.full_name') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                :class="['w-300', { 'has-error': !!errorMessage }]"
                :disabled="isDisableEditField"
                @change="handleChange"
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
      <div class="u-mt-16">
        <Field
          v-slot="{ field, handleChange, errorMessage }"
          v-model="form.username"
          name="email"
          rules="input_required|email"
        >
          <div class="form-content">
            <label class="form-label required">{{ $t('account.email') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                :maxlength="50"
                :disabled="isDisableEditField"
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
      <div class="u-mt-16">
        <div class="form-content">
          <label class="form-label">{{ $t('account.status') }}</label>

          <div class="form-input">
            <a-radio-group v-model:value="form.active" @change="handleChange">
              <a-radio v-for="item in ACTIVE" :key="item.id" :value="item.id">
                <template v-if="valueSubmit.status === 'pending_verification' && item.id">
                  {{ $t(`account.pending_active`) }}
                </template>
                <template v-else>{{ $t(`account.${item.value}`) }}</template>
              </a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>

      <!-- Type -->
      <div class="u-mt-16">
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

      <!-- Role user -->
      <div class="u-mt-16">
        <div class="form-content">
          <label class="form-label">ユーザータイプ </label>

          <div class="form-input">
            <a-radio-group v-model:value="form.role">
              <a-radio v-for="role in ROLE_LIST" :key="role.id" :value="role.value">{{ role.label }}</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>

      <!-- Memo -->
      <div class="u-mt-16">
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
      <div class="u-mt-16">
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
      <div class="u-mt-16">
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
      <div class="u-mt-16">
        <a-button key="back" class="btn-cancel" @click="handleCancel">
          {{ $t('common.cancel') }}
        </a-button>
        <a-button key="submit" type="primary" html-type="submit" class="btn-submit u-ml-12">
          {{ isEditPage ? $t('common.edit') : $t('common.new') }}
        </a-button>
      </div>
    </form>

    <NoticeRoleUserModal
      v-if="isEditPage && isVisibleNoticeRoleUserModal"
      v-model:visible="isVisibleNoticeRoleUserModal"
      @on-submit-notice-modal="updateAccount(valueSubmit)"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
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
import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'
import ModalSettingAcount from '@/components/ModalSettingAcount'
import NoticeRoleUserModal from './NoticeRoleUserModal.vue'

export default defineComponent({
  name: 'AccountForm',

  components: {
    ModalSettingAcount,
    PermissionTable,
    NoticeRoleUserModal
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const { handleSubmit, setFieldError } = useForm()
    const { t, locale } = useI18n()

    const isHiddenField = ref(false)
    const isDisableEditField = ref(false)
    const isShowModalActivate = ref(false)
    const isCheckedRadio = ref(false)
    const isActivate = ref(false)
    const isPending = ref(false)
    const isSubmit = ref(false)

    const groupList = ref([])
    const groupListAllowedAccess = ref([])
    const getDataSubmit = ref({})

    const templatesPermission = ref()
    const currentRole = ref()

    let form = ref({
      accountGroupId: 1,
      username: '',
      email: '',
      fullname: '',
      types: [],
      memo: '',
      active: true,
      isAdmin: false,
      role: null,
      groupPermissions: []
    })

    const tmpErrors = ref()

    const ROLE_LIST = [
      {
        id: 1,
        value: 'USER',
        label: 'ユーザー'
      },
      {
        id: 2,
        value: 'ADMIN',
        label: 'アドミン'
      }
    ]

    const isVisibleNoticeRoleUserModal = ref()

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

    const isEditPage = computed(() => route.name === 'account-edit')

    onMounted(async () => {
      // template permissions
      const templateRes = await getPermissionTemplate()
      templatesPermission.value = templateRes.data.result.data

      // fetch group
      const groupReponse = await getGroups({ allGroup: true })
      groupList.value = groupReponse?.result?.data || []

      // permission list
      const groupPermissionsDefault = createPermissionDefault()

      if ('id' in route.params && isEditPage.value) {
        isDisableEditField.value = true

        // group permissions
        const groupPermissionsRequested = route.meta['detail']?.groupPermissions || []
        const groupPermissionsModify = updateGroupPermissionsDefault(groupPermissionsDefault, groupPermissionsRequested)

        // role
        const role = route.meta['detail']?.isAdmin || false ? ROLE_LIST[1].value : ROLE_LIST[0].value
        currentRole.value = role

        form.value = { ...form.value, ...route.meta['detail'], role, groupPermissions: groupPermissionsModify }
      } else {
        isHiddenField.value = true
        const role = ROLE_LIST[0].value
        form.value = { ...form.value, role, groupPermissions: groupPermissionsDefault }
      }
    })

    watch(
      () => locale.value,
      () => {
        verifyErrors(tmpErrors.value, t('account.content'))
      }
    )

    const handleCancel = () => {
      router.push({ name: 'account', params: route.params, query: route.query })
    }

    const handleClosePopupSuccess = () => {
      isSubmit.value = false
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
      data.isAdmin = data.role === ROLE_LIST[1].value

      delete data.id
      delete data.role

      return data
    })

    const isMissingPermission = computed(() => {
      return valueSubmit.value.groupPermissions.filter((item) => item.displayTemplateType === 1).length > 0
    })

    const onSubmit = handleSubmit(() => {
      if (isEditPage.value) {
        if (form.value.role !== currentRole.value) {
          isVisibleNoticeRoleUserModal.value = true
        } else {
          updateAccount(valueSubmit.value)
        }
      } else {
        createAccount(valueSubmit.value)
      }
    })

    const notifiySuccess = (val) => {
      //show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'successfully',
        duration: 5,
        message: locale.value === 'en' ? t(val) : t(val)
      })
    }

    const updateAccount = async (data) => {
      const id = route.params.id
      // eslint-disable-next-line no-useless-catch
      try {
        const { updateAccount } = useUpdateAccountService(id, data)
        const { result } = await updateAccount()

        if (result.data.action === 'cancle confirming') {
          notifiySuccess('account.status_cancle_status')
        } else if (result.data.action === 'change deactive to active') {
          notifiySuccess('account.status_change_deactive_to_active')
        } else if (result.data.action === 'change active to deactive') {
          notifiySuccess('account.status_change_active_to_deactive')
        } else {
          //show notification
          store.commit('flash/STORE_FLASH_MESSAGE', {
            variant: 'successfully',
            duration: 5,
            message: locale.value === 'en' ? data.username + 'updated success' : data.username + ' が更新されました'
          })
        }

        await router.push({ name: 'account', query: route.query }).catch((err) => err)
      } catch (err) {
        throw err
      }
    }

    const handleConfirm = async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const { createAccount } = useCreateAccountService(getDataSubmit.value)
        await createAccount()
        //show notification
        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          duration: 5,
          message:
            locale.value === 'en'
              ? getDataSubmit.value.username + 'created account success'
              : getDataSubmit.value.username + ' が追加されました'
        })
        await router.push({ name: 'account', query: route.query })
      } catch (err) {
        isSubmit.value = false
        checkErrorsApi(err)
        throw err
      }
    }

    const checkErrorsApi = (err) => {
      tmpErrors.value = camelToSnakeCase(err.response.data.errors)

      verifyErrors(tmpErrors.value, t('account.content'))
    }

    const createAccount = async (data) => {
      isSubmit.value = true
      getDataSubmit.value = data
    }

    const verifyErrors = (errors, msg) => {
      for (let item in errors) {
        setFieldError(item, msg)
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

    const handleChange = (evt) => {
      form.value.active = evt.target.value
      if (valueSubmit.value.active && valueSubmit.value.status === 'deactive') {
        isShowModalActivate.value = true
        isCheckedRadio.value = true
      }
      if (!valueSubmit.value.active && valueSubmit.value.status === 'activate') {
        isShowModalActivate.value = true
        isActivate.value = true
      }
      if (!valueSubmit.value.active && valueSubmit.value.status === 'pending_verification') {
        isShowModalActivate.value = true
        isPending.value = true
      }
    }

    const replaceField = (text, field) => {
      return text.replace(field, t(`account.${field}`))
    }

    return {
      form,
      TYPE,
      ACTIVE,
      groupList,
      templatesPermission,
      groupListAllowedAccess,
      valueSubmit,
      ROLE_LIST,
      isVisibleNoticeRoleUserModal,
      isEditPage,

      isHiddenField,
      isDisableEditField,
      isMissingPermission,
      isShowModalActivate,
      isCheckedRadio,
      isActivate,
      isPending,
      isSubmit,

      onSubmit,
      handleClosePopupSuccess,
      handleConfirm,
      handleChange,
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

<style lang="scss" scoped>
.setting-account-form {
  padding: 24px 32px;
  overflow-y: scroll;
  height: 100%;
}
</style>

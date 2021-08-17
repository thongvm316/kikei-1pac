<template>
  <div class="permission-table">
    <!-- table level 1 -->
    <table>
      <tbody>
        <template v-for="group in dataTablePermission" :key="group.id" :bordered="false">
          <tr :class="['permission-table__header', activeKeyCollapse.indexOf(`${group.id}`) !== -1 && 'is-active']">
            <td>{{ group.groupName }}</td>
            <td>
              <a-checkbox
                :checked="activeKeyCollapse.indexOf(`${group.id}`) !== -1"
                @change="handleToggleCollapse(group.id)"
              >
                アクセスを許可する
              </a-checkbox>
            </td>

            <!-- template -->
            <td>
              <div v-show="activeKeyCollapse.indexOf(`${group.id}`) !== -1">
                <a-dropdown :trigger="['click']" overlay-class-name="permission-template">
                  <a class="ant-dropdown-link" @click.prevent>
                    <span class="u-flex u-justify-end u-items-center text-grey-55">
                      {{ group.templateName ? `${group.templateName.length > 10 ? group.templateName.slice(0, 10) + '...' : group.templateName}` : 'テンプレートから選択' }}
                      <ArrowDownIcon class="u-ml-6" />
                    </span>
                  </a>
                  <template #overlay>
                    <div class="permission-template__body">
                      <template v-if="templatePermission.filter(item => (!item.groupId || item.groupId === group.id)).length > 0">
                        <div v-for="template in templatePermission" :key="template.id" class="permission-template__item">
                          <template v-if="!template.groupId || template.groupId === group.id">
                            <p
                              @click="
                                chooseTemplatePermission(
                                  template.groupId,
                                  template.permissions,
                                  template.templateName,
                                  template.id
                                )
                              "
                            >
                              {{ template.templateName }}
                            </p>
                            <a-button
                              class="btn-delete u-text-12"
                              type="link"
                              danger
                              @click="deleteTemplatePermission(template.id)"
                            >
                              <template #icon>
                                <span class="btn-icon" :style="{ height: '18px' }"><delete-icon /></span>
                              </template>
                              削除
                            </a-button>
                          </template>
                        </div>
                      </template>

                      <span v-else>該当テンプレートが見つかりませんでした。</span>
                    </div>
                  </template>
                </a-dropdown>
              </div>
            </td>
          </tr>

          <!-- collaplse body -->
          <tr :class="activeKeyCollapse.indexOf(`${group.id}`) === -1 ? 'd-hidden' : ''">
            <td colspan="3">
              <a-collapse v-model:activeKey="activeKeyCollapse" :bordered="false" class="permission-table__collapse">
                <a-collapse-panel :key="`${group.id}`">
                  <table class="has-border">
                    <thead>
                      <tr>
                        <th></th>
                        <th v-for="permissionKey in PERMISSION_KEYS" :key="permissionKey.id">
                          {{ $t(permissionKey.text) }}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="page in group.permissions" :key="page.featureKey">
                        <td>{{ page.name }}</td>
                        <td v-for="permissionKey in PERMISSION_KEYS" :key="permissionKey.id">
                          <a-radio
                            :checked="permissionKey.value === page.permissionKey"
                            :value="permissionKey.value"
                            @change="handleChangePermission(group.id, page.featureKey, permissionKey.value)"
                          ></a-radio>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div class="u-flex u-justify-end u-mt-12">
                    <a-button
                      :disabled="!!group.templateName"
                      size="small"
                      type="link"
                      class="btn-save"
                      @click="openModalSaveTemplatePermission(group.id)"
                    >
                      <template #icon>
                        <span class="btn-icon"><save-icon /></span>
                      </template>
                      テンプレートを保存する
                    </a-button>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <confirm-create-template-permission
    v-model:visible="isVisibleCreateTemplateModal"
    @handle-save-template="handleSaveTemplate($event)"
    @clear-template-tmp="clearTemplateTmp"
  />
</template>

<script>
import { defineComponent, ref, computed, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { find, parseInt, findIndex, cloneDeep } from 'lodash-es'

import { PAGE_PERMISSIONS, PERMISSION_KEYS } from '@/enums/account.enum'

import SaveIcon from '@/assets/icons/ico_save.svg'
import ArrowDownIcon from '@/assets/icons/ico_arrow_down.svg'
import DeleteIcon from '@/assets/icons/ico_delete.svg'

import ConfirmCreateTemplatePermission from './ConfirmCreateTemplatePermission.vue'
import { createPermissionTemplate, deletePermissionTemplate } from '../composables/usePermissionService'

export default defineComponent({
  name: 'PermissionTable',

  components: {
    SaveIcon,
    ArrowDownIcon,
    DeleteIcon,
    ConfirmCreateTemplatePermission
  },

  props: {
    groupPermissions: {
      validator: (value) => ['object', 'undefined'].indexOf(typeof value) !== -1,
      required: true
    },
    isGroupPermission: Boolean,
    groupList: Array,
    templatesPermission: Array,
    groupListAllowedAccess: Array
  },

  emits: ['handleChangePermission', 'handleTemplateList', 'deletePermissionTemplate', 'update:groupListAllowedAccess'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const checked = ref(10)
    const checkedBox = ref()
    const isVisibleCreateTemplateModal = ref()
    const newTemplate = ref()
    const {
      templatesPermission,
      groupPermissions,
      isGroupPermission,
      groupList,
      groupListAllowedAccess = []
    } = toRefs(props)

    const activeKeyCollapse = computed(() => {
      return groupListAllowedAccess.value.filter((group) => group.isAllow).map((group) => `${group.id}`)
    })

    const displayTemplateType = computed(() => {
      return isGroupPermission.value ? 1 : 2
    })

    const dataTablePermission = computed(() => {
      const rows = (groupPermissions.value || [])
        .filter((groupPermission) => parseInt(groupPermission.displayTemplateType) === displayTemplateType.value)
        .map((groupPermission) => {
          // get permissions
          let permissions = groupPermission?.permissions || {}
          if (groupPermission.templateId) {
            const templateFound = find(templatesPermission.value, { id: groupPermission.templateId })
            templateFound && (permissions = templateFound.permissions)
          }

          // add page name
          const groupFound = find(groupList.value, { id: groupPermission.groupId })
          const groupName = groupFound?.name || ''
          const permissionsModified = permissions
            ?.map((page) => {
              const pageFound = find(PAGE_PERMISSIONS, { value: parseInt(page.featureKey) })

              return {
                ...page,
                name: pageFound ? t(pageFound.text) : null
              }
            })
            .filter((page) => !!page.name)

          return { ...groupPermission, groupName, permissions: permissionsModified }
        })

      return rows
    })

    const templatePermission = computed(() => {
      return templatesPermission.value.filter((item) => item.templateType === displayTemplateType.value)
    })

    const handleToggleCollapse = (id) => {
      const keyStr = `${id}`
      const isExpand = activeKeyCollapse.value.indexOf(keyStr) === -1

      // update allow access list
      const groupListAllowedAccess = cloneDeep(props.groupListAllowedAccess)
      const groupIndexFound = findIndex(groupListAllowedAccess, { id: parseInt(id) })

      if (groupIndexFound === -1) {
        groupListAllowedAccess.push({
          id: parseInt(id),
          isAllow: isExpand
        })
      } else {
        groupListAllowedAccess[groupIndexFound].isAllow = isExpand
      }

      emit('update:groupListAllowedAccess', groupListAllowedAccess)
    }

    const handleChangePermission = (groupPermissionId, featureKey, value) => {
      const IS_CHANGE_TEMPLATE = false
      emit('handleChangePermission', { groupPermissionId, featureKey, value, IS_CHANGE_TEMPLATE })
    }

    const chooseTemplatePermission = (groupPermissionId, permissions, templateName, templateId) => {
      const IS_CHANGE_TEMPLATE = true

      emit('handleChangePermission', { groupPermissionId, permissions, templateName, templateId, IS_CHANGE_TEMPLATE })
    }

    const deleteTemplatePermission = async (id) => {
      await deletePermissionTemplate(id)
      emit('deletePermissionTemplate', id)
    }

    const openModalSaveTemplatePermission = (groupId) => {
      isVisibleCreateTemplateModal.value = true

      let newPermission

      if (displayTemplateType.value === 1) {
        const groupIndex = findIndex(groupPermissions.value, { groupId: groupId })
        if (groupIndex === -1) return

        newPermission = groupPermissions.value[groupIndex].permissions
      } else {
        const groupIndex = findIndex(groupPermissions.value, { displayTemplateType: 2 })
        if (groupIndex === -1) return

        newPermission = groupPermissions.value[groupIndex].permissions
      }

      newTemplate.value = {
        groupId: groupId > 0 ? groupId : null,
        templateName: '',
        templateType: displayTemplateType.value,
        permissions: newPermission
      }
    }

    const handleSaveTemplate = async (name) => {
      const newPermission = { ...newTemplate.value, templateName: name }

      const { result } = await createPermissionTemplate(newPermission)
      emit('handleTemplateList', result.data)
      isVisibleCreateTemplateModal.value = false
    }

    const clearTemplateTmp = () => {
      newTemplate.value = {}
    }

    return {
      checked,
      checkedBox,
      activeKeyCollapse,
      dataTablePermission,
      PERMISSION_KEYS,
      templatePermission,
      isVisibleCreateTemplateModal,

      handleToggleCollapse,
      handleChangePermission,
      chooseTemplatePermission,
      deleteTemplatePermission,
      openModalSaveTemplatePermission,
      handleSaveTemplate,
      clearTemplateTmp
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.permission-table {
  &__header.is-active {
    background-color: $color-primary-1;

    td {
      border-bottom: 0;
    }
  }

  .ant-collapse-content {
    background-color: $color-grey-100 !important;
  }

  table {
    font-size: 14px;
    line-height: 22px;
    color: $color-grey-15;
    border: 1px solid $color-grey-75;
    border-bottom: 0;
    min-width: 500px;
    background-color: $color-grey-100;

    tbody {
      tr td {
        &:first-child {
          width: 136px;
        }
      }
    }

    td {
      padding: 12px 16px;
      border-bottom: 1px solid $color-grey-75;
    }

    &.has-border {
      font-size: 12px;
      line-height: 18px;

      thead {
        background-color: $color-grey-92;
        color: $color-primary-9;
        font-weight: 700;
        text-align: center;

        th:first-child {
          border-right: 1px solid $color-grey-75;
        }
      }

      tbody {
        tr td {
          text-align: center;

          &:first-child {
            border-right: 1px solid $color-grey-75;
            background-color: $color-grey-92;
          }
        }
      }

      th,
      td {
        padding: 7px 16px;
        border-bottom: 1px solid $color-grey-75;
      }
    }
  }

  .btn-save:hover span {
    text-decoration: underline;
  }

  .btn-dropdown {
    cursor: pointer;

    span {
      color: $color-grey-55;
    }

    &:hover span {
      text-decoration: underline;
    }
  }

  &__collapse {
    .ant-collapse-header {
      display: none;
    }

    .ant-collapse-content-box {
      padding: 0 !important;
    }

    .ant-collapse-item {
      border-bottom: 0;
    }
  }
}

.permission-template {
  &__body {
    min-width: 166px;
    background-color: $color-grey-100;
    border-radius: 2px;
    padding: 8px;
    box-shadow: 0 16px 32px -12px #33363c26;
    max-height: 176px;
    overflow-y: scroll;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding-left: 8px;
    border-radius: 2px;
  }

  .btn-delete {
    color: $color-additional-red-5;
  }

  p {
    margin-bottom: 0;
    color: $color-additional-blue-6;
    font-size: 12px;
    line-height: 18px;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>

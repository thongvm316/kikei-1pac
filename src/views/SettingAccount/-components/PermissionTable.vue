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
                >アクセスを許可する</a-checkbox
              >
            </td>

            <!-- template -->
            <td>
              <div v-show="activeKeyCollapse.indexOf(`${group.id}`) !== -1">
                <a-dropdown :trigger="['click']" overlay-class-name="permission-template">
                  <a class="ant-dropdown-link" @click.prevent>
                    <span class="u-flex u-justify-end u-items-center text-grey-55">
                      {{ group.templateName ? group.templateName : 'テンプレートを保存する' }}
                      <ArrowDownIcon class="u-ml-6"/>
                    </span>
                  </a>
                  <template #overlay>
                    <div class="permission-template__body">
                      <div
                        v-for="item in teplatePermission"
                        :key="item.id"
                        class="permission-template__item"
                      >
                        <template v-if="!item.groupId || item.groupId === group.id">
                          <p @click="chooseTemplatePermission(item.groupId, item.permissions, item.templateName)">{{ item.templateName }}</p>
                          <a-button @click="deleteTemplatePermission" class="btn-delete u-text-12" type="link" danger>
                            <template #icon>
                              <span class="btn-icon" :style="{ height: '18px' }"><delete-icon /></span>
                            </template>
                            削除
                          </a-button>
                        </template>
                      </div>
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
                      <tr v-for="page in group.permissionAccesses" :key="page.id">
                        <td>{{ page.name }}</td>
                        <td v-for="permissionKey in PERMISSION_KEYS" :key="permissionKey.id">
                          <a-radio
                            :checked="permissionKey.value === page.permission"
                            :value="permissionKey.value"
                            @change="handleChangePermission(group.id, page.id, permissionKey.value)"
                          ></a-radio>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div class="u-flex u-justify-end u-mt-12">
                    <a-button @click="saveNewTemplatePermission(group.id)" size="small" type="link" class="btn-save">
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
  />
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { find, parseInt, findIndex } from 'lodash-es'

import { PAGE_PERMISSIONS, PERMISSION_KEYS } from '@/enums/account.enum'

import SaveIcon from '@/assets/icons/ico_save.svg'
import ArrowDownIcon from '@/assets/icons/ico_arrow_down.svg'
import DeleteIcon from '@/assets/icons/ico_delete.svg'

import ConfirmCreateTemplatePermission from './ConfirmCreateTemplatePermission.vue'

export default defineComponent({
  name: 'PermissionTable',

  components: {
    SaveIcon,
    ArrowDownIcon,
    DeleteIcon,
    ConfirmCreateTemplatePermission
  },

  props: {
    permissions: {
      validator: (value) => ['object', 'undefined'].indexOf(typeof value) !== -1,
      required: true
    },
    isGroupPermission: Boolean,
    groupList: Array,
    templatesPermission: Array
  },

  emits: ['handleChangePermission'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const checked = ref(10)
    const checkedBox = ref()
    const activeKeyCollapse = ref(['1'])
    const isVisibleCreateTemplateModal = ref()
    const newTemplate = ref()

    const displayTemplateType = computed(() => {
      return props.isGroupPermission ? 1 : 2
    })

    const dataTablePermission = computed(() => {
      const rows = (props?.permissions || [])
        .filter((permision) => parseInt(permision.displayTemplateType) === displayTemplateType.value)
        .map((permission) => {
          const groupFound = find(props.groupList, { id: permission.groupId })
          const groupName = groupFound?.name || ''

          const permissionAccesses = Object.keys(permission?.permissionAccesses || {})
            .map((pageId) => {
              const pageFound = find(PAGE_PERMISSIONS, { value: parseInt(pageId) })

              return {
                id: pageId,
                name: pageFound ? t(pageFound.text) : null,
                permission: permission.permissionAccesses[pageId]
              }
            })
            .filter((page) => !!page.name)

          return { ...permission, groupName, permissionAccesses }
        })

      return rows
    })

    const teplatePermission = computed(() => {
      return props?.templatesPermission.filter(item => item.templateType === displayTemplateType.value)
    })

    const handleToggleCollapse = (key) => {
      const keyStr = `${key}`

      activeKeyCollapse.value =
        activeKeyCollapse.value.indexOf(keyStr) === -1
          ? [...activeKeyCollapse.value, keyStr]
          : activeKeyCollapse.value.filter((item) => item !== keyStr)
    }

    const handleChangePermission = (groupId, pageId, value) => {
      const IS_CHANGE_TEMPLATE = false
      emit('handleChangePermission', { groupId, pageId, value, IS_CHANGE_TEMPLATE })
    }

    const chooseTemplatePermission = (groupId, permissions, templateName) => {
      const IS_CHANGE_TEMPLATE = true
      let permissionObj = {}

      permissions.forEach(item => {
        permissionObj[item.featureKey] = item.permissionKey
      })

      emit('handleChangePermission', { groupId, permissionObj, templateName, IS_CHANGE_TEMPLATE })
    }

    const deleteTemplatePermission = () => {
      console.log('delete')
    }

    const saveNewTemplatePermission = (groupId) => {
      isVisibleCreateTemplateModal.value = true

      let newPermission

      if (displayTemplateType.value === 1) {
        const permissionIndex = findIndex(props?.permissions, { groupId: groupId })
        if (permissionIndex === -1) return

        newPermission = props.permissions[permissionIndex].permissionAccesses
      } else {
        const permissionIndex = findIndex(props?.permissions, { displayTemplateType: 2 })
        if (permissionIndex === -1) return

        newPermission = props.permissions[permissionIndex].permissionAccesses
      }

      newTemplate.value = {
        groupId,
        templateName: '',
        templateType: displayTemplateType.value,
        permissions: newPermission
      }

      console.log(newTemplate.value);
    }

    const handleSaveTemplate = (name) => {
      console.log(name)
    }

    return {
      checked,
      checkedBox,
      activeKeyCollapse,
      dataTablePermission,
      PERMISSION_KEYS,
      teplatePermission,
      isVisibleCreateTemplateModal,

      handleToggleCollapse,
      handleChangePermission,
      chooseTemplatePermission,
      deleteTemplatePermission,
      saveNewTemplatePermission,
      handleSaveTemplate
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
    box-shadow: 0px 16px 32px -12px #33363C26;
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

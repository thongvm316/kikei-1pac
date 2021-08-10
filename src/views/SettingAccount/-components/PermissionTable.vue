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
              <a-dropdown :trigger="['click']" overlay-class-name="permission-template">
                <a class="ant-dropdown-link" @click.prevent>
                  <span class="u-flex u-justify-between u-items-center text-grey-55">
                    テンプレートを保存する
                    <ArrowDownIcon />
                  </span>
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="0">
                      <div class="u-flex u-justify-between u-items-center">
                        <span class="u-text-12 u-text-additional-blue-6">Mansadasdasdager</span>
                        <a-button class="btn-delete u-text-12" type="link" danger>
                          <template #icon>
                            <span class="btn-icon" :style="{ height: '18px' }"><delete-icon /></span>
                          </template>
                          削除
                        </a-button>
                      </div>
                    </a-menu-item>
                    <a-menu-item key="1">
                      <div class="u-flex u-justify-between u-items-center">
                        <span class="u-text-additional-blue-6 u-text-12">Design</span>
                        <a-button class="btn-delete u-text-12" type="link" danger>
                          <template #icon>
                            <span class="btn-icon" :style="{ height: '18px' }"><delete-icon /></span>
                          </template>
                          削除
                        </a-button>
                      </div>
                    </a-menu-item>
                    <a-menu-item key="3">
                      <div class="u-flex u-justify-between u-items-center">
                        <span class="u-text-additional-blue-6 u-text-12">Admin</span>
                        <a-button class="btn-delete u-text-12" type="link" danger>
                          <template #icon>
                            <span class="btn-icon" :style="{ height: '18px' }"><delete-icon /></span>
                          </template>
                          削除
                        </a-button>
                      </div>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </td>
          </tr>

          <a-collapse v-model:activeKey="activeKeyCollapse" :bordered="false" class="permission-table__collapse">
            <a-collapse-panel :key="`${group.id}`">
              <tr>
                <td colspan="3">
                  <!-- table level 2 -->
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
                    <a-button size="small" type="link" class="btn-save">
                      <template #icon>
                        <span class="btn-icon"><save-icon /></span>
                      </template>
                      テンプレートを保存する
                    </a-button>
                  </div>
                </td>
              </tr>
            </a-collapse-panel>
          </a-collapse>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { find, parseInt } from 'lodash-es'

import { ACCOUNT_PERMISSION, PERMISSION_KEYS } from '@/enums/account.enum'

import SaveIcon from '@/assets/icons/ico_save.svg'
import ArrowDownIcon from '@/assets/icons/ico_arrow_down.svg'
import DeleteIcon from '@/assets/icons/ico_delete.svg'

export default defineComponent({
  name: 'PermissionTable',

  components: {
    SaveIcon,
    ArrowDownIcon,
    DeleteIcon
  },

  props: {
    permissions: {
      validator: (value) => ['object', 'undefined'].indexOf(typeof value) !== -1,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const checked = ref(10)
    const checkedBox = ref()
    const activeKeyCollapse = ref(['1'])

    const dataTablePermission = computed(() => {
      const rows = (props?.permissions || []).map((permission) => {
        const groupName = permission.groupId

        const permissionAccesses = Object.keys(permission?.permissionAccesses || {}).map((pageId) => {
          const pageFound = find(ACCOUNT_PERMISSION, { value: parseInt(pageId) })

          return {
            id: pageId,
            name: pageFound ? t(pageFound.text) : pageId,
            permission: permission.permissionAccesses[pageId]
          }
        })

        return { ...permission, groupName, permissionAccesses }
      })
      return rows
    })

    const handleToggleCollapse = (key) => {
      const keyStr = `${key}`

      activeKeyCollapse.value =
        activeKeyCollapse.value.indexOf(keyStr) === -1
          ? [...activeKeyCollapse.value, keyStr]
          : activeKeyCollapse.value.filter((item) => item !== keyStr)
    }

    const handleChangePermission = (groupId, pageId, value) => {
      emit('handleChangePermission', { groupId, pageId, value })
    }

    return {
      checked,
      checkedBox,
      activeKeyCollapse,
      dataTablePermission,
      PERMISSION_KEYS,

      handleToggleCollapse,
      handleChangePermission
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.permission-table {
  &__header {
    @include flexbox(null, null);
  }

  &__header.is-active {
    background-color: $color-primary-1;

    td {
      border-bottom: none;
    }
  }

  table {
    font-size: 14px;
    line-height: 22px;
    color: $color-grey-15;
    border: 1px solid $color-grey-75;
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
  .btn-delete {
    color: $color-additional-red-5;
  }
}
</style>

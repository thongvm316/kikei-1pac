<template>
  <div class="permission-table">
    <!-- table level 1 -->
    <table>
      <tbody>
        <template v-for="group in mockDataTable" :key="group.id" :bordered="false">
          <tr class="u-flex">
            <td>{{ group.groupName }}</td>
            <td>
              <a-checkbox
                :checked="activeKeyCollapse.indexOf(`${group.id}`) !== -1"
                @change="handleToggleCollapse(group.id)"
                >アクセスを許可する</a-checkbox
              >
            </td>
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
                            <span class="btn-icon" style="height: 18px"><delete-icon /></span>
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
                            <span class="btn-icon" style="height: 18px"><delete-icon /></span>
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
                            <span class="btn-icon" style="height: 18px"><delete-icon /></span>
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
                        <th>編集可</th>
                        <th>閲覧のみ</th>
                        <th>アクセス不可</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>プロジェクト</td>
                        <td>
                          <a-radio-group v-model:value="checked" name="a">
                            <a-radio :value="10"></a-radio>
                          </a-radio-group>
                        </td>
                        <td>
                          <a-radio-group v-model:value="checked" name="a">
                            <a-radio :value="20"></a-radio>
                          </a-radio-group>
                        </td>
                        <td>
                          <a-radio-group v-model:value="checked" name="a">
                            <a-radio :value="30"></a-radio>
                          </a-radio-group>
                        </td>
                      </tr>
                      <tr>
                        <td>入出金</td>
                        <td>
                          <a-radio-group v-model:value="checked" name="b">
                            <a-radio :value="10"></a-radio>
                          </a-radio-group>
                        </td>
                        <td>
                          <a-radio-group v-model:value="checked" name="b">
                            <a-radio :value="20"></a-radio>
                          </a-radio-group>
                        </td>
                        <td>
                          <a-radio-group v-model:value="checked" name="b">
                            <a-radio :value="30"></a-radio>
                          </a-radio-group>
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
import { defineComponent, ref } from 'vue'

import SaveIcon from '@/assets/icons/ico_save.svg'
import ArrowDownIcon from '@/assets/icons/ico_arrow_down.svg'
import DeleteIcon from '@/assets/icons/ico_delete.svg'

const mockDataTable = [
  {
    id: 1,
    templateType: 1,
    groupName: 'gumiVietnam',
    permissionAccess: {
      プロジェクト: 2,
      入出金: 1,
      資金繰り: 2,
      管理会計: 0
    }
  },
  {
    id: 2,
    templateType: 1,
    groupName: 'VAND',
    permissionAccess: {
      プロジェクト: 2,
      入出金: 1,
      資金繰り: 2,
      管理会計: 0
    }
  },
  {
    id: 3,
    templateType: 1,
    groupName: 'VAND creative',
    permissionAccess: {
      プロジェクト: 2,
      入出金: 1,
      資金繰り: 2,
      管理会計: 0
    }
  }
]

export default defineComponent({
  name: 'PermissionTable',

  components: {
    SaveIcon,
    ArrowDownIcon,
    DeleteIcon
  },

  setup() {
    const checked = ref(10)
    const checkedBox = ref()
    const activeKeyCollapse = ref(['1'])

    const handleToggleCollapse = (key) => {
      const keyStr = `${key}`

      activeKeyCollapse.value =
        activeKeyCollapse.value.indexOf(keyStr) === -1
          ? [...activeKeyCollapse.value, keyStr]
          : activeKeyCollapse.value.filter((item) => item !== keyStr)
    }

    return {
      checked,
      checkedBox,
      activeKeyCollapse,
      mockDataTable,
      handleToggleCollapse
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';

.permission-table {
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

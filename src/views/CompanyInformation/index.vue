<template>
  <modal-leave-tab-company v-model:visible="modalLeave" />
  <template v-if="checkEmpty">
    <section class="company-information">
      <div class="company-information__empty-img">
        <img src="../../../src/assets/images/empty_1.png" alt="picture-empty" />
      </div>

      <p class="company-information__empty-line1">You don’t have any group company yet.</p>

      <p class="company-information__empty-line2">Click button below to add group company</p>

      <a-button type="primary" @click="add">グループ企業追加</a-button>
    </section>
  </template>
  <template v-else>
    <section class="company-information__addition">
      <div class="company-information__addition-box-create">
        <a-button class="btn-modal" type="primary" @click="add">
          <add-icon class="add-icon" />
          {{ $t('company.add_company') }}
        </a-button>
      </div>

      <a-tabs v-model:activeKey="activeKey" hide-add @change="handleChooseTab">
        <a-tab-pane
          v-for="pane in panes"
          :key="pane.key"
          :tab="pane.title"
          :closable="false"
          :disabled="checkCreate"
        ></a-tab-pane>
      </a-tabs>

      <company-form-information
        :get-detail-tab="getDetailTab"
        :target-tab="targetTab"
        :tab-id="tabId"
        :reset-form-info="resetFormInfo"
        :check-create="checkCreate"
        @handleCancle="remove"
      />
    </section>
  </template>
</template>

<script>
import { defineComponent, onBeforeMount, ref, watch } from 'vue'
import { forEach, last, isArray } from 'lodash-es'

import AddIcon from '@/assets/icons/ico_line-add.svg'

import CompanyFormInformation from '@/views/CompanyInformation/-components/CompanyFormInformation'
import useGetAllGroupService from '@/views/CompanyInformation/compasables/useGetAllGroupService'
import useGetTabIDService from '@/views/CompanyInformation/compasables/useGetTabIDService'
import useGetListSaleTargetService from '@/views/CompanyInformation/compasables/useGetListSaleTargetService'
import { useStore } from 'vuex'
import ModalLeaveTabCompany from '@/components/ModalLeaveTabCompany'

export default defineComponent({
  name: 'Index',

  components: { ModalLeaveTabCompany, CompanyFormInformation, AddIcon },

  setup() {
    const store = useStore()
    const checkEmpty = ref(false)
    const checkCreate = ref(false)
    const resetFormInfo = ref(false)
    const modalLeave = ref(false)

    const lastIndex = ref(1)
    const tabId = ref(1)
    const targetKeyTab = ref(1)
    const keyTabDefault = ref(1)

    const targetTab = ref([])
    const panes = ref([])
    const allGroup = ref([])

    const getDetailTab = ref()
    const activeKey = ref(allGroup?.value[0]?.id)

    const add = () => {
      if (checkCreate.value) return

      lastIndex.value = last(allGroup.value)

      let draft = '(Draft)'
      checkEmpty.value = false
      activeKey.value = lastIndex.value.id + 1

      panes.value.push({
        title: `New ${draft}`,
        key: activeKey.value
      })

      checkCreate.value = true
      store.commit('company/STORE_COMPANY_INFOMATION_ISCREATE', false)
    }

    const getAllGroup = async (value) => {
      const { getAllGroup } = useGetAllGroupService()
      const { result } = await getAllGroup()

      allGroup.value = result.data

      if (isArray(allGroup.value)) {
        checkEmpty.value = false
        forEach(allGroup.value, (value) => {
          panes.value.push({
            title: `${value.name}`,
            key: value.id
          })
        })

        let indexOf = allGroup.value.length - 1

        if (value === '1') {
          handleChooseTab(allGroup.value[indexOf].id)
          activeKey.value = allGroup.value[indexOf].id
          store.commit('company/STORE_COMPANY_INFOMATION_ISCREATE', true)
        } else if (value === '2') {
          handleChooseTab(activeKey.value)
          store.commit('company/STORE_COMPANY_INFOMATION_UPDATE', false)
        } else if (value === '3') {
          handleChooseTab(allGroup.value[indexOf].id)
          activeKey.value = allGroup.value[indexOf].id
        } else {
          activeKey.value = allGroup?.value[0]?.id
          await fetchListForm(allGroup?.value[0]?.id)
        }
      } else {
        checkEmpty.value = true
      }
    }

    // Fetch List Sale Target
    const fetchListSaleTarget = async (targetKey) => {
      const { getListSaleTarget } = useGetListSaleTargetService(targetKey)
      const { result } = await getListSaleTarget()

      targetTab.value = result?.data
    }

    const fetchListForm = async (targetKey) => {
      tabId.value = targetKey

      const { getTabID } = useGetTabIDService(targetKey)
      const { result } = await getTabID()

      await fetchListSaleTarget(targetKey)

      getDetailTab.value = result.data
    }

    const handleChooseTab = (targetKey) => {
      targetKeyTab.value = targetKey
      if (!store.state.company.leaveGroup) {
        activeKey.value = store.state.company.leaveTab
        modalLeave.value = true
      } else {
        activeKey.value = targetKeyTab.value
        fetchListForm(targetKeyTab.value)
        store.commit('company/STORE_COMPANY_INFOMATION_CHANGE', true)
        store.commit('company/STORE_COMPANY_INFOMATION_LEAVETAB', targetKey)
      }
    }

    const remove = () => {
      checkCreate.value = false
      let lastIndex = 0
      panes.value.forEach((pane, i) => {
        if (pane.key === activeKey.value) {
          lastIndex = i - 1
        }
      })
      panes.value = panes.value.filter((pane) => pane.key !== activeKey.value)

      if (panes.value.length && activeKey.value === activeKey.value) {
        if (lastIndex >= 0) {
          activeKey.value = panes.value[lastIndex].key
        } else {
          activeKey.value = panes.value[0].key
        }
      }
      handleChooseTab(activeKey.value)
    }

    onBeforeMount(() => {
      getAllGroup()
      store.commit('company/STORE_COMPANY_INFOMATION_ISCREATE', true)
      store.commit('company/STORE_COMPANY_INFOMATION_LEAVETAB', 1)
    })

    watch(
      () => store.state.company.leaveGroup,
      () => {
        if (store.state.company.leaveGroup) {
          activeKey.value = targetKeyTab.value
          keyTabDefault.value = targetKeyTab.value
          fetchListForm(targetKeyTab.value)
          store.commit('company/STORE_COMPANY_INFOMATION_CHANGE', true)
          store.commit('company/STORE_COMPANY_INFOMATION_LEAVETAB', activeKey.value)
        }
      }
    )

    watch(
      () => store.state.company.isCreated,
      () => {
        if (store.state.company.isCreated) {
          let created = '1'
          checkCreate.value = false
          panes.value = []
          getAllGroup(created)
        }
      }
    )

    watch(
      () => store.state.company.isUpdateTab,
      () => {
        if (store.state.company.isUpdateTab) {
          let update = '2'
          checkCreate.value = false
          panes.value = []
          getAllGroup(update)
        }
      }
    )

    watch(
      () => store.state.company.isDeleted,
      () => {
        if (store.state.company.isDeleted) {
          let deleted = '3'
          checkCreate.value = false
          panes.value = []
          getAllGroup(deleted)
        }
      }
    )

    return {
      checkEmpty,
      panes,
      activeKey,
      allGroup,
      getDetailTab,
      targetTab,
      tabId,
      resetFormInfo,
      checkCreate,
      modalLeave,
      handleChooseTab,
      add,
      remove
    }
  }
})
</script>

<style scoped lang="scss"></style>

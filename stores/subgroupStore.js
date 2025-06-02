import { defineStore } from 'pinia'
import { useSubgroupApi } from '~/api/subgroupApi'
import { useShowNotivue } from '~/composables/useNotivue'
import { useGroupStore } from '~/stores/groupStore'

export const useSubgroupStore = defineStore('subgroup', () => {
  const { $loader } = useNuxtApp()
  const { showNotivue } = useShowNotivue()
  const api = useSubgroupApi()

  const subgroups = ref([])
  const subgroup = ref()
  const loading = ref(false)

  /* ---------- helpers ---------- */
  const enrich = (raw) => {
    const groupStore = useGroupStore()
    return raw.map(s => ({
      ...s,
      group: groupStore.groups.find(g => g.id === s.groupId) || null
    }))
  }

  /* ---------- actions ---------- */
  const fetchSubgroups = async() => {
    $loader.show()
    loading.value = true
    try {
      subgroups.value = enrich(await api.getAllSubgroups())
    }
    catch (e) {
      showNotivue(true, 'Failed to load sub-groups')
      throw e
    }
    finally {
      $loader.hide()
      loading.value = false
    }
  }

  const fetchSubgroup = async(id) => {
    $loader.show()
    try {
      subgroup.value = await api.getSubgroup(id)
      return subgroup.value
    }
    catch (e) {
      showNotivue(true, 'Failed to load sub-group')
      throw e
    }
    finally {
      $loader.hide()
    }
  }

  const createSubgroup = async(dto) => {
    $loader.show()
    try {
      await api.postSubgroup(dto)
      await fetchSubgroups()
      showNotivue(false, 'Sub-group created')
    }
    catch (e) {
      showNotivue(true, 'Failed to create sub-group')
      throw e
    }
    finally {
      $loader.hide()
    }
  }

  const updateSubgroup = async(id, dto) => {
    $loader.show()
    try {
      await api.putSubgroup(id, dto)
      await fetchSubgroups()
      showNotivue(false, 'Sub-group updated')
    }
    catch (e) {
      showNotivue(true, 'Failed to update sub-group')
      throw e
    }
    finally {
      $loader.hide()
    }
  }

  const removeSubgroup = async(id) => {
    $loader.show()
    try {
      await api.deleteSubgroup(id)
      await fetchSubgroups()
      showNotivue(false, 'Sub-group deleted')
    }
    catch (e) {
      showNotivue(true, 'Failed to delete sub-group')
      throw e
    }
    finally {
      $loader.hide()
    }
  }
  
  const byGroup = groupId => subgroups.value.filter(s => s.groupId === groupId)

  return {
    subgroups, subgroup, loading,
    fetchSubgroups, fetchSubgroup,
    createSubgroup, updateSubgroup, removeSubgroup,
    byGroup
  }
})

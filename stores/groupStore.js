import { useGroupApi } from '~/api/groupApi'
import { useShowNotivue } from '~/composables/useNotivue.js'
import { useDepartmentStore } from '~/stores/departmentStore'

export const useGroupStore = defineStore('group', () => {
  const { $loader } = useNuxtApp()
  const { showNotivue } = useShowNotivue()
  const { getGroups, getGroup, postGroup, putGroup, deleteGroup } = useGroupApi()

  const groups = ref([])
  const group = ref({})
  const loading = ref(false)

  // Helper function to enrich groups with department data
  const enrichGroupsWithDepartments = (groups, departments) => {
    if (!Array.isArray(groups) || !Array.isArray(departments)) {
      return groups
    }

    return groups.map(group => ({
      ...group,
      department: departments.find(dept => dept.id === group.departmentId) || null
    }))
  }

  const fetchGroups = async() => {
    $loader.show()
    loading.value = true
    try {
      const response = await getGroups()

      // Get department store to enrich data (without fetching)
      const departmentStore = useDepartmentStore()

      // Enrich groups with department data
      groups.value = enrichGroupsWithDepartments(response, departmentStore.departments)
      return groups.value
    }
    catch (error) {
      showNotivue(true, 'Failed to load groups')
      console.error('Error loading groups:', error)
    }
    finally {
      $loader.hide()
      loading.value = false
    }
  }

  const fetchGroup = async(id) => {
    $loader.show()
    try {
      const response = await getGroup(id)

      // Enrich single group with department data
      const departmentStore = useDepartmentStore()
      if (response.departmentId) {
        const department = departmentStore.departments.find(d => d.id === response.departmentId)
        response.department = department || null
      }

      group.value = response
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to load group')
      console.error('Error loading group:', error)
    }
    finally {
      $loader.hide()
    }
  }

  const createGroup = async(data) => {
    $loader.show()
    try {
      const response = await postGroup(data)
      await fetchGroups()
      showNotivue(false, 'Group created successfully')
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to create group')
      console.error('Error creating group:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  const updateGroup = async(id, data) => {
    $loader.show()
    try {
      const response = await putGroup(id, data)
      await fetchGroups()
      showNotivue(false, 'Group updated successfully')
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to update group')
      console.error('Error updating group:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  const removeGroup = async(id) => {
    $loader.show()
    try {
      await deleteGroup(id)
      await fetchGroups()
      showNotivue(false, 'Group deleted successfully')
    }
    catch (error) {
      showNotivue(true, 'Failed to delete group')
      console.error('Error deleting group:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  // Вспомогательные методы для фильтрации
  const getGroupsByDepartment = (departmentId) => {
    return groups.value.filter(g => g.department?.id === departmentId)
  }

  const getGroupsByCourse = (course) => {
    return groups.value.filter(g => g.course === course)
  }

  const getGroupsByDepartmentAndCourse = (departmentId, course) => {
    return groups.value.filter(g =>
      g.department?.id === departmentId
      && g.course === course
    )
  }

  return {
    groups,
    group,
    loading,
    fetchGroups,
    fetchGroup,
    createGroup,
    updateGroup,
    removeGroup,
    getGroupsByDepartment,
    getGroupsByCourse,
    getGroupsByDepartmentAndCourse
  }
})

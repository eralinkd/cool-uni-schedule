import { useDepartmentApi } from '~/api/departmentApi'
import { useShowNotivue } from '~/composables/useNotivue.js'

export const useDepartmentStore = defineStore('department', () => {
  const { $loader } = useNuxtApp()
  const { showNotivue } = useShowNotivue()
  const { getDepartments, getDepartment, postDepartment, putDepartment, deleteDepartment } = useDepartmentApi()

  const departments = ref([])
  const department = ref({})
  const loading = ref(false)

  const fetchDepartments = async() => {
    $loader.show()
    loading.value = true
    try {
      const response = await getDepartments()
      departments.value = response
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to load departments')
      console.error('Error loading departments:', error)
    }
    finally {
      $loader.hide()
      loading.value = false
    }
  }

  const fetchDepartment = async(id) => {
    $loader.show()
    try {
      const response = await getDepartment(id)
      department.value = response
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to load department')
      console.error('Error loading department:', error)
    }
    finally {
      $loader.hide()
    }
  }

  const createDepartment = async(data) => {
    $loader.show()
    try {
      const response = await postDepartment(data)
      await fetchDepartments() // Обновляем список
      showNotivue(false, 'Department created successfully')
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to create department')
      console.error('Error creating department:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  const updateDepartment = async(id, data) => {
    $loader.show()
    try {
      const response = await putDepartment(id, data)
      await fetchDepartments() // Обновляем список
      showNotivue(false, 'Department updated successfully')
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to update department')
      console.error('Error updating department:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  const removeDepartment = async(id) => {
    $loader.show()
    try {
      await deleteDepartment(id)
      await fetchDepartments() // Обновляем список
      showNotivue(false, 'Department deleted successfully')
    }
    catch (error) {
      showNotivue(true, 'Failed to delete department')
      console.error('Error deleting department:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  return {
    departments,
    department,
    loading,
    fetchDepartments,
    fetchDepartment,
    createDepartment,
    updateDepartment,
    removeDepartment
  }
})

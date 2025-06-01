import { useProfessorApi } from '~/api/professorApi'
import { useShowNotivue } from '~/composables/useNotivue.js'
import { useDepartmentStore } from '~/stores/departmentStore'

export const useProfessorStore = defineStore('professor', () => {
  const { $loader } = useNuxtApp()
  const { showNotivue } = useShowNotivue()
  const { getProfessors, getProfessor, postProfessor, putProfessor, deleteProfessor } = useProfessorApi()

  const professors = ref([])
  const professor = ref({})
  const loading = ref(false)

  // Helper function to enrich professors with department data
  const enrichProfessorsWithDepartments = (professors, departments) => {
    if (!Array.isArray(professors) || !Array.isArray(departments)) {
      return professors
    }

    return professors.map(professor => ({
      ...professor,
      departments: Array.isArray(professor.departmentIds)
        ? professor.departmentIds.map(id => departments.find(dept => dept.id === id)).filter(Boolean)
        : []
    }))
  }

  const fetchProfessors = async() => {
    $loader.show()
    loading.value = true
    try {
      const response = await getProfessors()

      // Get department store to enrich data (without fetching)
      const departmentStore = useDepartmentStore()

      // Enrich professors with department data
      professors.value = enrichProfessorsWithDepartments(response, departmentStore.departments)
      return professors.value
    }
    catch (error) {
      showNotivue(true, 'Failed to load professors')
      console.error('Error loading professors:', error)
    }
    finally {
      $loader.hide()
      loading.value = false
    }
  }

  const fetchProfessor = async(id) => {
    $loader.show()
    try {
      const response = await getProfessor(id)

      // Enrich single professor with department data
      const departmentStore = useDepartmentStore()
      if (Array.isArray(response.departmentIds)) {
        response.departments = response.departmentIds
          .map(id => departmentStore.departments.find(d => d.id === id))
          .filter(Boolean)
      }

      professor.value = response
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to load professor')
      console.error('Error loading professor:', error)
    }
    finally {
      $loader.hide()
    }
  }

  const createProfessor = async(data) => {
    $loader.show()
    try {
      const response = await postProfessor(data)
      await fetchProfessors()
      showNotivue(false, 'Professor created successfully')
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to create professor')
      console.error('Error creating professor:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  const updateProfessor = async(id, data) => {
    $loader.show()
    try {
      const response = await putProfessor(id, data)
      await fetchProfessors()
      showNotivue(false, 'Professor updated successfully')
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to update professor')
      console.error('Error updating professor:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  const removeProfessor = async(id) => {
    $loader.show()
    try {
      await deleteProfessor(id)
      await fetchProfessors()
      showNotivue(false, 'Professor deleted successfully')
    }
    catch (error) {
      showNotivue(true, 'Failed to delete professor')
      console.error('Error deleting professor:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  // Вспомогательные методы
  const getProfessorsByDepartment = (departmentId) => {
    return professors.value.filter(p =>
      p.departments?.some(d => d.id === departmentId)
    )
  }

  const searchProfessors = (searchTerm) => {
    const term = searchTerm.toLowerCase()
    return professors.value.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
      return fullName.includes(term)
    })
  }

  return {
    professors,
    professor,
    loading,
    fetchProfessors,
    fetchProfessor,
    createProfessor,
    updateProfessor,
    removeProfessor,
    getProfessorsByDepartment,
    searchProfessors
  }
})

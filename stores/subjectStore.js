import { useSubjectApi } from '~/api/subjectApi'
import { useShowNotivue } from '~/composables/useNotivue.js'
import { useDepartmentStore } from '~/stores/departmentStore'

export const useSubjectStore = defineStore('subject', () => {
  const { $loader } = useNuxtApp()
  const { showNotivue } = useShowNotivue()
  const { getSubjects, getSubject, postSubject, putSubject, deleteSubject } = useSubjectApi()

  const subjects = ref([])
  const subject = ref({})
  const loading = ref(false)

  // Helper function to enrich subjects with department data
  const enrichSubjectsWithDepartments = (subjects, departments) => {
    if (!Array.isArray(subjects) || !Array.isArray(departments)) {
      return subjects
    }

    return subjects.map(subject => ({
      ...subject,
      department: departments.find(dept => dept.id === subject.department) || null
    }))
  }

  const fetchSubjects = async() => {
    $loader.show()
    loading.value = true
    try {
      const response = await getSubjects()

      // Get department store to enrich data (without fetching)
      const departmentStore = useDepartmentStore()

      // Enrich subjects with department data
      subjects.value = enrichSubjectsWithDepartments(response, departmentStore.departments)
      return subjects.value
    }
    catch (error) {
      showNotivue(true, 'Failed to load subjects')
      console.error('Error loading subjects:', error)
    }
    finally {
      $loader.hide()
      loading.value = false
    }
  }

  const fetchSubject = async(id) => {
    $loader.show()
    try {
      const response = await getSubject(id)

      // Enrich single subject with department data
      const departmentStore = useDepartmentStore()
      if (response.departmentId) {
        const department = departmentStore.departments.find(d => d.id === response.departmentId)
        response.department = department || null
      }

      subject.value = response
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to load subject')
      console.error('Error loading subject:', error)
    }
    finally {
      $loader.hide()
    }
  }

  const createSubject = async(data) => {
    $loader.show()
    try {
      const response = await postSubject(data)
      await fetchSubjects()
      showNotivue(false, 'Subject created successfully')
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to create subject')
      console.error('Error creating subject:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  const updateSubject = async(id, data) => {
    $loader.show()
    try {
      const response = await putSubject(id, data)
      await fetchSubjects()
      showNotivue(false, 'Subject updated successfully')
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to update subject')
      console.error('Error updating subject:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  const removeSubject = async(id) => {
    $loader.show()
    try {
      await deleteSubject(id)
      await fetchSubjects()
      showNotivue(false, 'Subject deleted successfully')
    }
    catch (error) {
      showNotivue(true, 'Failed to delete subject')
      console.error('Error deleting subject:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  // Вспомогательные методы
  const getSubjectsByDepartment = (departmentId) => {
    return subjects.value.filter(s => s.department?.id === departmentId)
  }

  const getSubjectsByType = (type) => {
    return subjects.value.filter(s => s.type === type)
  }

  return {
    subjects,
    subject,
    loading,
    fetchSubjects,
    fetchSubject,
    createSubject,
    updateSubject,
    removeSubject,
    getSubjectsByDepartment,
    getSubjectsByType
  }
})


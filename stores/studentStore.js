import { defineStore } from 'pinia'
import { useStudentApi } from '~/api/studentApi'
import { useShowNotivue } from '~/composables/useNotivue'
import { useGroupStore } from '~/stores/groupStore'
import { useSubgroupStore } from '~/stores/subgroupStore'

export const useStudentStore = defineStore('student', () => {
  const { $loader } = useNuxtApp()
  const { showNotivue } = useShowNotivue()
  const api = useStudentApi()

  const students = ref([])
  const student = ref()
  const loading = ref(false)

  /* ---------- helpers ---------- */
  const enrich = (raw) => {
    const groupStore = useGroupStore()
    const subgroupStore = useSubgroupStore()

    return raw.map(st => ({
      ...st,
      group: groupStore.groups.find(g => g.id === st.groupId) || null,
      subgroup: subgroupStore.subgroups.find(s => s.id === st.subgroupId) || null
    }))
  }

  /* ---------- actions ---------- */
  const fetchStudents = async() => {
    $loader.show()
    loading.value = true
    try {
      students.value = enrich(await api.getStudents())
    }
    catch (e) {
      showNotivue(true, 'Failed to load students')
      throw e
    }
    finally {
      $loader.hide()
      loading.value = false
    }
  }

  const fetchStudent = async(id) => {
    $loader.show()
    try {
      student.value = await api.getStudent(id)
      return student.value
    }
    catch (e) {
      showNotivue(true, 'Failed to load student')
      throw e
    }
    finally {
      $loader.hide()
    }
  }

  const createStudent = async(dto) => {
    $loader.show()
    try {
      await api.postStudent(dto)
      await fetchStudents()
      showNotivue(false, 'Student created')
    }
    catch (e) {
      showNotivue(true, 'Failed to create student')
      throw e
    }
    finally {
      $loader.hide()
    }
  }

  const updateStudent = async(id, dto) => {
    $loader.show()
    try {
      await api.putStudent(id, dto)
      await fetchStudents()
      showNotivue(false, 'Student updated')
    }
    catch (e) {
      showNotivue(true, 'Failed to update student')
      throw e
    }
    finally {
      $loader.hide()
    }
  }

  const removeStudent = async(id) => {
    $loader.show()
    try {
      await api.deleteStudent(id)
      await fetchStudents()
      showNotivue(false, 'Student deleted')
    }
    catch (e) {
      showNotivue(true, 'Failed to delete student')
      throw e
    }
    finally {
      $loader.hide()
    }
  }

  /* ---------- helpers ---------- */
  const searchStudents = (term) => {
    const t = term.toLowerCase()
    return students.value.filter(s =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(t))
  }

  return {
    students, student, loading,
    fetchStudents, fetchStudent,
    createStudent, updateStudent, removeStudent,
    searchStudents
  }
})

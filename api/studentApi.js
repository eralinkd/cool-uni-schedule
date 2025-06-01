export const useStudentApi = () => {
  const { $api } = useNuxtApp()

  const getStudents = async() => {
    const response = await $api.get('/api/students')
    return response
  }

  const getStudent = async(id) => {
    const response = await $api.get(`/api/students/${id}`)
    return response
  }

  const putStudent = async(id, data) => {
    const response = await $api.put(`/api/students/${id}`, data)
    return response
  }

  const deleteStudent = async(id) => {
    const response = await $api.delete(`/api/students/${id}`)
    return response
  }

  const postStudent = async(data) => {
    const response = await $api.post('/api/student', data)
    return response
  }

  return { getStudents, putStudent, deleteStudent, postStudent, getStudent }
}

export const useSubjectApi = () => {
  const { $api } = useNuxtApp()

  const getSubjects = async() => {
    const response = await $api.get('/api/subject')
    return response.data
  }

  const getSubject = async(id) => {
    const response = await $api.get(`/api/subject/${id}`)
    return response.data
  }

  const putSubject = async(id, data) => {
    const response = await $api.put(`/api/subject/${id}`, data)
    return response.data
  }

  const deleteSubject = async(id) => {
    const response = await $api.delete(`/api/subject/${id}`)
    return response.data
  }

  const postSubject = async(data) => {
    const response = await $api.post('/api/subject', data)
    return response.data
  }

  const getSubjectByDepartment = async(departmentId) => {
    const response = await $api.get(`/api/subject/by-department/${departmentId}`)
    return response
  }

  return { getSubjects, putSubject, deleteSubject, postSubject, getSubject, getSubjectByDepartment }
}

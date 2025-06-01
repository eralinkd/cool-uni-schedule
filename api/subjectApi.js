
export const useSubjectApi = () => {
  const { $api } = useNuxtApp()

  const getSubject = async(id) => {
    const response = await $api.get(`/api/subjects/${id}`)
    return response
  }

  const putSubject = async(id, data) => {
    const response = await $api.put(`/api/subjects/${id}`, data)
    return response
  }

  const deleteSubject = async(id) => {
    const response = await $api.delete(`/api/subjects/${id}`)
    return response
  }

  const getSubjects = async() => {
    const response = await $api.get('/api/subject')
    return response
  }

  const postSubject = async(data) => {
    const response = await $api.post('/api/subject', data)
    return response
  }

  const getSubjectByDepartment = async(departmentId) => {
    const response = await $api.get(`/api/subject/by-department/${departmentId}`)
    return response
  }

  return { getSubject, putSubject, deleteSubject, getSubjects, postSubject, getSubjectByDepartment }
}

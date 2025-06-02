export const useSubjectApi = () => {
  const { $api } = useNuxtApp()

  const getSubjects = async() => {
    const { data } = await $api.get('/api/subject')
    return data
  }

  const getSubject = async(id) => {
    const { data } = await $api.get(`/api/subject/${id}`)
    return data
  }

  const getSubjectByDepartment = async(departmentId) => {
    const { data } = await $api.get(`/api/subject/by-department/${departmentId}`)
    return data
  }

  const postSubject = async(payload) => {
    const { data } = await $api.post(
      '/api/admin/subjects',
      null,
      {
        params: {
          name: payload.name,
          departmentId: payload.departmentId
        }
      }
    )
    return data
  }

  const putSubject = async(
    id,
    payload
  ) => {
    const { data } = await $api.put(
      `/api/admin/subjects/${id}`,
      null,
      {
        params: {
          name: payload.name,
          departmentId: payload.departmentId
        }
      }
    )
    return data
  }

  const deleteSubject = async(id) => {
    const { data } = await $api.delete(`/api/admin/subjects/${id}`)
    return data
  }

  return { getSubjects, getSubject, getSubjectByDepartment, postSubject, putSubject, deleteSubject }
}

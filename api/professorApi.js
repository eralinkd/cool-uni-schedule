export const useProfessorApi = () => {
  const { $api } = useNuxtApp()

  const getProfessors = async() => {
    const response = await $api.get('/api/professor')
    return response.data
  }

  const getProfessor = async(id) => {
    const response = await $api.get(`/api/professor/${id}`)
    return response.data
  }

  const postProfessor = async(data) => {
    const params = {
      username: data.username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      departmentIds: data.departmentId,
      rate: data.rate
    }
    if (data.onlineLink) {
      params.onlineLink = data.onlineLink
    }

    const response = await $api.post(
      '/api/admin/professors',
      null,
      { params }
    )
    return response.data
  }

  const putProfessor = async(id, data) => {
    const params = {
      firstName: data.firstName,
      lastName: data.lastName,
      departmentIds: data.departmentId,
      rate: data.rate
    }
    if (data.onlineLink) {
      params.onlineLink = data.onlineLink
    }

    const response = await $api.put(
      `/api/admin/professors/${id}`,
      null,
      { params }
    )
    return response.data
  }

  const deleteProfessor = async(id) => {
    const response = await $api.delete(`/api/admin/professors/${id}`)
    return response.data
  }

  return { getProfessors, getProfessor, postProfessor, putProfessor, deleteProfessor }
}

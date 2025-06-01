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

  const putProfessor = async(id, data) => {
    const response = await $api.put(`/api/professor/${id}`, data)
    return response.data
  }

  const deleteProfessor = async(id) => {
    const response = await $api.delete(`/api/professor/${id}`)
    return response.data
  }

  const postProfessor = async(data) => {
    const response = await $api.post('/api/professor', data)
    return response.data
  }

  return { getProfessors, putProfessor, deleteProfessor, postProfessor, getProfessor }
}

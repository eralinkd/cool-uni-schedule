export const useProfessorApi = () => {
  const { $api } = useNuxtApp()

  const getProfessors = async() => {
    const response = await $api.get('/api/professors')
    return response
  }

  const getProfessor = async(id) => {
    const response = await $api.get(`/api/professors/${id}`)
    return response
  }

  const putProfessor = async(id, data) => {
    const response = await $api.put(`/api/professors/${id}`, data)
    return response
  }

  const deleteProfessor = async(id) => {
    const response = await $api.delete(`/api/professors/${id}`)
    return response
  }

  const postProfessor = async(data) => {
    const response = await $api.post('/api/professor', data)
    return response
  }

  return { getProfessors, putProfessor, deleteProfessor, postProfessor, getProfessor }
}

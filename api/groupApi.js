export const useGroupApi = () => {
  const { $api } = useNuxtApp()

  const getGroups = async() => {
    const response = await $api.get('/api/group')
    return response.data
  }

  const getGroup = async(id) => {
    const response = await $api.get(`/api/group/${id}`)
    return response.data
  }

  const putGroup = async(id, data) => {
    const response = await $api.put(`/api/group/${id}`, data)
    return response.data
  }

  const deleteGroup = async(id) => {
    const response = await $api.delete(`/api/group/${id}`)
    return response.data
  }

  const postGroup = async(data) => {
    const response = await $api.post('/api/group', data)
    return response.data
  }

  return { getGroups, putGroup, deleteGroup, postGroup, getGroup }
}

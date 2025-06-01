export const useGroupApi = () => {
  const { $api } = useNuxtApp()

  const getGroups = async() => {
    const response = await $api.get('/api/groups')
    return response
  }

  const getGroup = async(id) => {
    const response = await $api.get(`/api/groups/${id}`)
    return response
  }

  const putGroup = async(id, data) => {
    const response = await $api.put(`/api/groups/${id}`, data)
    return response
  }

  const deleteGroup = async(id) => {
    const response = await $api.delete(`/api/groups/${id}`)
    return response
  }

  const postGroup = async(data) => {
    const response = await $api.post('/api/group', data)
    return response
  }

  return { getGroups, putGroup, deleteGroup, postGroup, getGroup }
}

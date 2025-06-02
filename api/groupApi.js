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

  const postGroup = async(data) => {
    const response = await $api.post(
      '/api/admin/groups',
      null,
      {
        params: {
          name: data.number, // data.number → name
          departmentId: data.departmentId,
          capacity: data.capacity
        }
      }
    )
    return response.data
  }

  const putGroup = async(id, data) => {
    const response = await $api.put(
      `/api/admin/groups/${id}`,
      null,
      {
        params: {
          name: data.number,
          departmentId: data.departmentId,
          capacity: data.capacity
        }
      }
    )
    return response.data
  }

  const deleteGroup = async(id) => {
    const response = await $api.delete(`/api/admin/groups/${id}`)
    return response.data
  }

  return { getGroups, getGroup, postGroup, putGroup, deleteGroup }
}

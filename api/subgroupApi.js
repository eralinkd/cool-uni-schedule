export const useSubgroupApi = () => {
  const { $api } = useNuxtApp()

  const getAllSubgroups = async() => {
    const response = await $api.get('/api/subgroup')
    return response.data
  }

  const getSubgroup = async(id) => {
    const response = await $api.get(`/api/subgroup/${id}`)
    return response.data
  }

  const postSubgroup = async(data) => {
    const params = {
      name: data.name,
      groupId: data.groupId,
      capacity: data.capacity
    }
    const response = await $api.post(
      '/api/admin/subgroups',
      null,
      { params }
    )
    return response.data
  }

  const putSubgroup = async(id, data) => {
    const params = {
      name: data.name,
      capacity: data.capacity
    }
    const response = await $api.put(
      `/api/admin/subgroups/${id}`,
      null,
      { params }
    )
    return response.data
  }

  const deleteSubgroup = async(id) => {
    const response = await $api.delete(`/api/admin/subgroups/${id}`)
    return response.data
  }

  return { getAllSubgroups, getSubgroup, postSubgroup, putSubgroup, deleteSubgroup
  }
}

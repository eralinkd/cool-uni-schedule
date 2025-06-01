
export const useSubgroupApi = () => {
  const { $api } = useNuxtApp()

  const getSubgroups = async(id) => {
    const response = await $api.get(`/api/subgroups/${id}`)
    return response
  }

  const getSubgroup = async(id) => {
    const response = await $api.get(`/api/subgroups/${id}`)
    return response
  }

  const putSubgroup = async(id, data) => {
    const response = await $api.put(`/api/subgroups/${id}`, data)
    return response
  }

  const deleteSubgroup = async(id) => {
    const response = await $api.delete(`/api/subgroups/${id}`)
    return response
  }

  const postSubgroup = async(data) => {
    const response = await $api.post('/api/subgroup', data)
    return response
  }

  return { getSubgroups, putSubgroup, deleteSubgroup, postSubgroup, getSubgroup }
}

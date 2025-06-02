export const useDepartmentApi = () => {
  const { $api } = useNuxtApp()

  const getDepartments = async() => {
    const response = await $api.get('/api/department')
    return response.data
  }

  const getDepartment = async(id) => {
    const response = await $api.get(`/api/department/${id}`)
    return response.data
  }

  const postDepartment = async(data) => {
    const response = await $api.post(
      '/api/admin/departments',
      null,
      {
        params: { name: data.name }
      }
    )
    return response.data
  }

  const putDepartment = async(id, data) => {
    const response = await $api.put(
      `/api/admin/departments/${id}`,
      null,
      {
        params: { name: data.name }
      }
    )
    return response.data
  }

  const deleteDepartment = async(id) => {
    const response = await $api.delete(`/api/admin/departments/${id}`)
    return response.data
  }

  return {
    getDepartments,
    getDepartment,
    postDepartment,
    putDepartment,
    deleteDepartment
  }
}

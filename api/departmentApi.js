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

  const putDepartment = async(id, data) => {
    const response = await $api.put(`/api/department/${id}`, data)
    return response.data
  }

  const deleteDepartment = async(id) => {
    const response = await $api.delete(`/api/department/${id}`)
    return response.data
  }

  const postDepartment = async(data) => {
    const response = await $api.post('/api/department', data)
    return response.data
  }

  return { getDepartments, putDepartment, deleteDepartment, postDepartment, getDepartment }
}

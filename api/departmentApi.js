export const useDepartmentApi = () => {
  const { $api } = useNuxtApp()

  const getDepartments = async() => {
    const response = await $api.get('/api/departments')
    return response
  }

  const getDepartment = async(id) => {
    const response = await $api.get(`/api/departments/${id}`)
    return response
  }

  const putDepartment = async(id, data) => {
    const response = await $api.put(`/api/departments/${id}`, data)
    return response
  }

  const deleteDepartment = async(id) => {
    const response = await $api.delete(`/api/departments/${id}`)
    return response
  }

  const postDepartment = async(data) => {
    const response = await $api.post('/api/department', data)
    return response
  }

  return { getDepartments, putDepartment, deleteDepartment, postDepartment, getDepartment }
}

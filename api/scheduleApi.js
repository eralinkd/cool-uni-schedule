export const useScheduleApi = () => {
  const { $api } = useNuxtApp()

  const getSchedule = async(id) => {
    const response = await $api.get(`/api/schedules/${id}`)
    return response
  }

  const putSchedule = async(id, data) => {
    const response = await $api.put(`/api/schedules/${id}`, data)
    return response
  }

  const deleteSchedule = async(id) => {
    const response = await $api.delete(`/api/schedules/${id}`)
    return response
  }

  const postSchedule = async(data) => {
    const response = await $api.post('/api/schedule', data)
    return response
  }

  const getScheduleFilter = async(data) => {
    const response = await $api.get('/api/schedule/filter', data)
    return response
  }

  const getScheduleAvailableRooms = async(data) => {
    const response = await $api.get('/api/schedule/available-rooms', data)
    return response
  }

  const getScheduleAvailableProfessors = async(data) => {
    const response = await $api.get('/api/schedule/available-professors', data)
    return response
  }

  return { getSchedule,
    putSchedule,
    deleteSchedule,
    postSchedule,
    getScheduleFilter,
    getScheduleAvailableRooms,
    getScheduleAvailableProfessors
  }
}

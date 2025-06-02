export const useRoomApi = () => {
  const { $api } = useNuxtApp()

  const getRooms = async() => {
    const response = await $api.get('/api/room')
    return response.data
  }

  const getRoom = async(id) => {
    const response = await $api.get(`/api/room/${id}`)
    return response.data
  }

  const postRoom = async(data) => {
    const params = {
      name: data.name,
      capacity: data.capacity
    }
    if (data.building) params.building = data.building
    if (data.floor !== null && data.floor !== undefined) params.floor = data.floor

    const response = await $api.post(
      '/api/admin/rooms',
      null,
      { params }
    )
    return response.data
  }

  const putRoom = async(id, data) => {
    const params = {
      name: data.name,
      capacity: data.capacity
    }
    if (data.building) params.building = data.building
    if (data.floor !== null && data.floor !== undefined) params.floor = data.floor

    const response = await $api.put(
      `/api/admin/rooms/${id}`,
      null,
      { params }
    )
    return response.data
  }

  const deleteRoom = async(id) => {
    const response = await $api.delete(`/api/admin/rooms/${id}`)
    return response.data
  }

  return {
    getRooms,
    getRoom,
    postRoom,
    putRoom,
    deleteRoom
  }
}

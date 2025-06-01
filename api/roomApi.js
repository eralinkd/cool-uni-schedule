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

  const putRoom = async(id, data) => {
    const response = await $api.put(`/api/room/${id}`, data)
    return response.data
  }

  const deleteRoom = async(id) => {
    const response = await $api.delete(`/api/room/${id}`)
    return response.data
  }

  const postRoom = async(data) => {
    const response = await $api.post('/api/room', data)
    return response.data
  }

  return { getRooms, putRoom, deleteRoom, postRoom, getRoom }
}

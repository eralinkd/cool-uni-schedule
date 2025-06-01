export const useRoomApi = () => {
  const { $api } = useNuxtApp()

  const getRooms = async() => {
    const response = await $api.get('/api/rooms')
    return response
  }

  const getRoom = async(id) => {
    const response = await $api.get(`/api/rooms/${id}`)
    return response
  }

  const putRoom = async(id, data) => {
    const response = await $api.put(`/api/rooms/${id}`, data)
    return response
  }

  const deleteRoom = async(id) => {
    const response = await $api.delete(`/api/rooms/${id}`)
    return response
  }

  const postRoom = async(data) => {
    const response = await $api.post('/api/room', data)
    return response
  }

  return { getRooms, putRoom, deleteRoom, postRoom, getRoom }
}

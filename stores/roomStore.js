import { useRoomApi } from '~/api/roomApi'
import { useShowNotivue } from '~/composables/useNotivue.js'

export const useRoomStore = defineStore('room', () => {
  const { $loader } = useNuxtApp()
  const { showNotivue } = useShowNotivue()
  const { getRooms, getRoom, postRoom, putRoom, deleteRoom } = useRoomApi()

  const rooms = ref([])
  const room = ref({})
  const loading = ref(false)

  const fetchRooms = async() => {
    $loader.show()
    loading.value = true
    try {
      const response = await getRooms()
      rooms.value = response
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to load rooms')
      console.error('Error loading rooms:', error)
    }
    finally {
      $loader.hide()
      loading.value = false
    }
  }

  const fetchRoom = async(id) => {
    $loader.show()
    try {
      const response = await getRoom(id)
      room.value = response
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to load room')
      console.error('Error loading room:', error)
    }
    finally {
      $loader.hide()
    }
  }

  const createRoom = async(data) => {
    $loader.show()
    try {
      const response = await postRoom(data)
      await fetchRooms()
      showNotivue(false, 'Room created successfully')
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to create room')
      console.error('Error creating room:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  const updateRoom = async(id, data) => {
    $loader.show()
    try {
      const response = await putRoom(id, data)
      await fetchRooms()
      showNotivue(false, 'Room updated successfully')
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to update room')
      console.error('Error updating room:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  const removeRoom = async(id) => {
    $loader.show()
    try {
      await deleteRoom(id)
      await fetchRooms()
      showNotivue(false, 'Room deleted successfully')
    }
    catch (error) {
      showNotivue(true, 'Failed to delete room')
      console.error('Error deleting room:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  // Вспомогательные методы
  const getRoomsByType = (type) => {
    return rooms.value.filter(r => r.type === type)
  }

  const getRoomsByCapacity = (minCapacity) => {
    return rooms.value.filter(r => r.capacity >= minCapacity)
  }

  return {
    rooms,
    room,
    loading,
    fetchRooms,
    fetchRoom,
    createRoom,
    updateRoom,
    removeRoom,
    getRoomsByType,
    getRoomsByCapacity
  }
})

import { useScheduleApi } from '~/api/scheduleApi'
import { useShowNotivue } from '~/composables/useNotivue.js'

export const useScheduleStore = defineStore('schedule', () => {
  const { $loader } = useNuxtApp()
  const { showNotivue } = useShowNotivue()
  const {
    getSchedule,
    postSchedule,
    putSchedule,
    deleteSchedule,
    getScheduleFilter,
    getScheduleAvailableRooms,
    getScheduleAvailableProfessors
  } = useScheduleApi()

  const scheduleEntries = ref([])
  const scheduleEntry = ref({})
  const availableRooms = ref([])
  const availableProfessors = ref([])
  const loading = ref(false)

  // Преобразование данных расписания для отображения в таблице
  const scheduleDataForTable = computed(() => {
    const data = {}

    scheduleEntries.value.forEach((entry) => {
      // Формируем ключи для каждой подгруппы
      entry.subgroups?.forEach((subgroup) => {
        const key = `slot-${getTimeSlotId(entry.startTime)}-group-${subgroup.group.id}-subgroup-${subgroup.id}`

        data[key] = {
          id: entry.id,
          subject: entry.subject?.name || '',
          professor: entry.professor
            ? `${entry.professor.firstName} ${entry.professor.lastName}`
: '',
          room: entry.rooms?.[0]?.name || '',
          dates: entry.dates?.map(d => d.date).join(', ') || '',
          platform: entry.isOnline ? entry.onlineLink : '',
          type: entry.type,
          isOnline: entry.isOnline
        }
      })
    })

    return data
  })

  // Получение ID временного слота по времени начала
  const getTimeSlotId = (startTime) => {
    const hour = startTime.hour
    const minute = startTime.minute

    // Маппинг времени на ID слотов (пример)
    if (hour === 9 && minute === 0) return 1
    if (hour === 10 && minute === 30) return 2
    if (hour === 12 && minute === 10) return 3
    if (hour === 13 && minute === 40) return 4
    if (hour === 15 && minute === 10) return 5

    return 0
  }

  const fetchScheduleByFilter = async(filterData) => {
    $loader.show()
    loading.value = true
    try {
      const response = await getScheduleFilter(filterData)
      scheduleEntries.value = response
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to load schedule')
      console.error('Error loading schedule:', error)
    }
    finally {
      $loader.hide()
      loading.value = false
    }
  }

  const fetchScheduleEntry = async(id) => {
    $loader.show()
    try {
      const response = await getSchedule(id)
      scheduleEntry.value = response
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to load schedule entry')
      console.error('Error loading schedule entry:', error)
    }
    finally {
      $loader.hide()
    }
  }

  const createScheduleEntry = async(data) => {
    $loader.show()
    try {
      const response = await postSchedule(data)
      showNotivue(false, 'Schedule entry created successfully')
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to create schedule entry')
      console.error('Error creating schedule entry:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  const updateScheduleEntry = async(id, data) => {
    $loader.show()
    try {
      const response = await putSchedule(id, data)
      showNotivue(false, 'Schedule entry updated successfully')
      return response
    }
    catch (error) {
      showNotivue(true, 'Failed to update schedule entry')
      console.error('Error updating schedule entry:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  const removeScheduleEntry = async(id) => {
    $loader.show()
    try {
      await deleteSchedule(id)
      showNotivue(false, 'Schedule entry deleted successfully')
    }
    catch (error) {
      showNotivue(true, 'Failed to delete schedule entry')
      console.error('Error deleting schedule entry:', error)
      throw error
    }
    finally {
      $loader.hide()
    }
  }

  const fetchAvailableRooms = async(data) => {
    try {
      const response = await getScheduleAvailableRooms(data)
      availableRooms.value = response
      return response
    }
    catch (error) {
      console.error('Error loading available rooms:', error)
    }
  }

  const fetchAvailableProfessors = async(data) => {
    try {
      const response = await getScheduleAvailableProfessors(data)
      availableProfessors.value = response
      return response
    }
    catch (error) {
      console.error('Error loading available professors:', error)
    }
  }

  return {
    scheduleEntries,
    scheduleEntry,
    scheduleDataForTable,
    availableRooms,
    availableProfessors,
    loading,
    fetchScheduleByFilter,
    fetchScheduleEntry,
    createScheduleEntry,
    updateScheduleEntry,
    removeScheduleEntry,
    fetchAvailableRooms,
    fetchAvailableProfessors
  }
})

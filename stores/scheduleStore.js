import { useScheduleApi } from '~/api/scheduleApi'
import { useShowNotivue } from '~/composables/useNotivue'
import { useProfessorStore } from '~/stores/professorStore'
import { useSubjectStore } from '~/stores/subjectStore'

export const useScheduleStore = defineStore('schedule', () => {
  const { $loader } = useNuxtApp()
  const { showNotivue } = useShowNotivue()
  const api = useScheduleApi()

  const entries = ref([]) // весь массив ScheduleEntry
  const loading = ref(false)

  /* --- helpers: преобразуем в map «day-slot-group-sub» → payload,
           чтобы ре-использовать существующие ScheduleTable-компоненты  --- */
  const flatMap = computed(() => {
    const m = {}

    // Получаем данные из других stores для обогащения
    const subjectStore = useSubjectStore()
    const professorStore = useProfessorStore()

    for (const e of entries.value) {
      // Обрабатываем новый формат данных
      const startTime = e.startTime
      const endTime = e.endTime

      // Преобразуем время в ID слота (примерное соответствие)
      const timeString = `${startTime.hour.toString().padStart(2, '0')}:${startTime.minute.toString().padStart(2, '0')}-${endTime.hour.toString().padStart(2, '0')}:${endTime.minute.toString().padStart(2, '0')}`

      // Маппинг времени на ID слота
      const timeSlotMapping = {
        '09:00-10:20': 1,
        '10:30-11:50': 2,
        '12:10-13:30': 3,
        '13:40-15:00': 4,
        '15:10-16:30': 5
      }
      const slotId = timeSlotMapping[timeString] || 1

      // Обрабатываем даты - берём первую дату и преобразуем в день недели
      const dateObj = Array.isArray(e.dates) && e.dates.length ? e.dates[0] : null
      let day = null
      if (dateObj) {
        const lessonDate = new Date(dateObj.date || dateObj)
        day = lessonDate.getDay() || 7 // 0=воскресенье -> 7, 1=понедельник, etc.
        if (day === 0) day = 7 // воскресенье в конец недели
      }

      // Получаем название предмета и преподавателя
      const subject = subjectStore.subjects.find(s => s.id === e.subject)
      const professor = professorStore.professors.find(p => p.id === e.professor)

      const subjectName = e.subjectName || subject?.name || `Subject ${e.subject}`
      const professorName = e.professorName || (professor ? `${professor.firstName} ${professor.lastName}` : `Professor ${e.professor}`)

      // Обрабатываем группы и подгруппы из нового формата
      const groups = e.groups || []
      const subgroups = e.subgroups || []

      for (const g of groups) {
        // Если есть подгруппы в самой группе, используем их
        const groupSubgroups = g.subgroups && g.subgroups.length > 0 ? g.subgroups : subgroups

        if (groupSubgroups.length === 0) {
          // Если подгрупп нет, создаем запись для всей группы
          const key = `day-${day}-slot-${slotId}-group-${g.id}-subgroup-0`
          m[key] = {
            subject: `${subjectName} (${e.type})`,
            professor: professorName,
            room: (e.rooms?.[0]?.name) || '',
            isOnline: e.isOnline,
            onlineLink: e.onlineLink
          }
        }
        else {
          // Создаем записи для каждой подгруппы
          for (const sg of groupSubgroups) {
            const key = `day-${day}-slot-${slotId}-group-${g.id}-subgroup-${sg.id}`
            m[key] = {
              subject: `${subjectName} (${e.type})`,
              professor: professorName,
              room: (e.rooms?.[0]?.name) || '',
              isOnline: e.isOnline,
              onlineLink: e.onlineLink
            }
          }
        }
      }
    }
    return m
  })

  /* --- CRUD calls --- */
  const fetchAll = async() => {
    $loader.show()
    loading.value = true
    try {
      entries.value = await api.getAllEntries()
    }
    catch (e) {
      console.log(e)
      showNotivue(true, 'Не вдалося завантажити розклад')
    }
    finally {
      $loader.hide()
      loading.value = false
    }
  }

  const create = async(dto) => {
    $loader.show()
    try {
      await api.createEntry(dto)
      await fetchAll()
      showNotivue(false, 'Заняття створено')
    }
    finally {
      $loader.hide()
    }
  }

  const update = async(id, dto) => {
    $loader.show()
    try {
      await api.updateEntry(id, dto) // PUT /api/schedule/{id}
      await fetchAll() // перезагружаем список
      showNotivue(false, 'Заняття оновлено')
    }
    catch (e) {
      showNotivue(true, 'Помилка оновлення заняття')
      console.error(e)
      throw e // чтобы компонент-вызыватель міг відреагувати
    }
    finally {
      $loader.hide()
    }
  }

  /** Видалити заняття */
  const remove = async(id) => {
    $loader.show()
    try {
      await api.deleteEntry(id) // DELETE /api/schedule/{id}
      await fetchAll()
      showNotivue(false, 'Заняття видалено')
    }
    catch (e) {
      showNotivue(true, 'Помилка видалення заняття')
      console.error(e)
      throw e
    }
    finally {
      $loader.hide()
    }
  }

  /* --- фильтрация для UI --- */
  const byGroup = groupId =>
    entries.value.filter(e => e.groups?.some(g => g.id === groupId))

  const byProfessor = profId =>
    entries.value.filter(e => e.professor === profId)

  return {
    entries, flatMap, loading,
    fetchAll, create, update, remove,
    byGroup, byProfessor
  }
})

import { useScheduleApi } from '~/api/scheduleApi'
import { useShowNotivue } from '~/composables/useNotivue'

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
    for (const e of entries.value) {
      // берём первую дату – в UI мы всё равно фильтруем неделей/днём
      const dateObj = Array.isArray(e.dates) && e.dates.length ? e.dates[0] : null
      const day = dateObj ? (new Date(dateObj.date).getDay()) : null // 0-6
      const slotId = e.type // грубая заглушка
      for (const g of e.groups ?? []) {
        for (const sg of (e.subgroups?.length ? e.subgroups : [{ id: null }])) {
          const key = `day-${day}-slot-${slotId}-group-${g.id}-subgroup-${sg.id || 0}`
          m[key] = {
            subject: e.subjectName, // back-доописка
            professor: e.professorName,
            room: (e.rooms?.[0]?.name) || '',
            isOnline: e.isOnline,
            onlineLink: e.onlineLink
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
    catch (e) {
      showNotivue(true, 'Помилка створення')
      throw e
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

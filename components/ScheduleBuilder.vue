<template>
  <div class="space-y-6">
    <!-- фильтры -->
    <ScheduleHeader
      :semester="semester"
      :week="weekInfo"
      :current-week-number="weekNumber"
      :selected-department-id="departmentId"
      :selected-course="course"
      :departments="departments"
      @week-change="changeWeek"
      @department-change="departmentId=$event"
      @course-change="course=$event"
    />

    <!-- таблица -->
    <ScheduleTable
      :groups="filteredGroups"
      :time-slots="timeSlots"
      :schedule-data="scheduleMap"
      @cell-edit="openEdit"
      @drag-selection="handleSelect"
    />

    <!-- модалки -->
    <CreateLessonModal
      v-if="showCreate"
      :selected-cells="selectedCells"
      :subjects="subjects"
      :professors="professors"
      :rooms="rooms"
      @save="createLesson"
      @close="showCreate=false"
    />
    <RoomRecommendationModal
      v-if="showRooms"
      :recommended-rooms="recommendedRooms"
      :lesson-data="draftLesson"
      @confirm="swapRoom"
      @close="showRooms=false"
    />
  </div>
</template>

<script setup>
/* импорты компонентов + сторов */
import ScheduleHeader from '~/components/ScheduleHeader.vue'
import ScheduleTable from '~/components/ScheduleTable.vue'
import CreateLessonModal from '~/components/CreateLessonModal.vue'
import RoomRecommendationModal from '~/components/RoomRecommendationModal.vue'

const scheduleStore = useScheduleStore()
const groupStore = useGroupStore()
const departmentStore = useDepartmentStore()
const professorStore = useProfessorStore()
const subjectStore = useSubjectStore()
const roomStore = useRoomStore()

/* ------------ data ------------ */
const semester = '2 семестр 2024-2025'
const weekNumber = ref(1)
const departmentId = ref(null)
const course = ref(1)

/* reactive sources */
const departments = computed(() => departmentStore.departments)
const professors = computed(() => professorStore.professors)
const subjects = computed(() => subjectStore.subjects)
const rooms = computed(() => roomStore.rooms)
const groups = computed(() => groupStore.getGroupsByDepartment(departmentId.value))

/* фильтруем группы */
const filteredGroups = computed(() => groups.value)

/* расписание мапой “cellId → entry” */
const scheduleMap = computed(() => scheduleStore.flatMap)

/* ------------ UI helpers ------------ */
const timeSlots = [
  { id: 1, time: '9:00-10:20', period: 1 },
  { id: 2, time: '10:30-11:50', period: 2 },
  { id: 3, time: '12:10-13:30', period: 3 },
  { id: 4, time: '13:40-15:00', period: 4 },
  { id: 5, time: '15:10-16:30', period: 5 }
]

/* неделя */
const { getWeekInfo } = useAcademicWeeks()
const weekInfo = computed(() => getWeekInfo(weekNumber.value))
const changeWeek = (dir) => {
  if (dir === 'prev' && weekNumber.value > 1) weekNumber.value--
  if (dir === 'next') weekNumber.value++
}

/* selection & modals */
const selectedCells = ref([])
const showCreate = ref(false)
const showRooms = ref(false)
const recommendedRooms = ref([])
const draftLesson = ref(null)

const handleSelect = ({ selectedCells }) => {
  selectedCells.value = selectedCells
  showCreate.value = true
}

/* создание */
const createLesson = async(dto) => {
  await scheduleStore.create(dto) // POST /api/schedule
  showCreate.value = false
}

/* смена аудитории (пример) */
const swapRoom = async(room) => {
  await scheduleStore.update(draftLesson.value.entryId, { roomIds: [room.id] })
  showRooms.value = false
}

/* edit */
const openEdit = () => {
  // можно открыть модалку редактирования
}

/* ------------ init ------------ */
onMounted(async() => {
  await Promise.all([
    departmentStore.fetchDepartments(),
    groupStore.fetchGroups(),
    professorStore.fetchProfessors(),
    subjectStore.fetchSubjects(),
    roomStore.fetchRooms(),
    scheduleStore.fetchAll()
  ])
  departmentId.value = departments.value[0]?.id ?? null
})
</script>

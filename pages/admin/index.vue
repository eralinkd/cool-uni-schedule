<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Адміністративна панель</h1>

    <UTabs :items="tabs">
      <template #departments>
        <DepartmentsManager />
      </template>

      <template #groups>
        <GroupsManager />
      </template>

      <template #professors>
        <ProfessorsManager />
      </template>

      <template #subjects>
        <SubjectsManager />
      </template>

      <template #rooms>
        <RoomsManager />
      </template>
    </UTabs>
  </div>
</template>

<script setup>
import DepartmentsManager from '~/components/admin/DepartmentsManager.vue'
import GroupsManager from '~/components/admin/GroupsManager.vue'
import ProfessorsManager from '~/components/admin/ProfessorsManager.vue'
import RoomsManager from '~/components/admin/RoomsManager.vue'
import SubjectsManager from '~/components/admin/SubjectsManager.vue'

// Initialize all stores
const departmentStore = useDepartmentStore()
const groupStore = useGroupStore()
const professorStore = useProfessorStore()
const subjectStore = useSubjectStore()
const roomStore = useRoomStore()

const tabs = [
  {
    label: 'Кафедри',
    slot: 'departments'
  },
  {
    label: 'Групи',
    slot: 'groups'
  },
  {
    label: 'Викладачі',
    slot: 'professors'
  },
  {
    label: 'Предмети',
    slot: 'subjects'
  },
  {
    label: 'Аудиторії',
    slot: 'rooms'
  }
]

// Load all data on mount
onMounted(async() => {
  try {
    // Load departments first as other entities depend on them
    await departmentStore.fetchDepartments()

    // Then load other data in parallel
    await Promise.all([
      groupStore.fetchGroups(),
      professorStore.fetchProfessors(),
      subjectStore.fetchSubjects(),
      roomStore.fetchRooms()
    ])
  }
  catch (error) {
    console.error('Error loading admin data:', error)
  }
})
</script>

<script setup>
import DepartmentsManager from '~/components/admin/DepartmentsManager.vue'
import GroupsManager from '~/components/admin/GroupsManager.vue'
import ProfessorsManager from '~/components/admin/ProfessorsManager.vue'
import RoomsManager from '~/components/admin/RoomsManager.vue'
import StudentsManager from '~/components/admin/StudentsManager.vue'
import SubjectsManager from '~/components/admin/SubjectsManager.vue'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async() => {
  if (!authStore.token) return router.replace({ name: 'login' })
  // загружаем все сторы параллельно
  await Promise.all([
    useDepartmentStore().fetchDepartments(),
    useGroupStore().fetchGroups(),
    useProfessorStore().fetchProfessors(),
    useSubjectStore().fetchSubjects(),
    useRoomStore().fetchRooms()
  ])
})

/** При клике на кнопку «Конструктор» */
const goToScheduleBuilder = () => router.push('/')
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Адміністративна панель</h1>
      <UButton
        color="primary"
        icon="i-heroicons-calendar-days"
        @click="goToScheduleBuilder"
      >
        Конструктор розкладу
      </UButton>
    </div>

    <UTabs
      :items="[
        { label: 'Кафедри', slot: 'departments' },
        { label: 'Групи', slot: 'groups' },
        { label: 'Викладачі', slot: 'professors' },
        { label: 'Студенти', slot: 'students' },
        { label: 'Предмети', slot: 'subjects' },
        { label: 'Аудиторії', slot: 'rooms' },
      ]"
    >
      <template #departments>
        <DepartmentsManager />
      </template>
      <template #groups>
        <GroupsManager />
      </template>
      <template #professors>
        <ProfessorsManager />
      </template>
      <template #students>
        <StudentsManager />
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

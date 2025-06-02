<!-- components/admin/StudentsManager.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Управління студентами</h2>

      <UButton color="primary" @click="openCreateModal">
        Додати студента
      </UButton>
    </div>

    <!-- Table -->
    <UTable
      :data="students"
      :columns="columns"
      :loading="loading"
    >
      <template #group-cell="{ row }">
        {{ row.original.group?.name || '-' }}
      </template>
      <template #subgroup-cell="{ row }">
        {{ row.original.subgroup?.name || '-' }}
      </template>
      <template #actions-cell="{ row }">
        <div class="flex gap-2">
          <UButton
            icon="i-heroicons-pencil-square"
            variant="ghost"
            color="gray"
            @click="openEditModal(row.original)"
          />
          <UButton
            icon="i-heroicons-trash"
            variant="ghost"
            color="red"
            @click="confirmDelete(row.original)"
          />
        </div>
      </template>
    </UTable>

    <!-- ----------------  CREATE / EDIT MODAL ---------------- -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center"
        @click.self="closeModal"
      >
        <div class="fixed inset-0 bg-black/50" />

        <div
          class="relative w-full max-w-md bg-white rounded-lg shadow-lg mx-4 z-[101]"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="text-lg font-semibold">
              {{ isEditing ? 'Редагувати студента' : 'Новий студент' }}
            </h3>
            <UButton
              icon="i-heroicons-x-mark-20-solid"
              variant="ghost"
              color="gray"
              @click="closeModal"
            />
          </div>

          <!-- Form -->
          <form
            class="p-4 space-y-4"
            @submit.prevent="handleSubmit"
            @click.stop
          >
            <!-- Login & password only on create -->
            <template v-if="!isEditing">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Логін
                </label>
                <UInput
                  v-model="form.username"
                  placeholder="Введіть логін"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Пароль
                </label>
                <UInput
                  v-model="form.password"
                  type="password"
                  placeholder="Введіть пароль"
                  required
                />
              </div>
            </template>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Ім’я
              </label>
              <UInput
                v-model="form.firstName"
                placeholder="Введіть ім’я"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Прізвище
              </label>
              <UInput
                v-model="form.lastName"
                placeholder="Введіть прізвище"
                required
              />
            </div>

            <!-- GROUP SELECT -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Група
              </label>
              <select
                v-model="form.groupId"
                required
                class="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">
                  Оберіть групу
                </option>
                <option
                  v-for="g in groupOptions"
                  :key="g.value"
                  :value="g.value"
                >
                  {{ g.label }}
                </option>
              </select>
            </div>

            <!-- SUBGROUP SELECT (optional) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Підгрупа (необов’язково)
              </label>
              <select
                v-model="form.subgroupId"
                class="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">
                  Без підгрупи
                </option>
                <option
                  v-for="sg in subgroupOptions"
                  :key="sg.value"
                  :value="sg.value"
                >
                  {{ sg.label }}
                </option>
              </select>
            </div>
          </form>

          <!-- Footer -->
          <div class="flex justify-end gap-3 p-4 border-t">
            <UButton
              variant="ghost"
              color="gray"
              @click="closeModal"
            >
              Відміна
            </UButton>
            <UButton
              color="primary"
              :loading="submitting"
              @click="handleSubmit"
            >
              {{ isEditing ? 'Зберегти' : 'Створити' }}
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ----------------  DELETE CONFIRM ---------------- -->
    <Teleport to="body">
      <div
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center"
        @click.self="closeDeleteModal"
      >
        <div class="fixed inset-0 bg-black/50" />
        <div class="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-lg z-[101]" @click.stop>
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="text-lg font-semibold">Підтвердження видалення</h3>
            <UButton
              icon="i-heroicons-x-mark-20-solid"
              variant="ghost"
              color="gray"
              @click="closeDeleteModal"
            />
          </div>
          <div class="p-4">
            <p>Ви впевнені, що хочете видалити "{{ selectedStudent?.firstName }} {{ selectedStudent?.lastName }}"?</p>
          </div>
          <div class="flex justify-end gap-3 p-4 border-t">
            <UButton
              variant="ghost"
              color="gray"
              @click="closeDeleteModal"
            >
              Скасувати
            </UButton>
            <UButton
              color="red"
              :loading="deleting"
              @click="handleDelete"
            >
              Видалити
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useGroupStore } from '~/stores/groupStore'
import { useStudentStore } from '~/stores/studentStore'
import { useSubgroupStore } from '~/stores/subgroupStore'

const studentStore = useStudentStore()
const groupStore = useGroupStore()
const subgroupStore = useSubgroupStore()

/* ---------------- TABLE ---------------- */
const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'firstName', header: 'Ім’я' },
  { accessorKey: 'lastName', header: 'Прізвище' },
  { accessorKey: 'group', header: 'Група' },
  // { accessorKey: 'subgroup', header: 'Підгрупа' },
  { accessorKey: 'actions', header: 'Дії' }
]

const students = computed(() => Array.isArray(studentStore.students) ? studentStore.students : [])
const loading = computed(() => studentStore.loading)

/* ---------------- OPTIONS ---------------- */
const groupOptions = computed(() =>
  groupStore.groups.map(g => ({ label: g.name, value: g.id }))
)

const subgroupOptions = computed(() => {
  if (!form.value.groupId) return []
  const grp = groupStore.groups.find(g => g.id === form.value.groupId)
  return (grp?.subgroups || []).map(sg => ({ label: sg.name, value: sg.id }))
})

/* ---------------- MODAL STATE ---------------- */
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const selectedStudent = ref(null)
const submitting = ref(false)
const deleting = ref(false)

/* ---------------- FORM ---------------- */
const form = ref({
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  groupId: null,
  subgroupId: null
})

/* -------------- OPEN / CLOSE helpers -------------- */
const openCreateModal = () => {
  isEditing.value = false
  form.value = { username: '', password: '', firstName: '', lastName: '', groupId: null, subgroupId: null }
  isModalOpen.value = true
}

const openEditModal = (st) => {
  isEditing.value = true
  selectedStudent.value = st
  form.value = {
    username: '', // login/password not editable
    password: '',
    firstName: st.firstName,
    lastName: st.lastName,
    groupId: st.group?.id || st.groupId || null,
    subgroupId: st.subgroup?.id || st.subgroupId || null
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedStudent.value = null
}

const confirmDelete = (st) => {
  selectedStudent.value = st
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  selectedStudent.value = null
}

/* -------------- CRUD handlers -------------- */
const handleSubmit = async() => {
  // basic validation
  if (!form.value.firstName.trim() || !form.value.lastName.trim() || !form.value.groupId) {
    console.error('Необхідно заповнити всі обов’язкові поля')
    return
  }

  submitting.value = true
  try {
    if (isEditing.value) {
      await studentStore.updateStudent(selectedStudent.value.id, {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        groupId: form.value.groupId,
        subgroupId: form.value.subgroupId || null
      })
    }
    else {
      // username & password are required on create
      if (!form.value.username.trim() || !form.value.password) {
        console.error('Логін і пароль обов’язкові при створенні')
        submitting.value = false
        return
      }
      await studentStore.createStudent({
        username: form.value.username,
        password: form.value.password,
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        groupId: form.value.groupId,
        subgroupId: form.value.subgroupId || null
      })
    }
    closeModal()
  }
  catch (e) {
    console.error('Помилка збереження студента:', e)
  }
  finally {
    submitting.value = false
  }
}

const handleDelete = async() => {
  deleting.value = true
  try {
    await studentStore.removeStudent(selectedStudent.value.id)
    closeDeleteModal()
  }
  catch (e) {
    console.error('Помилка видалення студента:', e)
  }
  finally {
    deleting.value = false
  }
}

/* -------------- LOAD initial data -------------- */
onMounted(async() => {
  await groupStore.fetchGroups() // подтягивает subgroups
  await subgroupStore.fetchSubgroups() // если нужен отдельный список
  await studentStore.fetchStudents()
})

/* reload subgroups list when group changes */
watch(() => form.value.groupId, (newVal) => {
  if (!newVal) form.value.subgroupId = null
})
</script>

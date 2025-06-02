<!-- components/admin/GroupsManager.vue -->
<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Управління групами</h2>
      <UButton color="primary" @click="openCreateModal">
        Додати групу
      </UButton>
    </div>

    <UTable
      :data="groups"
      :columns="columns"
      :loading="loading"
    >
      <template #department-cell="{ row }">
        {{ row.original.department.name || '-' }}
      </template>
      <template #capacity-cell="{ row }">
        {{ row.original.capacity }}
      </template>
      <template #actions-cell="{ row }">
        <div class="flex gap-2">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-pencil-square"
            @click="openEditModal(row.original)"
          />
          <UButton
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
            @click="confirmDelete(row.original)"
          />
        </div>
      </template>
    </UTable>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center"
        @click.self="closeModal"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50" />
        <div
          class="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 z-[101]"
          @click.stop
        >
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="text-lg font-semibold">
              {{ isEditing ? 'Редагувати групу' : 'Нова група' }}
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="closeModal"
            />
          </div>

          <form
            class="p-4"
            @submit.prevent="handleSubmit"
            @click.stop
          >
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Номер групи
                </label>
                <UInput
                  v-model="form.name"
                  placeholder="Введіть назву групи"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Кафедра
                </label>
                <select
                  v-model="form.departmentId"
                  required
                  class="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">
                    Оберіть кафедру
                  </option>
                  <option
                    v-for="dept in departmentOptions"
                    :key="dept.value"
                    :value="dept.value"
                  >
                    {{ dept.label }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Місткість
                </label>
                <UInput
                  v-model.number="form.capacity"
                  type="number"
                  min="1"
                  placeholder="Введіть місткість"
                  required
                />
              </div>
            </div>
          </form>

          <div class="flex justify-end gap-3 p-4 border-t">
            <UButton
              color="gray"
              variant="ghost"
              @click="closeModal"
            >
              Скасувати
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

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center"
        @click.self="closeDeleteModal"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50" />
        <div
          class="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 z-[101]"
          @click.stop
        >
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="text-lg font-semibold">Підтвердження видалення</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="closeDeleteModal"
            />
          </div>
          <div class="p-4">
            <p>
              Ви впевнені, що хочете видалити групу
              "{{ selectedGroup?.name }}"?
            </p>
          </div>
          <div class="flex justify-end gap-3 p-4 border-t">
            <UButton
              color="gray"
              variant="ghost"
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
import { computed, onMounted, ref } from 'vue'
import { useDepartmentStore } from '~/stores/departmentStore'
import { useGroupStore } from '~/stores/groupStore'

const groupStore = useGroupStore()
const departmentStore = useDepartmentStore()

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Назва' },
  { accessorKey: 'department', header: 'Кафедра' },
  { accessorKey: 'capacity', header: 'Місткість' },
  { accessorKey: 'actions', header: 'Дії' }
]

const groups = computed(() => {
  const data = groupStore.groups
  return Array.isArray(data) ? data : []
})
const loading = computed(() => groupStore.loading)

const departmentOptions = computed(() => {
  const deps = departmentStore.departments
  if (!Array.isArray(deps)) return []
  return deps.map(d => ({ label: d.name, value: d.id }))
})

// Modal state
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const selectedGroup = ref(null)
const submitting = ref(false)
const deleting = ref(false)

const form = ref({
  name: '',
  departmentId: null,
  capacity: null
})

const openCreateModal = () => {
  isEditing.value = false
  form.value = { name: '', departmentId: null, capacity: null }
  isModalOpen.value = true
}

const openEditModal = (group) => {
  isEditing.value = true
  selectedGroup.value = group
  form.value = {
    name: group.name,
    departmentId: group.department?.id || null,
    capacity: group.capacity
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  form.value = { name: '', departmentId: null, capacity: null }
  selectedGroup.value = null
}

const confirmDelete = (group) => {
  selectedGroup.value = group
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  selectedGroup.value = null
}

const handleSubmit = async() => {
  if (!form.value.name.trim() || !form.value.departmentId || !form.value.capacity) {
    console.error('Всі поля обов’язкові')
    return
  }
  submitting.value = true
  try {
    if (isEditing.value) {
      await groupStore.updateGroup(selectedGroup.value.id, {
        number: form.value.name,
        departmentId: form.value.departmentId,
        capacity: form.value.capacity
      })
    }
    else {
      await groupStore.createGroup({
        number: form.value.name,
        departmentId: form.value.departmentId,
        capacity: form.value.capacity
      })
    }
    closeModal()
  }
  catch (error) {
    console.error('Error submitting form:', error)
  }
  finally {
    submitting.value = false
  }
}

const handleDelete = async() => {
  deleting.value = true
  try {
    await groupStore.removeGroup(selectedGroup.value.id)
    closeDeleteModal()
  }
  catch (error) {
    console.error('Error deleting group:', error)
  }
  finally {
    deleting.value = false
  }
}

onMounted(async() => {
  await departmentStore.fetchDepartments()
  await groupStore.fetchGroups()
})
</script>

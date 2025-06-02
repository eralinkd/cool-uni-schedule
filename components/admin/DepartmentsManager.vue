<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Управління кафедрами</h2>
      <UButton
        color="primary"
        @click="openCreateModal"
      >
        Додати кафедру
      </UButton>
    </div>

    <UTable
      :data="departments"
      :columns="columns"
      :loading="loading"
    >
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
              {{ isEditing ? 'Редагувати кафедру' : 'Нова кафедра' }}
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="closeModal"
            />
          </div>

          <form class="p-4" @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Назва
                </label>
                <UInput
                  v-model="form.name"
                  placeholder="Введіть назву кафедри"
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
            <h3 class="text-lg font-semibold">
              Підтвердження видалення
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="closeDeleteModal"
            />
          </div>

          <div class="p-4">
            <p>Ви впевнені, що хочете видалити кафедру "{{ selectedDepartment?.name }}"?</p>
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
const departmentStore = useDepartmentStore()

const columns = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Назва'
  },
  {
    id: 'actions',
    header: 'Дії'
  }
]

const departments = computed(() => {
  const data = departmentStore.departments
  return Array.isArray(data) ? data : []
})
const loading = computed(() => departmentStore.loading)

// Modal state
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const selectedDepartment = ref(null)
const submitting = ref(false)
const deleting = ref(false)

const form = ref({
  name: ''
})

// Methods
const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    name: ''
  }
  isModalOpen.value = true
}

const openEditModal = (department) => {
  isEditing.value = true
  selectedDepartment.value = department
  form.value = {
    name: department.name
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  form.value = {
    name: ''
  }
  selectedDepartment.value = null
}

const confirmDelete = (department) => {
  selectedDepartment.value = department
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  selectedDepartment.value = null
}

const handleSubmit = async() => {
  if (!form.value.name.trim()) {
    console.error('Name is required')
    return
  }

  submitting.value = true
  try {
    if (isEditing.value) {
      await departmentStore.updateDepartment(selectedDepartment.value.id, form.value)
      console.log('Department updated successfully')
    }
    else {
      await departmentStore.createDepartment(form.value)
      console.log('Department created successfully')
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
    await departmentStore.removeDepartment(selectedDepartment.value.id)
    console.log('Department deleted successfully')
    closeDeleteModal()
  }
  catch (error) {
    console.error('Error deleting department:', error)
  }
  finally {
    deleting.value = false
  }
}
</script>

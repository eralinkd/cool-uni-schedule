<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold mb-6 text-center">Авторизація</h2>
      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Логин
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
        <div v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </div>
        <div class="pt-4">
          <UButton
            color="primary"
            type="submit"
            :loading="submitting"
            class="w-full"
          >
            Увійти
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const submitting = ref(false)
const errorMessage = ref('')

const handleLogin = async() => {
  if (!form.value.username.trim() || !form.value.password) {
    errorMessage.value = 'Будь ласка, заповніть всі поля'
    return
  }

  submitting.value = true
  errorMessage.value = ''

  try {
    await authStore.login(form.value.username, form.value.password)
      .then(() => {
        if (authStore.roles.includes('ROLE_ADMIN')) {
          router.replace({ name: 'admin' })
        }
        else if (authStore.roles.includes('ROLE_PROFESSOR')) {
          router.replace({ name: 'professorDashboard' })
        }
        else if (authStore.roles.includes('ROLE_STUDENT')) {
          router.replace({ name: 'studentHome' })
        }
        else {
          router.replace({ name: 'login' })
        }
      })
  }
  catch (err) {
    errorMessage.value = 'Неправильний логін або пароль'
    console.error('Помилка авторизації:', err)
  }
  finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.min-h-screen {
  padding-top: 2rem;
}
</style>

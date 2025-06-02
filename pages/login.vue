<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold mb-6 text-center">Авторизация</h2>
      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Логин
          </label>
          <UInput
            v-model="form.username"
            placeholder="Введите логин"
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
            placeholder="Введите пароль"
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
            Войти
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
    errorMessage.value = 'Пожалуйста, заполните все поля'
    return
  }

  submitting.value = true
  errorMessage.value = ''

  try {
    await authStore.login(form.value.username, form.value.password)

    if (authStore.roles.includes('ROLE_ADMIN')) {
      await router.replace({ name: 'admin' })
    }
    else if (authStore.roles.includes('ROLE_PROFESSOR')) {
      await router.replace({ name: 'professorDashboard' })
    }
    else if (authStore.roles.includes('ROLE_STUDENT')) {
      await router.replace({ name: 'studentHome' })
    }
    else {
      await router.replace({ name: 'login' })
    }
  }
  catch (err) {
    errorMessage.value = 'Неверный логин или пароль'
    console.error('Ошибка авторизации:', err)
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

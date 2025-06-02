import axios from 'axios'
import { useAuthStore } from '~/stores/authStore'

export default defineNuxtPlugin(({ $config }) => {
  const authStore = useAuthStore()
  const api = axios.create({
    baseURL: $config.public.API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authStore.token}`
    }
  })

  return {
    provide: {
      api
    }
  }
})

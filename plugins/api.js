import axios from 'axios'

export default defineNuxtPlugin(({ $config }) => {
  const api = axios.create({
    baseURL: $config.public.API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })

  return {
    provide: {
      api
    }
  }
})

import axios from 'axios'

export default defineNuxtPlugin(({ $config }) => {
  const api = axios.create({
    baseURL: $config.public.API_URL,
    withCredentials: true
  })

  return {
    provide: {
      api
    }
  }
})

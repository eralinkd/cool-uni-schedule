import axios from 'axios'

export const useAuthApi = () => {
  const config = useRuntimeConfig()

  const postLogin = async(data) => {
    const response = await axios.post(`${config.public.API_URL}/api/auth/login`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  }

  return { postLogin }
}

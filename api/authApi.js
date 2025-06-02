import axios from 'axios'

export const useAuthApi = () => {
  const config = useRuntimeConfig()

  const postLogin = async(data) => {
    return await axios.post(
      `${config.public.API_URL}/api/auth/login`,
      data,
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  const getMe = async(token) => {
    return await axios.get(
      `${config.public.API_URL}/api/auth/getMe`,
      { params: { token } }
    )
  }

  return { postLogin, getMe }
}

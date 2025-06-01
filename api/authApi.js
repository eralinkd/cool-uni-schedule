import axios from 'axios'

export const useAuthApi = () => {
  const postLogin = async(data) => {
    const response = await axios.post('/api/auth/login', data)
    return response
  }

  return { postLogin }
}

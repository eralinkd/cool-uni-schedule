import { useAuthApi } from '~/api/authApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('accessToken'))
  const { postLogin } = useAuthApi()

  const login = async(username, password) => {
    const response = await postLogin({ username, password })
    user.value = response.data.user
    token.value = response.data.token
    localStorage.setItem('accessToken', token.value)
  }

  return { user, token, login }
})
